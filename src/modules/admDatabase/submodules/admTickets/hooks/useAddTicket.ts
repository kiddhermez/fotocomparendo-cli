import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import {
    getComunes,
    getTickets,
    getVehicles,
} from '../../../../../api/index.js';
import { Ticket } from '../../../../../api/interfaces/ticket.js';
import { add } from '../../../../../functions/crud/add.js';
import { TicketKey } from '../keys/ticket.key.js';

export async function useAddTicket(path: string) {
    let spinner = createSpinner('Cargando infracciones...').start();
    const tickets = await getTickets().then((data) => {
        spinner.success();
        return data;
    });

    const data = await add<Ticket>({
        path,
        icon: '󱧜 ',
        color: chalk.yellow,
        object: tickets.data,
        title: 'Infraccion',
        keys: TicketKey,
    });

    spinner = createSpinner('Cargando comunas...').start();
    const comunas = await getComunes().then((data) => {
        spinner.success();
        return data;
    });
    const { comuna } = await inquirer.prompt([
        {
            name: 'comuna',
            message: 'Seleccione la comuna:',
            type: 'list',
            choices: comunas.data.map((comuna) => ({
                name: comuna.nom_comuna,
                value: comuna.id_comuna,
            })),
        },
    ]);
    spinner = createSpinner('Cargando vehiculos...').start();
    const vehicles = await getVehicles().then((data) => {
        spinner.success();
        return data;
    });
    const { placa: vehicle } = await inquirer.prompt([
        {
            name: 'placa',
            message: 'Seleccione el vehiculo:',
            type: 'list',
            choices: vehicles.data.map((vehicle) => ({
                name: vehicle.placa,
                value: vehicle.placa,
            })),
        },
    ]);
    const [placa_letter, placa_number] = vehicle.split('-');

    const newTicket: Ticket = {
        cod_infraccion: data.cod_infraccion,
        fecha: data.fecha,
        costo_inf: Number.parseInt(`${data.costo_inf}`),
        latitud: Number.parseFloat(`${data.latitud}`),
        longitud: Number.parseFloat(`${data.longitud}`),
        velocidad: data.velocidad,
        id_comuna: comuna,
        numero: placa_number,
        letra: placa_letter,
    };

    return newTicket;
}
