import { Request, Response } from 'express';
import debug from 'debug';
import HttpResponseError from '../errors/HttpResponseError';
import { ITemplate, Template } from '../models/Template';
import { Vehicle } from '../models/Vehicle';
import parseVehiclesCSV from '../lib/parsers/parseVehiclesCSV';

const debugInfo = debug('info');

export default class VehicleController {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  static async parseCSV(req: Request, res: Response): Promise<void> {
    const { providerId } = req.body;
    // Validate required fields
    if (!providerId) {
      throw new HttpResponseError(400, 'The field "providerId" is empty.');
    }
    if (!req.file) {
      throw new HttpResponseError(400, 'The field "file" is empty. Please provide a valid CSV file.');
    }
    // Query the provider template
    const template: ITemplate | null = await Template.findOne({ provider: providerId })
      .exec();
    if (!template) {
      throw new HttpResponseError(404, `No template found for provider id "${providerId}".`);
    }
    // Parse the uploaded CSV file
    const uploadedFilePath = req.file.path;
    const vehicles = await parseVehiclesCSV(uploadedFilePath, template);
    await Vehicle.insertMany(vehicles);
    debugInfo(`Saved ${vehicles.length} new vehicles for provider "${providerId}".`);
  }
}
