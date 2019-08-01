import express from 'express';
import morgan from 'morgan';
import bordyParser from 'body-parser';
import {
  NOT_FOUND
} from './server/constants/responseMessages';
import {
  SUCCESS_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR_CODE
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
  const error = new Error(NOT_FOUND);
  error.status = NOT_FOUND_CODE;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || INTERNAL_SERVER_ERROR_CODE);
  res.json({
    status: 'error',
    error: {
      message: error.message
    }
  });
});

export default app;
