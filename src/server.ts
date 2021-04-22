import express from 'express';
import debug from 'debug';
import DatabaseConnection from './database';
import router from './routes';
import errorHandler from './middlewares/error-handler';
import { DEFAULT_PORT } from './constants';

const app = express();
const debugInfo = debug('info');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);
app.use(errorHandler);

DatabaseConnection.connect();
const targetPort = process.env.PORT || DEFAULT_PORT;
const server = app.listen(targetPort, () => {
  debugInfo(`Listening on PORT ${targetPort}`);
});

export default server;
