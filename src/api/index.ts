import { apiAdd } from './apiAdd.js';
import { apiDel } from './apiDel.js';
import { apiGet } from './apiGet.js';
import { apiSet } from './apiSet.js';
import { Comune } from './interfaces/comune.js';
import { Driver } from './interfaces/driver.js';
import { License } from './interfaces/license.js';
import { LicenseCategory } from './interfaces/licenseCategory.js';
import { Soat } from './interfaces/soat.js';
import { Techno } from './interfaces/techno.js';
import { Ticket } from './interfaces/ticket.js';
import { TicketByComune } from './interfaces/ticketByComune.js';
import { Vehicle } from './interfaces/vehicle.js';
import { VehicleColors } from './interfaces/vehicleColors.js';
import { VehicleType } from './interfaces/vehicleType.js';

// * Driver
export const getDrivers = () => apiGet<Driver>('driver');
export const addDriver = (driver: Driver) => apiAdd<Driver>(driver, 'driver');
export const setDriver = (id: string, driver: Driver) =>
    apiSet<Driver>(driver, `driver/${id}`);
export const delDriver = (id: string) => apiDel(`driver/${id}`);

// * Vehicle
export const getVehicles = () => apiGet<Vehicle>('vehicle');
export const addVehicle = (vehicle: Vehicle) =>
    apiAdd<Vehicle>(vehicle, 'vehicle');
export const setVehicle = (
    plate_letter: string,
    plate_number: string,
    vehicle: Vehicle
) => apiSet<Vehicle>(vehicle, `vehicle/${plate_letter}/${plate_number}`);
export const delVehicle = (plate_letter: string, plate_number: string) =>
    apiDel(`vehicle/${plate_letter}/${plate_number}`);

// Colors
export const getColors = () => apiGet<VehicleColors>('vehicle/color');

// Types
export const getVehicleTypes = () => apiGet<VehicleType>('vehicle/type');

// Soat
export const getSoat = () => apiGet<Soat>('soat');
export const setSoat = (id: string, soat: Soat) =>
    apiSet<Soat>(soat, `soat/${id}`);

// Techno
export const getTechno = () => apiGet<Techno>('techno');
export const setTechno = (id: string, techno: Techno) =>
    apiSet<Techno>(techno, `techno/${id}`);

// * Tickets
export const getTickets = () => apiGet<Ticket>('ticket');
export const getTicketsByComune = (id: string) =>
    apiGet<TicketByComune>(`ticket/comune/${id}`);
export const addTicket = (ticket: Ticket) => apiAdd<Ticket>(ticket, 'ticket');
export const setTicket = (id: string, ticket: Ticket) => {
    return apiSet<Ticket>(ticket, `ticket/${id}`);
};
export const delTicket = (id: string) => apiDel(`ticket/${id}`);
// comunes
export const getComunes = () => apiGet<Comune>('ticket/comune');

// * Licenses
export const getLicenses = () => apiGet<License>('license');
export const addLicense = (license: License) =>
    apiAdd<License>(license, 'license');
export const setLicense = (id: string, license: License) =>
    apiSet<License>(license, `license/${id}`);
export const delLicense = (id: string) => apiDel(`license/${id}`);
// categories
export const getCategories = () => apiGet<LicenseCategory>('license/category');
