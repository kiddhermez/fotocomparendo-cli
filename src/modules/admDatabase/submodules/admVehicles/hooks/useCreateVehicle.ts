import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import { getDrivers } from '../../../../../api/index.js';
import { Vehicle } from '../../../../../api/interfaces/vehicle.js';
import { add } from '../../../../../functions/crud/add.js';
import { FormatedVehicle } from '../interfaces/formatedVehicle.js';
import { VehicleKey } from '../keys/vehicle.key.js';
import { VehicleColors } from '../../../../../api/interfaces/vehicleColors.js';
import { VehicleType } from '../../../../../api/interfaces/vehicleType.js';

export async function useCreateVehicle(
    path: string,
    vehicle: FormatedVehicle[],
    colors: VehicleColors[],
    types: VehicleType[]
) {
    const data = await add<FormatedVehicle>({
        path,
        color: chalk.yellow,
        object: vehicle,
        title: 'Vehicle',
        keys: VehicleKey,
    });

    const otherData = await inquirer.prompt([
        {
            name: 'color',
            message: 'Seleccione el color:',
            type: 'list',
            choices: colors.map((color) => ({
                name: color.color,
                value: color.id_color,
            })),
        },
        {
            name: 'type',
            message: 'Seleccione el tipo:',
            type: 'list',
            choices: types.map((type) => ({
                name: type.tipo,
                value: type.codigo,
            })),
        },
    ]);

    data.color = otherData.color;
    data.tipo = otherData.type;

    const spinner = createSpinner('Cargando conductores...').start();
    const { data: drivers } = await getDrivers().then((data) => {
        spinner.success();
        return data;
    });

    const { driver } = await inquirer.prompt([
        {
            name: 'driver',
            message: 'Seleccione el conductor:',
            type: 'list',
            choices: drivers.map((driver) => ({
                name: driver.cedula + ' - ' + driver.nombre1,
                value: driver.cedula,
            })),
        },
    ]);

    data.cedula = driver;
    const [letra, numero] = data.placa.split('-');

    const newVehicle: Vehicle = {
        linea: data.linea,
        marca: data.marca,
        id_color: data.color,
        codigo: data.tipo,
        soat: {
            costo: data.costo,
            nro_poliza: data.nro_poliza,
            fecha_vigencia: data.fecha_vigencia,
        },
        tecnomecanica: {
            nro_acreditacion: data.nro_acreditacion,
            fecha_expedicion: data.fecha_expedicion,
        },
        cedula: data.cedula,
        letra,
        numero,
    };

    return newVehicle;
}
