import chalk from 'chalk';
import { stop } from '../../../../functions/stop.js';
import { addTicket } from '../../../../api/index.js';
import { useAddTicket } from './hooks/useAddTicket.js';
import { createSpinner } from 'nanospinner';

export async function addTicketMenu(path: string) {
    const newTicket = await useAddTicket(path);

    const spinner = createSpinner('Creando infraccion...').start();
    await addTicket(newTicket).then(() => {
        spinner.success();
    });

    await stop({
        title: 'Añadir Infraccion',
        color: chalk.yellow,
        path,
        data: async () => {
            console.log('Infraccion añadida con exito');
        },
    });
}
