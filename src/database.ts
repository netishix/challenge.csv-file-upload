import mongoose from 'mongoose';
import debug from 'debug';

const debugError = debug('error');
const debugInfo = debug('info');

export default class DatabaseConnection {
  static async connect(): Promise<void> {
    try {
      if (process.env.DATABASE_URI) {
        await mongoose.connect(process.env.DATABASE_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        debugInfo('Connected to MongoDB successfully');
      } else {
        debugError('Missing env variable "DATABASE_URI"');
      }
    } catch (error) {
      debugError('An error occurred while connecting to MongoDB:');
      debugError(error);
    }
  }

  static async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
