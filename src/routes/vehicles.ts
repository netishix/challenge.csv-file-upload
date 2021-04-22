import express from 'express';
import os from 'os';
import multer from 'multer';
import debug from 'debug';
import fs from 'fs/promises';
import { MAX_SIZE_FILE_UPLOAD } from '../constants';
import HttpResponseError from '../errors/HttpResponseError';
import { ITemplate, Template } from '../models/Template';
import { Vehicle, VEHICLE_COLUMNS } from '../models/Vehicle';

const upload = multer({
  dest: os.tmpdir(),
  limits: {
    files: 1,
    fileSize: MAX_SIZE_FILE_UPLOAD,
  },
  fileFilter: (req, file, next) => {
    if (file.mimetype !== 'text/csv') {
      const error = new HttpResponseError(400, 'Only CSV files are allowed.');
      return next(error);
    }
    return next(null, true);
  },
}).single('file');

const router = express.Router();
const debugInfo = debug('info');

router.post('/parse-csv', upload, async (req, res, next) => {
  const { providerId } = req.body;
  // Validate required fields
  if (!providerId) {
    const error = new HttpResponseError(400, 'The field "providerId" is empty.');
    return next(error);
  }
  if (!req.file) {
    const error = new HttpResponseError(400, 'The field "file" is empty. Please provide a valid CSV file.');
    return next(error);
  }
  // Query the provider template
  const template: ITemplate | null = await Template.findOne({ provider: providerId })
    .exec();
  if (!template) {
    const error = new HttpResponseError(404, `No template found for provider id "${providerId}".`);
    return next(error);
  }
  // Parse the uploaded CSV file
  const uploadedFilePath = req.file.path;
  const csvContent = await fs.readFile(uploadedFilePath, { encoding: 'utf8' });
  const rows = csvContent.split('\n');
  if (rows.length > 0) {
    const parsedRows = rows.map((row) => row.split(','));
    const vehicles = parsedRows.map((parsedRow) => {
      const vehicle: any = {
        provider: template.provider,
      };
      VEHICLE_COLUMNS.forEach((column) => {
        const idx = template.fields.indexOf(column);
        vehicle[column] = idx !== -1 ? parsedRow[idx] : null;
      });
      return vehicle;
    });
    await Vehicle.insertMany(vehicles);
    debugInfo(`Saved ${vehicles.length} new vehicles for provider "${providerId}".`);
  } else {
    debugInfo('The CSV file is empty.');
  }
  return res.status(200).send();
});

export default router;
