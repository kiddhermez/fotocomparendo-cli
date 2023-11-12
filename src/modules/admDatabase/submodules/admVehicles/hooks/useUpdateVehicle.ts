import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import { getDrivers } from '../../../../../api/index.js';
import { Soat } from '../../../../../api/interfaces/soat.js';
import { Techno } from '../../../../../api/interfaces/techno.js';
import { Vehicle } from '../../../../../api/interfaces/vehicle.js';
import { VehicleColors } from '../../../../../api/interfaces/vehicleColors.js';
import { VehicleType } from '../../../../../api/interfaces/vehicleType.js';
import { set } from '../../../../../functions/crud/set.js';
import { FormatedVehicle } from '../interfaces/formatedVehicle.js';
import { VehicleKey } from '../keys/vehicle.key.js';
import { stop } from '../../../../../functions/stop.js';

export async function useUpdateVehicle(
    path: string,
    vehicle: FormatedVehicle[],
    colors: VehicleColors[],
    types: VehicleType[]
) {
    const {
        data,
        objectToEdit: vehicleToEdit,
        infoToEdit,
    } = await set<FormatedVehicle>({
        path,
        color: chalk.yellow,
        object: vehicle,
        title: 'Conductor',
        keys: VehicleKey,
    });
    let [color, type, cedula] = '';
    if (infoToEdit.find((key) => key.name === 'color')) {
        const { color } = await inquirer.prompt([
            {
                name: 'color',
                message: 'Seleccione el color:',
                type: 'list',
                choices: colors.map((color) => ({
                    name: color.color,
                    value: color.id_color,
                })),
            },
        ]);
        data.color = color;
    }

    if (infoToEdit.find((key) => key.name === 'tipo')) {
        const { type } = await inquirer.prompt([
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

        data.tipo = type;
    }

    if (infoToEdit.find((key) => key.name === 'cedula')) {
        let spinner = createSpinner('Cargando Conductores...').start();
        const { data: drivers } = await getDrivers().then((data) => {
            spinner.stop();
            return data;
        });

        const { cedula } = await inquirer.prompt([
            {
                name: 'cedula',
                message: 'Cedula:',
                type: 'list',
                choices: drivers.map((driver) => ({
                    name: driver.cedula,
                    value: driver.cedula,
                })),
            },
        ]);
        data.cedula = cedula;
    }

    if (data.placa) {
        const [letra, numero] = data.placa.split('-');
        data.letra = letra;
        data.numero = numero;
    }

    const finalVehicle: Vehicle = {
        letra: data.letra ?? vehicleToEdit.letra,
        numero: data.numero,
        linea: data.linea,
        marca: data.marca,
        cedula: data.cedula,
        id_color: data.color,
        codigo: data.tipo,
        nro_acreditacion: data.nro_acreditacion,
        nro_poliza: data.nro_poliza,
    };

    const finalSoat: Soat = {
        costo: data.costo && Number.parseInt(`${data.costo}`),
        nro_poliza: data.nro_poliza,
        fecha_vigencia: data.fecha_vigencia,
    };

    const finalTechno: Techno = {
        nro_acreditacion: data.nro_acreditacion,
        fecha_expedicion: data.fecha_expedicion,
    };

    const [plate_letter, plate_number] = vehicleToEdit.placa.split('-');

    let result;
    if (JSON.stringify(infoToEdit) !== '[]') {
        result = 'Vehiculo editado con exito';
    } else {
        result = 'Operacion cancelada';
    }

    return {
        editVehicle: {
            newVehicle: finalVehicle,
            plate_letter,
            plate_number,
            isEdited: JSON.stringify(finalVehicle) !== '{}',
        },
        editSoat: {
            newSoat: finalSoat,
            nro_poliza: vehicleToEdit.nro_poliza,
            isEdited: JSON.stringify(finalSoat) !== '{}',
        },
        editTechno: {
            newTechno: finalTechno,
            nro_acreditacion: vehicleToEdit.nro_acreditacion,
            isEdited: JSON.stringify(finalTechno) !== '{}',
        },
        result,
    };
}
