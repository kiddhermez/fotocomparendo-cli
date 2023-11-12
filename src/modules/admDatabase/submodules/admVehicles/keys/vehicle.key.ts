import { keyProps } from '../../../../../../interfaces/keys.js';

export const VehicleKey: keyProps[] = [
    {
        name: 'placa',
        customName: 'Placa (AAA-999)',
        isPrimaryKey: true,
        type: /^[A-Za-z]{3}-\d{3}$/,
    },
    {
        name: 'linea',
        customName: 'Linea',
    },
    {
        name: 'marca',
        customName: 'Marca',
    },
    {
        name: 'color',
        customName: 'Color',
        skip: true,
    },
    {
        name: 'tipo',
        customName: 'Tipo',
        skip: true,
    },
    {
        name: 'cedula',
        customName: 'Cedula Conductor',
        skip: true,
    },
    {
        name: 'nro_acreditacion',
        customName: 'Nro Acreditacion Tecnomecanica',
        type: /^\d{15}$/,
        isPrimaryKey: true,
    },
    {
        name: 'fecha_expedicion',
        customName: 'Fecha Expedicion Tecnomecanica (YYYY-MM-DD)',
        type: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
    },
    {
        name: 'costo',
        customName: 'Costo Soat',
        type: /(\d{6,11})/,
    },
    {
        name: 'nro_poliza',
        customName: 'Nro Poliza Soat',
        type: /^\d{17}$/,
        isPrimaryKey: true,
    },
    {
        name: 'fecha_vigencia',
        customName: 'Fecha Vigencia Soat (YYYY-MM-DD)',
        type: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
    },
];
