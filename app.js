import express from 'express';
import morgan from 'morgan';
import bordyParser from 'body-parser';
import {
  METHOD_NOT_FOUND_MSG
} from './server/constants/responseMessages';
import {
  SUCCESS_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  METHOD_NOT_FOUND
} from './server/constants/responseCodes';
import routes from './server/routes/index';

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

app.use('/api/v1', routes);

app.use((req, res, next) => {
  const error = new Error(METHOD_NOT_FOUND);
  error.status = METHOD_NOT_FOUND_MSG;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || INTERNAL_SERVER_ERROR_CODE);
  res.json({
    status: error.status,
    error: error.message
  });
});

export default app;
