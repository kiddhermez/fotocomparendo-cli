import chalk from 'chalk';
import { Menu, MenuProps } from '../../../../functions/menu.js';
import { createSpinner } from 'nanospinner';
import { Driver } from '../../../../api/interfaces/driver.js';
import Table from 'cli-table3';
import { StopProps, stop } from '../../../../functions/stop.js';
import { add } from '../../../../functions/crud/add.js';
import { DriverKey } from './keys/Driver.key.js';
import { set } from '../../../../functions/crud/set.js';
import { del } from '../../../../functions/crud/del.js';
import inquirer from 'inquirer';
import {
    addDriver,
    delDriver,
    getDrivers,
    setDriver,
} from '../../../../api/index.js';

export async function admDrivers(path: string) {
    while (true) {
        const spinner = createSpinner('Cargando conductores...').start();
        const drivers = await getDrivers().then((data) => {
            spinner.success();
            return data;
        });

        const options = [
            'Ver Conductores',
            'Añadir Conductor',
            'Editar Conductor',
            'Eliminar Conductor',
            'Volver',
        ];

        const menuConf: MenuProps = {
            color: chalk.yellow,
            title: ` ADMINISTRAR CONDUCTORES (${drivers.data.length} conductores)`,
            message: 'Seleccione la opcion deseada:',
            options,
            path,
        };

        const option = await Menu(menuConf);

        if (option === 4) {
            break;
        }

        if (option === 0) {
            await printDrivers(drivers.data, path + ' 󰥭 ');
            continue;
        }

        if (option === 1) {
            await addDriverMenu(path + ' 󰥭 ', drivers.data);
            continue;
        }

        if (option === 2) {
            await editDriverMenu(path + ' 󰥭 ', drivers.data);
            continue;
        }

        if (option === 3) {
            await deleteDriverMenu(path + ' 󰥭 ', drivers.data);
            continue;
        }
    }
}

async function printDrivers(driver: Driver[], path: string) {
    const table = new Table({
        head: [
            'Primer Nombre',
            'Segundo Nombre',
            'Primer Apellido',
            'Segundo Apellido',
            'Cedula',
            'Fecha de Nacimiento',
        ],
    });
    driver.map((drive) => {
        return table.push(
            Object.values(drive).map((value) =>
                typeof value === 'string'
                    ? value.split('T')[1]
                        ? value.split('T')[0]
                        : value
                    : value
            )
        );
    });

    const stopSettings: StopProps = {
        title: 'Ver Conductores',
        color: chalk.yellow,
        path,
        data: async () => {
            console.log(table.toString());
        },
    };

    await stop(stopSettings);
}

async function addDriverMenu(path: string, driver: Driver[]) {
    const data = await add<Driver>({
        path,
        color: chalk.yellow,
        object: driver,
        title: 'Conductor',
        keys: DriverKey,
    });

    const spinner = createSpinner('Añadiendo conductor...').start();
    await addDriver(data).then(() => {
        spinner.success();
    });

    await stop({
        title: 'Añadir Conductor',
        color: chalk.yellow,
        path,
        data: async () => {
            console.log('Conductor añadido con exito');
        },
    });
}

async function editDriverMenu(path: string, driver: Driver[]) {
    const { data, objectToEdit: driverToEdit } = await set<Driver>({
        path,
        color: chalk.yellow,
        object: driver,
        title: 'Conductor',
        keys: DriverKey,
    });

    let result: string = 'Operacion cancelada';

    if (JSON.stringify(data) !== '{}') {
        const spinner = createSpinner('Editando conductor...').start();
        await setDriver(driverToEdit.cedula, data).then(() => {
            spinner.success();
        });
        result = 'Conductor editado con exito';
    }

    await stop({
        title: 'Editar Conductor',
        color: chalk.yellow,
        path,
        data: async () => {
            console.log(result);
        },
    });
}

async function deleteDriverMenu(path: string, driver: Driver[]) {
    const objectToDelete = await del<Driver>({
        path,
        color: chalk.yellow,
        object: driver,
        title: 'Conductor',
        keys: DriverKey,
    });

    const table = new Table({ head: Object.keys(objectToDelete) });
    table.push(Object.values(objectToDelete));
    
    const confirm = await inquirer.prompt([
        {
            name: 'confirm',
            message: '¿Esta seguro que desea eliminar este conductor?',
            type: 'confirm',
            default: false,
        },
    ]);

    let result = 'Operacion cancelada';

    if (confirm.confirm) {
        const spinner = createSpinner('Eliminando conductor...').start();
        await delDriver(objectToDelete.cedula).then(() => {
            spinner.success();
        });
        result = 'Conductor eliminado con exito';
    }

    await stop({
        title: 'Eliminar Conductor',
        color: chalk.yellow,
        path,
        data: async () => {
            console.log(result);
        },
    });
}
