/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import debug from 'debug';
import multer from 'multer';
import HttpResponseError from '../errors/HttpResponseError';
import { MAX_SIZE_FILE_UPLOAD } from '../constants';

const debugError = debug('error');

export default (
  err: HttpResponseError | Error,
  req: Request, res: Response,
  next: NextFunction,
): void => {
  let statusCode: number;
  let message: string;
  if (err instanceof HttpResponseError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = `File is too large. Maximum allowed size of ${MAX_SIZE_FILE_UPLOAD} bytes exceeded.`;
    } else {
      message = err.message;
    }
    statusCode = 400;
  } else {
    message = err.message;
    statusCode = 500;
  }
  debugError(message);
  res.status(statusCode)
    .send({
      statusCode,
      message,
    });
};
