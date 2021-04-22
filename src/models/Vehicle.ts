import {
  model, Schema, Model, Document,
} from 'mongoose';
import { IProvider } from './Provider';

export const VEHICLE_COLUMNS = [
  'uuid', 'vin', 'make', 'vehicleModel', 'mileage', 'year', 'price', 'zipCode', 'creationDate', 'updateDate',
];

interface IVehicle extends Document {
    uuid?: string,
    vin?: string,
    make?: string,
    /* add a prefix "vehicleModel" instead of "model" to avoid conflicts
    with mongoose.Document.model definition */
    vehicleModel?: string,
    mileage?: number,
    year?: string,
    price?: number,
    zipCode?: string,
    creationDate?: Date,
    updateDate?: Date,
    provider: IProvider,
}

const schema = new Schema({
  uuid: String,
  vin: String,
  make: String,
  vehicleModel: String,
  mileage: Number,
  year: String,
  price: Number,
  zipCode: String,
  creationDate: Date,
  updateDate: Date,
  provider: { type: Schema.Types.ObjectId, ref: 'Provider' },
});

const Vehicle: Model<IVehicle> = model('Vehicle', schema);

export { Vehicle, IVehicle };
