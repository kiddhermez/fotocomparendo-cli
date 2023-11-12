import chalk from 'chalk';
import { Menu, MenuProps } from '../../../../functions/menu.js';
import Table from 'cli-table3';
import { useVehicle } from './hooks/useVehicle.js';
import { FormatedVehicle } from './interfaces/formatedVehicle.js';
import { StopProps, stop } from '../../../../functions/stop.js';
import inquirer from 'inquirer';
import { VehicleColors } from '../../../../api/interfaces/vehicleColors.js';
import { VehicleType } from '../../../../api/interfaces/vehicleType.js';
import {
    addVehicle,
    delVehicle,
    setSoat,
    setTechno,
    setVehicle,
} from '../../../../api/index.js';
import { useCreateVehicle } from './hooks/useCreateVehicle.js';
import { useUpdateVehicle } from './hooks/useUpdateVehicle.js';
import { del } from '../../../../functions/crud/del.js';
import { VehicleKey } from './keys/vehicle.key.js';
import { createSpinner } from 'nanospinner';

export async function admVehicles(path: string) {
    while (true) {
        const { vehicles, colors, types } = await useVehicle();

        const options = [
            'Ver Vehiculos',
            'Añadir Vehiculo',
            'Editar Vehiculo',
            'Eliminar Vehiculo',
            'Volver',
        ];

        const menuConf: MenuProps = {
            color: chalk.yellow,
            title: `󰄋 ADMINISTRAR VEHICULOS (${vehicles.length} vehiculos)`,
            message: 'Seleccione la opcion deseada:',
            options,
            path,
        };

        const option = await Menu(menuConf);

        if (option === 4) {
            break;
        }

        if (option === 0) {
            await printVehicles(vehicles, path + ' 󰥭 󰄋 ');
            continue;
        }

        if (option === 1) {
            await addVehicleMenu(path + ' 󰥭 󰄋 ', vehicles, colors, types);
            continue;
        }

        if (option === 2) {
            await editVehicleMenu(path + ' 󰥭 󰄋 ', vehicles, colors, types);
            continue;
        }

        if (option === 3) {
            await deleteVehicleMenu(path, vehicles);
            continue;
        }
    }
}

async function printVehicles(vehicle: FormatedVehicle[], path: string) {
    const table = new Table({
        head: [
            'Placa',
            'Linea',
            'Marca',
            'Cedula',
            'Color',
            'Tipo',
            'Numero Tecnomecanica',
            'Fecha Expedicion',
            'Fecha Vencimiento',
            'Costo Soat',
            'Numero Soat',
            'Fecha Vigencia',
            'Fecha Final',
        ],
    });
    vehicle.map((drive) => {
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
        title: 'Ver Vehiculoes',
        color: chalk.yellow,
        path,
        data: async () => {
            console.log(table.toString());
        },
    };

    await stop(stopSettings);
}

async function addVehicleMenu(
    path: string,
    vehicle: FormatedVehicle[],
    colors: VehicleColors[],
    types: VehicleType[]
) {
    const newVehicle = await useCreateVehicle(path, vehicle, colors, types);

    const spinner = createSpinner('Añadiendo Vehiculo...').start();
    await addVehicle(newVehicle).then(() => {
        spinner.success();
    });

    await stop({
        title: 'Añadir Vehiculo',
        color: chalk.yellow,
        path,
        data: async () => {
            console.log('Vehiculo añadido con exito');
        },
    });
}

async function editVehicleMenu(
    path: string,
    vehicle: FormatedVehicle[],
    colors: VehicleColors[],
    types: VehicleType[]
) {
    const { editTechno, editSoat, editVehicle, result } =
        await useUpdateVehicle(path, vehicle, colors, types);

    let spinner;

    const processTechno = async () => {
        (spinner = createSpinner('Editando Tecnomecanica...').start()),
            await setTechno(
                editTechno.nro_acreditacion,
                editTechno.newTechno
            ).then(() => spinner.success());
    };

    const processSoat = async () => {
        spinner = createSpinner('Editando Soat...').start();
        await setSoat(editSoat.nro_poliza, editSoat.newSoat).then(() =>
            spinner.success()
        );
    };

    const processVehicle = async () => {
        spinner = createSpinner('Editando Vehiculo...').start();
        await setVehicle(
            editVehicle.plate_letter,
            editVehicle.plate_number,
            editVehicle.newVehicle
        ).then(() => spinner.success());
    };

    editTechno.isEdited && (await processTechno());
    editSoat.isEdited && (await processSoat());
    editVehicle.isEdited && (await processVehicle());

    await stop({
        title: 'Editar Vehiculo',
        color: chalk.yellow,
        path,
        data: async () => {
            console.log(result);
        },
    });
}

export async function deleteVehicleMenu(
    path: string,
    vehicle: FormatedVehicle[]
) {
    const objectToDelete = await del<FormatedVehicle>({
        path,
        color: chalk.yellow,
        object: vehicle,
        title: 'Vehiculo',
        keys: VehicleKey,
    });

    const table = new Table({ head: Object.keys(objectToDelete) });
    table.push(Object.values(objectToDelete));

    const confirm = await inquirer.prompt([
        {
            name: 'confirm',
            message: '¿Esta seguro que desea eliminar este vehiculo?',
            type: 'confirm',
            default: false,
        },
    ]);

    let result = 'Operacion cancelada';
    const [plate_letter, plate_number] = objectToDelete.placa.split('-');
    if (confirm.confirm) {
        const spinner = createSpinner('Eliminando vehiculo...').start();
        await delVehicle(plate_letter, plate_number).then(() => {
            spinner.success();
        });
        result = 'Vehiculo eliminado con exito';
    }

    await stop({
        title: 'Eliminar Vehiculo',
        color: chalk.yellow,
        path,
        data: async () => {
            console.log(result);
        },
    });
}
