import {
  UNPROCESSABLE_ENTITY
} from '../constants/responseCodes';

export default class Helper {
  static error(res, statusCode, error) {
    const body = {
      status: statusCode,
      error
    };
    return res.status(statusCode).json(body);
  }

  static success(res, statusCode, data, message) {
    const body = {
      status: statusCode,
      message,
      data
    };
    return res.status(statusCode).json(body);
  }

  static joiError(res, error) {
    const body = {
      status: UNPROCESSABLE_ENTITY,
      error: error.message.replace(/[^a-zA-Z0-9_.: ]/g, '')
    };
    return res.status(UNPROCESSABLE_ENTITY).json(body);
  }
}
