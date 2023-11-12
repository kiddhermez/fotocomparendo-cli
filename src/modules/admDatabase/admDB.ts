import { Menu, MenuProps } from '../../functions/menu.js';
import chalk from 'chalk';
import { admDrivers } from './submodules/admDrivers/admDrivers.js';
import { admVehicles } from './submodules/admVehicles/admVehicles.js';
import { addTicketMenu } from './submodules/admTickets/admTickets.js';
import { admLicenses } from './submodules/admLicenses/admLicenses.js';
import { loading } from '../../functions/loading.js';

export async function admDB(path: string) {
    while (true) {
        const options = [
            'Administrar Conductores',
            'Administrar Vehiculos',
            'Administrar Licencias',
            'Añadir Infracciones',
            'Volver',
        ];

        const menuConf: MenuProps = {
            color: chalk.yellow,
            title: ' ADMINISTRAR BASE DE DATOS',
            message: '¿Que desea administrar?',
            options,
            path,
        };

        const option = await Menu(menuConf);

        if (option === 4) {
            await loading('Cerrando base de datos...', 2000);
            break;
        }

        if (option === 0) {
            await admDrivers(path + ' 󰥭 ');
        }

        if (option === 1) {
            await admVehicles(path + ' 󰥭 ');
        }

        if (option === 2) {
            await admLicenses(path + ' 󰥭 ');
        }

        if (option === 3) {
            await addTicketMenu(path + ' 󰥭 ');
        }
    }
}
