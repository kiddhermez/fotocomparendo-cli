import chalk from 'chalk';
import { Menu, MenuProps } from '../../../../functions/menu.js';
import { createSpinner } from 'nanospinner';
import { Driver } from '../../../../api/interfaces/driver.js';
import Table from 'cli-table3';
import { StopProps, stop } from '../../../../functions/stop.js';
import { add } from '../../../../functions/crud/add.js';
import { set } from '../../../../functions/crud/set.js';
import { del } from '../../../../functions/crud/del.js';
import inquirer from 'inquirer';
import {
    addDriver,
    addLicense,
    delDriver,
    delLicense,
    getCategories,
    getDrivers,
    getLicenses,
    setDriver,
    setLicense,
} from '../../../../api/index.js';
import { License } from '../../../../api/interfaces/license.js';
import { LicenseKey } from './keys/license.key.js';
import { useAddLicense } from './hooks/useAddLicense.js';
import { useEditLicense } from './hooks/useEditLicense.js';

export async function admLicenses(path: string) {
    while (true) {
        const spinner = createSpinner('Cargando licencias...').start();
        const licenses = await getLicenses().then((data) => {
            spinner.success();
            return data;
        });

        const options = [
            'Ver Licencias',
            'Añadir Licencia',
            'Editar Licencia',
            'Eliminar Licencia',
            'Volver',
        ];

        const menuConf: MenuProps = {
            color: chalk.yellow,
            title: ` ADMINISTRAR LICENCIAS (${licenses.data.length} licencias)`,
            message: 'Seleccione la opcion deseada:',
            options,
            path,
        };

        const option = await Menu(menuConf);

        if (option === 4) {
            break;
        }

        if (option === 0) {
            await printLicenses(licenses.data, path + ' 󰥭 ');
            continue;
        }

        if (option === 1) {
            await addLicenseMenu(path + ' 󰥭 ', licenses.data);
            continue;
        }

        if (option === 2) {
            await editLicenseMenu(path + ' 󰥭 ', licenses.data);
            continue;
        }

        if (option === 3) {
            await deleteLicenseMenu(path + ' 󰥭 ', licenses.data);
            continue;
        }
    }
}

async function printLicenses(license: License[], path: string) {
    const table = new Table({
        head: [
            'Numero de Licencia',
            'Fecha de Expedicion',
            'Fecha de Vencimiento',
            'Cedula del Conductor',
            'Categoria',
        ],
    });
    license.map((drive) => {
        return table.push(
            Object.values(drive).map(
                (value) =>
                    (typeof value === 'string' &&
                        (value.split('T')[1] ? value.split('T')[0] : value)) ||
                    value
            )
        );
    });

    const stopSettings: StopProps = {
        title: 'Ver Licencias',
        color: chalk.yellow,
        path,
        data: async () => {
            console.log(table.toString());
        },
    };

    await stop(stopSettings);
}

async function addLicenseMenu(path: string, license: License[]) {
    const newLicense = await useAddLicense(path, license);

    const spinner = createSpinner('Creando licencia...').start();
    await addLicense(newLicense).then(() => {
        spinner.success();
    });

    await stop({
        title: 'Añadir Licencia',
        color: chalk.yellow,
        path,
        data: async () => {
            console.log('Licencia añadida con exito');
        },
    });
}

async function editLicenseMenu(path: string, license: License[]) {
    const { result, newLicense } = await useEditLicense(path, license);

    const spinner = createSpinner('Editando licencia...').start();
    newLicense.isEdited &&
        (await setLicense(newLicense.licenseToEdit, newLicense.newLicense).then(
            () => {
                spinner.success();
            }
        ));
    await stop({
        title: 'Editar Licencia',
        color: chalk.yellow,
        path,
        data: async () => {
            console.log(result);
        },
    });
}

export async function deleteLicenseMenu(path: string, license: License[]) {
    const objectToDelete = await del<License>({
        path,
        color: chalk.yellow,
        object: license,
        title: 'Licencia',
        keys: LicenseKey,
    });

    const table = new Table({ head: Object.keys(objectToDelete) });
    table.push(Object.values(objectToDelete));

    const confirm = await inquirer.prompt([
        {
            name: 'confirm',
            message: '¿Esta seguro que desea eliminar esta licencia?',
            type: 'confirm',
            default: false,
        },
    ]);

    let result = 'Operacion cancelada';

    if (confirm.confirm) {
        const spinner = createSpinner('Eliminando licencia...').start();
        await delLicense(objectToDelete.nro_lic).then(() => {
            spinner.success();
        });
        result = 'Licencia eliminada con exito';
    }

    await stop({
        title: 'Eliminar Licencia',
        color: chalk.yellow,
        path,
        data: async () => {
            console.log(result);
        },
    });
}
