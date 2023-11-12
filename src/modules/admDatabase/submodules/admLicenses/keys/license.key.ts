import { keyProps } from '../../../../../../interfaces/keys.js';

export const LicenseKey: keyProps[] = [
    {
        name: 'nro_lic',
        customName: 'Numero de Licencia',
        isPrimaryKey: true,
        type: /^\d{15}$/,
    },
    {
        name: 'fecha_expedicion',
        customName: 'Fecha Expedicion (YYYY-MM-DD)',
        type: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
    },
    {
        name: 'fecha_vencimiento',
        customName: 'Fecha Vencimiento (YYYY-MM-DD)',
        type: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
    },
    {
        name: 'cedula',
        customName: 'Conductor',
        skip: true,
    },
    {
        name: 'cod_categoria',
        customName: 'Categoria',
        skip: true,
    },
];
