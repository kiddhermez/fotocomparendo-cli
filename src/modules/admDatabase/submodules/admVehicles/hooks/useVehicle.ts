import { createSpinner } from 'nanospinner';
import {
    getVehicles,
    getColors,
    getVehicleTypes,
    getSoat,
    getTechno,
} from '../../../../../api/index.js';
import { FormatedVehicle } from '../interfaces/formatedVehicle.js';

export async function useVehicle() {
    let spinner = createSpinner('Cargando vehiculos...').start();
    const vehicles = await getVehicles().then((data) => {
        spinner.success();
        return data;
    });
    spinner = createSpinner('Cargando colores...').start();
    const colors = await getColors().then((data) => {
        spinner.success();
        return data;
    });
    spinner = createSpinner('Cargando tipos...').start();
    const types = await getVehicleTypes().then((data) => {
        spinner.success();
        return data;
    });
    spinner = createSpinner('Cargando soat de cada vehiculo...').start();
    const soats = await getSoat().then((data) => {
        spinner.success();
        return data;
    });
    spinner = createSpinner(
        'Cargandotecnomecanica de cada vehiculo...'
    ).start();
    const technos = await getTechno().then((data) => {
        spinner.success();
        return data;
    });

    const finalVehicles: FormatedVehicle[] = vehicles.data.map((vehicle) => {
        const soat = soats.data.find(
            (soat) => soat.nro_poliza === vehicle.nro_poliza
        );
        const techno = technos.data.find(
            (techno) => techno.nro_acreditacion === vehicle.nro_acreditacion
        );
        return {
            placa: vehicle.placa,
            linea: vehicle.linea,
            marca: vehicle.marca,
            cedula: vehicle.cedula,
            color: colors.data.find(
                (color) => color.id_color === vehicle.id_color
            ).color,
            tipo: types.data.find((type) => type.codigo === vehicle.codigo)
                .tipo,
            ...techno,
            ...soat,
        };
    });

    return {
        vehicles: finalVehicles,
        colors: colors.data,
        types: types.data,
        soats: soats.data,
        technos: technos.data,
    };
}
