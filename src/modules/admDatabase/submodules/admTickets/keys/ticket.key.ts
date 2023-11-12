import { keyProps } from '../../../../../../interfaces/keys.js';

export const TicketKey: keyProps[] = [
    {
        name: 'costo_inf',
        customName: 'Costo Infraccion',
        type: /(\d{6,11})/,
    },
    {
        name: 'velocidad',
        customName: 'Velocidad (Km/h)',
        type: /(\d{1,3})/,
    },
    {
        name: 'longitud',
        customName: 'Longitud',
        type: /^(-?\d+(\.\d+)?)$/,
    },
    {
        name: 'latitud',
        customName: 'Latitud',
        type: /^(-?\d+(\.\d+)?)$/,
    },
    {
        name: 'fecha',
        customName: 'Fecha (YYYY-MM-DD)',
        type: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\s([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
    },
    {
        name: 'id_comuna',
        customName: 'Comuna',
        skip: true,
    },
    {
        name: 'placa',
        customName: 'Placa Vehiculo',
        skip: true,
    },
    {
        name: 'cod_infraccion',
        customName: 'Codigo Infraccion',
        skip: true,
    },
];
