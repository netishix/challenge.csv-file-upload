import fs from 'fs/promises';
import { IVehicle, VEHICLE_COLUMNS } from '../../models/Vehicle';
import { ITemplate } from '../../models/Template';

const parseVehiclesCSV = async (filPath: string, template: ITemplate): Promise<IVehicle[]> => {
  const csvContent = await fs.readFile(filPath, { encoding: 'utf8' });
  const rows = csvContent.split('\n');
  const parsedRows = rows.map((row) => row.split(','));
  return parsedRows.map((parsedRow) => {
    const vehicle: any = {
      provider: template.provider,
    };
    VEHICLE_COLUMNS.forEach((column) => {
      const idx = template.fields.indexOf(column);
      vehicle[column] = idx !== -1 ? parsedRow[idx] : null;
    });
    return vehicle;
  });
};

export default parseVehiclesCSV;
