import express from 'express';
import os from 'os';
import multer from 'multer';
import { MAX_SIZE_FILE_UPLOAD } from '../constants';
import HttpResponseError from '../errors/HttpResponseError';
import VehicleController from '../controllers/vehicle.controller';

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

router.post('/parse-csv', upload, async (req, res, next) => {
  try {
    await VehicleController.parseCSV(req, res);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

export default router;
