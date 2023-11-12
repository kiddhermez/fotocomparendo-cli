import { Soat } from './soat.js';
import { Techno } from './techno.js';

export interface Vehicle {
    placa?: string;
    linea?: string;
    marca?: string;
    id_color?: string;
    codigo?: string;
    nro_poliza?: string;
    nro_acreditacion?: string;
    cedula?: string;
    numero?: string;
    letra?: string;

    soat?: Soat;
    tecnomecanica?: Techno;
}
