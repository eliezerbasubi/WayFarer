import express from 'express';
import morgan from 'morgan';
import bordyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import {
  METHOD_NOT_FOUND_MSG
} from './server/constants/responseMessages';
import {
  SUCCESS_CODE,
  METHOD_NOT_FOUND
} from './server/constants/responseCodes';
import routes from './server/routes/index';
import swaggerDocument from './swagger.json';

const app = express();

app.use(morgan('dev'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.header(
      'Access-Control-Allow-Options',
      'PUT,POST,PATCH,DELETE,GET'
    );
    res.status(SUCCESS_CODE).json({});
  }
  next();
});

app.use(bordyParser.urlencoded({
  extended: false
}));

app.use(bordyParser.json());

app.use('/api/v2', routes);

app.use('/UI', express.static('UI'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  const error = new Error(METHOD_NOT_FOUND_MSG);
  error.status = METHOD_NOT_FOUND;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status);
  res.json({
    status: error.status,
    error: error.message
  });
});

export default app;
