import {
  model, Schema, Model, Document,
} from 'mongoose';
import { IProvider } from './Provider';

interface ITemplate extends Document {
    fields: (string | null)[],
    provider: IProvider,
}

const schema = new Schema({
  fields: [],
  provider: { type: Schema.Types.ObjectId, ref: 'Provider' },
});

const Template: Model<ITemplate> = model('Template', schema);

export { Template, ITemplate };
