import { Soat } from '../../../../../api/interfaces/soat.js';
import { Techno } from '../../../../../api/interfaces/techno.js';

export interface FormatedVehicle extends Soat, Techno {
    placa?: string;
    linea?: string;
    marca?: string;
    color?: string;
    tipo?: string;
    cedula?: string;
    letra?: string;
    numero?: string;
}
