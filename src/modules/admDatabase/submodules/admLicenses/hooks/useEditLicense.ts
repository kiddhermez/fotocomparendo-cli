import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import { getDrivers, getCategories } from '../../../../../api/index.js';
import { License } from '../../../../../api/interfaces/license.js';
import { set } from '../../../../../functions/crud/set.js';
import { LicenseKey } from '../keys/license.key.js';

export async function useEditLicense(path: string, license: License[]) {
    const {
        data,
        objectToEdit: licenseToEdit,
        infoToEdit,
    } = await set<License>({
        path,
        color: chalk.yellow,
        object: license,
        title: 'Licencia',
        keys: LicenseKey,
    });

    const newLicense: License = {
        nro_lic: data.nro_lic,
        fecha_expedicion: data.fecha_expedicion,
        fecha_vencimiento: data.fecha_vencimiento,
    };

    if (infoToEdit.find((info) => info.name === 'cedula')) {
        let spinner = createSpinner('Cargando conductores...').start();
        const drivers = await getDrivers().then((data) => {
            spinner.success();
            return data;
        });
        const { driver } = await inquirer.prompt([
            {
                name: 'driver',
                message: 'Seleccione el conductor:',
                type: 'list',
                choices: drivers.data.map((driver) => ({
                    name: driver.cedula + ' - ' + driver.nombre1,
                    value: driver.cedula,
                })),
            },
        ]);

        newLicense.cedula = driver;
    }

    if (infoToEdit.find((info) => info.name === 'cod_categoria')) {
        let spinner = createSpinner(
            'Cargando categorias de licencia...'
        ).start();
        const categories = await getCategories().then((data) => {
            spinner.success();
            return data;
        });
        const { category } = await inquirer.prompt([
            {
                name: 'category',
                message: 'Seleccione la categoria:',
                type: 'list',
                choices: categories.data.map((category) => ({
                    name:
                        category.cod_categoria +
                        ' - ' +
                        category.clase_vehiculo,
                    value: category.cod_categoria,
                })),
            },
        ]);

        newLicense.cod_categoria = category;
    }

    let result = 'Licencia editada con exito';
    if (JSON.stringify(newLicense) === '{}') {
        result = 'Operacion cancelada';
    }

    return {
        newLicense: {
            newLicense,
            licenseToEdit: licenseToEdit.nro_lic,
            isEdited: JSON.stringify(newLicense) !== '{}',
        },
        result,
    };
}
