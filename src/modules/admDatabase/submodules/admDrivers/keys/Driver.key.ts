export const DriverKey = [
    {
        name: 'nombre1',
        customName: 'Primer Nombre',
    },
    {
        name: 'nombre2',
        customName: 'Segundo Nombre',
        isOptional: true,
    },
    {
        name: 'apellido1',
        customName: 'Primer Apellido',
    },
    {
        name: 'apellido2',
        customName: 'Segundo Apellido',
        isOptional: true,
    },
    {
        name: 'cedula',
        customName: 'Cedula',
        isPrimaryKey: true,
        type: /^(?:\d{8}|\d{10})$/,
    },
    {
        name: 'fecha_nacimiento',
        customName: 'Fecha de Nacimiento (YYYY-MM-DD)',
        type: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
    },
];
