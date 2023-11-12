import { keyProps } from '../../../../interfaces/keys.js';

export const TicketByComuneKey: keyProps[] = [
    {
        name: 'cedula',
        customName: 'Cedula',
    },
    {
        name: 'nombre1',
        customName: 'Primer Nombre',
    },
    {
        name: 'apellido1',
        customName: 'Primer Apellido',
    },
    {
        name: 'placa',
        customName: 'Placa Vehiculo (AAA-999)',
    },
    {
        name: 'costo',
        customName: 'Costo Infraccion',
    },
    {
        name: 'cod_infraccion',
        customName: 'Codigo Infraccion',
        isPrimaryKey: true,
    },
    {
        name: 'velocidad',
        customName: 'Velocidad (Km/h)',
    },
    {
        name: 'longitud',
        customName: 'Longitud',
    },
    {
        name: 'latitud',
        customName: 'Latitud',
    },
    {
        name: 'fecha',
        customName: 'Fecha Infraccion (YYYY-MM-DD)',
    },
    {
        name: 'id_comuna',
        customName: 'Comuna',
    },
];
