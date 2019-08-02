import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  UNAUTHORIZED_CODE, FORBIDDEN_CODE
} from '../constants/responseCodes';
import Helper from '../helpers/helper';
import {
  INVALID_TOKEN,
  NOT_LOGGED_IN
} from '../constants/feedback';
import { cache } from '../models/user';
import { FORBIDDEN_MSG } from '../constants/responseMessages';

dotenv.config();

export default class Permission {
  static grantAccess(request, response, next) {
    const token = request.headers.authorization || request.headers.token || request.headers['x-access-token'];
    let currentUserID = '';
    try {
      const verified = jwt.verify(Helper.slice(token), process.env.JWT_KEY);
      const {
        isAdmin,
        id
      } = verified;
      cache.forEach((item) => {
        currentUserID = item.id;
      });
      if (currentUserID !== id) { return Helper.error(response, UNAUTHORIZED_CODE, NOT_LOGGED_IN); }

      if (!isAdmin) { return Helper.error(response, FORBIDDEN_CODE, FORBIDDEN_MSG); }

      return next();
    } catch (error) {
      return Helper.error(response, UNAUTHORIZED_CODE, INVALID_TOKEN);
    }
  }
}
