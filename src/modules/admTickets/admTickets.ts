import { Login } from '../../functions/login.js';
import { Menu, MenuProps } from '../../functions/menu.js';
import chalk from 'chalk';
import Table from 'cli-table3';
import { StopProps, stop } from '../../functions/stop.js';
import { createSpinner } from 'nanospinner';
import { delTicket, getTicketsByComune } from '../../api/index.js';
import { del } from '../../functions/crud/del.js';
import inquirer from 'inquirer';
import { TicketByComune } from '../../api/interfaces/ticketByComune.js';
import { TicketByComuneKey } from './keys/ticketByComune.key.js';
import { loading } from '../../functions/loading.js';

export async function admTickets(path: string) {
    const { location } = await Login(chalk.green);
    await loading('Iniciando sesion...', 2000);
    while (true) {
        let spinner = createSpinner(
            `Cargando infracciones de la comuna ${location.nom_comuna}...`
        ).start();
        const tickets = await getTicketsByComune(location.id_comuna).then(
            (data) => {
                spinner.success();
                return data;
            }
        );
        let message = `Que desea realizar en la comuna ${location.nom_comuna}?`;
        let options = ['Ver Infracciones', 'Pagar Infraccion', 'Cerrar Sesion'];

        if (!tickets.data) {
            options = ['Cerrar Sesion'];
            message = 'No hay infracciones en esta comuna';
        }

        const length = tickets.data ? tickets.data.length : 0;

        const menuConf: MenuProps = {
            color: chalk.green,
            title: `󱧜 ADMINISTRAR INFRACCIONES (${length} infracciones)`,
            message: message,
            options,
            path,
            showUser: true,
        };

        const option = await Menu(menuConf);

        if (options[option] === 'Cerrar Sesion') {
            await loading('Cerrando sesion...', 2000);
            break;
        }

        if (options[option] === 'Ver Infracciones') {
            await printTickets(path + ' 󰥭 󱧜', tickets.data);
        }

        if (options[option] === 'Pagar Infraccion') {
            await deleteTicketMenu(path + ' 󰥭 󱧜', tickets.data);
        }
    }
}

async function printTickets(path: string, tickets: TicketByComune[]) {
    const table = new Table({ head: Object.keys(tickets[0]) });
    tickets.map((ticket) => {
        return table.push(Object.values(ticket));
    });

    const stopSettings: StopProps = {
        title: 'Ver Infracciones',
        color: chalk.green,
        path,
        showUser: true,
        data: async () => {
            console.log(table.toString());
        },
    };

    await stop(stopSettings);
}

async function deleteTicketMenu(path: string, ticket: TicketByComune[]) {
    const objectToDelete = await del<TicketByComune>({
        path,
        color: chalk.green,
        object: ticket,
        title: '',
        customTitle: 'Pagar Infraccion',
        keys: TicketByComuneKey,
        showUser: true,
    });

    const table = new Table({ head: Object.keys(objectToDelete) });
    table.push(Object.values(objectToDelete));

    const confirm = await inquirer.prompt([
        {
            name: 'confirm',
            message: '¿Esta seguro que desea pagar esta infracción?',
            type: 'confirm',
            default: false,
        },
    ]);

    let result = 'Operacion cancelada';

    if (confirm.confirm) {
        const spinner = createSpinner(
            'Procesando pago de infracción...'
        ).start();
        await delTicket(objectToDelete.cod_infraccion).then(() => {
            spinner.success();
        });
        result = 'Pago de infracción procesado con exito';
    }

    await stop({
        title: 'Pagar Infracción',
        color: chalk.green,
        path,
        showUser: true,
        data: async () => {
            console.log(result);
        },
    });
}
