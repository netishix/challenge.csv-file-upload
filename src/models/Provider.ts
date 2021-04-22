import {
  model, Schema, Model, Document,
} from 'mongoose';

interface IProvider extends Document {
    name: string,
}

const schema = new Schema({
  name: String,
});

const Provider: Model<IProvider> = model('Provider', schema);

export { Provider, IProvider };
