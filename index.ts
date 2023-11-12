import { admDB } from './src/modules/admDatabase/admDB.js';
import { MenuProps, Menu } from './src/functions/menu.js';
import chalk from 'chalk';
import { admTickets } from './src/modules/admTickets/admTickets.js';
import { createSpinner } from 'nanospinner';
import { loading } from './src/functions/loading.js';

async function index() {
    while (true) {
        const options = [
            'Administrar Base de Datos',
            'Administrar Infracciones',
            'Salir',
        ];

        const menuConf: MenuProps = {
            color: chalk.blue,
            title: ' Menu Principal',
            message: 'Bienvenido, que desea realizar: ',
            options: options,
        };

        const option = await Menu(menuConf);

        if (option === 2) {
            await loading('Cerrando sistema...', 2000);
            break;
        }

        if (option === 0) {
            await loading('Cargando base de datos...', 2000);
            await admDB('');
        }

        if (option === 1) {
            await loading('Cargando sistema de infracciones...', 2000);
            await admTickets('');
        }
    }
}

await loading('Cargando sistema FotoComparendo...', 2000);
await index();

console.log(chalk.green('Gracias por usar FotoComparendo!'));
