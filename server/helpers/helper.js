import {
  UNPROCESSABLE_ENTITY
} from '../constants/responseCodes';
import { cache } from '../models/user';

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

  // static today() {
  //   const todayTime = new Date();
  //   const month = todayTime.getMonth() + 1;
  //   const day = todayTime.getDate();
  //   const year = todayTime.getFullYear();

  //   const now = `${year}-${month}-${day}`;
  //   return now;
  // }

  // static slice(token) {
  //   if (token.startsWith('Bearer ')) return token.slice(7, token.length);
  //   return token;
  // }

  // static currentUserStatus() {
  //   let isCurrentAdmin = true;
  //   cache.forEach((user) => { isCurrentAdmin = user.is_admin; });
  //   return isCurrentAdmin;
  // }
}
