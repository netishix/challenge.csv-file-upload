import request from 'supertest';
import fs from 'fs/promises';
import faker from 'faker';
import path from 'path';
import moment from 'moment';
import debug from 'debug';
import server from '../../src/server';
import MongoDBMock from './utils/MongoDBMock';
import DatabaseConnection from '../../src/database';
import { IProvider, Provider } from '../../src/models/Provider';
import { Template } from '../../src/models/Template';
import { Vehicle } from '../../src/models/Vehicle';

const debugTest = debug('test');

describe('Vehicle API', () => {
  let mongoDBMock: MongoDBMock;
  beforeEach(async () => {
    // Start MongoMemoryServer, update environment variables and reconnect to mongo
    debugTest('Starting MongoMemoryServer...');
    mongoDBMock = new MongoDBMock();
    await mongoDBMock.start();
    process.env.DATABASE_URI = mongoDBMock.uri;
    await DatabaseConnection.disconnect();
    await DatabaseConnection.connect();
    debugTest('MongoMemoryServer is up and running.');
  });

  afterEach(async () => {
    // Manually stop MongoMemoryServer
    await mongoDBMock.stop();
  });

  describe('/vehicles/parse-csv', () => {
    const routePath = '/vehicles/parse-csv';

    describe('POST', () => {
      let provider: IProvider;
      let CSVFileData: string;
      let CSVFilePath: string;
      beforeEach(async () => {
        debugTest('Creating a provider, template and CSV file...');
        // Create a provider
        provider = await Provider.create({
          name: 'Spark Vehicles',
        });
        // Create a custom template
        await Template.create({
          fields: ['uuid', 'vin', null, 'make', 'vehicleModel', 'mileage', null, null, 'year', 'price', 'zipCode', 'creationDate', 'updateDate'],
          provider,
        });
        // Create a CSV file that matches the created template
        const rows = [];
        const totalVehicles = 20;
        for (let i = 0; i < totalVehicles; i += 1) {
          const row = [
            faker.datatype.uuid(),
            faker.vehicle.vin(),
            faker.vehicle.fuel(), // additional field
            faker.vehicle.manufacturer(),
            faker.vehicle.model(),
            faker.datatype.number(),
            faker.vehicle.color(), // additional field
            faker.vehicle.type(), // additional field
            faker.date.past(2).getFullYear(),
            faker.datatype.number(),
            faker.address.zipCode(),
            moment(faker.date.past(2)).format('YYYY-MM-DD'),
            moment(faker.date.past(1)).format('YYYY-MM-DD'),
          ];
          rows.push(row);
        }
        CSVFileData = rows.map((row) => row.join(',')).join('\n');
        CSVFilePath = path.join(__dirname, 'files/vehicles.csv');
        await fs.writeFile(CSVFilePath, CSVFileData);
      });

      it('should upload a CSV file with additional fields and save it to the database', async () => {
        const res = await request(server)
          .post(routePath)
          .field('providerId', provider._id.toString())
          .attach('file', CSVFilePath);
        expect(res.status).toEqual(200);
        // Assert that every vehicle in the CSV was loaded successfully
        const savedVehicles = await Vehicle.find({ provider: provider._id }).exec();
        const inputVehicles = CSVFileData.split('\n').map((row) => row.split(','));
        expect(savedVehicles.length).toEqual(inputVehicles.length);
        inputVehicles.forEach((inputVehicle) => {
          const savedVehicle = savedVehicles.find((vehicle) => vehicle.uuid === inputVehicle[0]);
          expect(savedVehicle).toBeTruthy();
          if (savedVehicle) {
            expect(savedVehicle.uuid).toEqual(inputVehicle[0]); // uuid
            expect(savedVehicle.vin).toEqual(inputVehicle[1]); // vin
            expect(savedVehicle.make).toEqual(inputVehicle[3]); // make
            expect(savedVehicle.vehicleModel).toEqual(inputVehicle[4]); // model
            expect(savedVehicle.mileage).toEqual(parseInt(inputVehicle[5], 10)); // mileage
            expect(savedVehicle.year).toEqual(inputVehicle[8]); // year
            expect(savedVehicle.price).toEqual(parseInt(inputVehicle[9], 10)); // price
            expect(savedVehicle.zipCode).toEqual(inputVehicle[10]); // zipCode
            expect(moment(savedVehicle.creationDate).utc().format('YYYY-MM-DD')).toEqual(inputVehicle[11]); // creationDate
            expect(moment(savedVehicle.updateDate).utc().format('YYYY-MM-DD')).toEqual(inputVehicle[12]); // updateDate
            expect(savedVehicle.provider.toString()).toEqual(provider._id.toString()); // providerId
          }
        });
      });

      it('should not upload a CSV file because the "providerId" field was not provided', async () => {
        const res = await request(server)
          .post(routePath)
          .attach('file', CSVFilePath);
        expect(res.status).toEqual(400);
      });

      it('should not upload a CSV file because the "file" field was not provided', async () => {
        const res = await request(server)
          .post(routePath)
          .field('providerId', provider._id.toString());
        expect(res.status).toEqual(400);
      });

      it('should not upload a CSV file because the provider did not configure a custom template', async () => {
        // Remove the provider's template
        await Template.deleteOne({ provider: provider._id });
        const res = await request(server)
          .post(routePath)
          .field('providerId', provider._id.toString())
          .attach('file', CSVFilePath);
        expect(res.status).toEqual(404);
      });

      it('should not upload a CSV file because the provided file format is not allowed', async () => {
        // Create a PDF file and upload it
        const invalidFormatFilePath = path.join(__dirname, 'files/vehicles.pdf');
        await fs.writeFile(invalidFormatFilePath, '');
        const res = await request(server)
          .post(routePath)
          .field('providerId', provider._id.toString())
          .attach('file', invalidFormatFilePath);
        expect(res.status).toEqual(400);
      });

      it('should not upload a CSV file because the file exceeds the maximum allowed size', async () => {
        // Create a big CSV file and upload it
        for (let i = 0; i < 10; i += 1) {
          CSVFileData += CSVFileData;
        }
        await fs.writeFile(CSVFilePath, CSVFileData);
        const res = await request(server)
          .post(routePath)
          .field('providerId', provider._id.toString())
          .attach('file', CSVFilePath);
        expect(res.status).toEqual(400);
      });
    });
  });
});
