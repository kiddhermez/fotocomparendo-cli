import chalk from 'chalk';
import { License } from '../../../../../api/interfaces/license.js';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import { getDrivers, getCategories } from '../../../../../api/index.js';
import { add } from '../../../../../functions/crud/add.js';
import { LicenseKey } from '../keys/license.key.js';

export async function useAddLicense(path: string, license: License[]) {
    const data = await add<License>({
        path,
        color: chalk.yellow,
        object: license,
        title: 'Licencia',
        keys: LicenseKey,
    });

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

    spinner = createSpinner('Cargando categorias de licencia...').start();
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
                name: category.cod_categoria + ' - ' + category.clase_vehiculo,
                value: category.cod_categoria,
            })),
        },
    ]);

    const newLicense: License = {
        nro_lic: data.nro_lic,
        cod_categoria: category,
        fecha_expedicion: data.fecha_expedicion,
        fecha_vencimiento: data.fecha_vencimiento,
        cedula: driver,
    };

    return newLicense;
}
