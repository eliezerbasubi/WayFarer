import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  UNAUTHORIZED_CODE, FORBIDDEN_CODE
} from '../constants/responseCodes';
import Helper from '../helpers/helper';
import {
  INVALID_TOKEN,
  NOT_LOGGED_IN,
  ACCESS_USERS_ONLY
} from '../constants/feedback';
import { FORBIDDEN_MSG } from '../constants/responseMessages';
import { currentUser } from '../models/user';

dotenv.config();

export default class Permission {
  static grantAccess(request, response, next) {
    const token = request.headers.authorization || request.headers.token || request.headers['x-access-token'];
    let currentUserID = '';
    try {
      const verified = jwt.verify(Helper.slice(token), process.env.JWT_KEY);
      const {
        is_admin,
        id
      } = verified;
      currentUser.forEach((item) => {
        currentUserID = item.id;
      });
      if (currentUserID !== id) { return Helper.error(response, UNAUTHORIZED_CODE, NOT_LOGGED_IN); }

      if (!is_admin) { return Helper.error(response, FORBIDDEN_CODE, FORBIDDEN_MSG); }

      return next();
    } catch (error) {
      return Helper.error(response, UNAUTHORIZED_CODE, INVALID_TOKEN);
    }
  }

  //   static authorize(req, res, next) {
  //     const token = req.headers.authorization;
  //     let currentUserID = '';
  //     try {
  //       const verified = jwt.verify(Helper.slice(token), process.env.JWT_KEY);
  //       const {
  //         id
  //       } = verified;
  //       cache.forEach((item) => {
  //         currentUserID = item.id;
  //       });
  //       if (currentUserID !== id) { return Helper.error(res, UNAUTHORIZED_CODE, NOT_LOGGED_IN); }

  //       return next();
  //     } catch (error) { return Helper.error(res, UNAUTHORIZED_CODE, INVALID_TOKEN); }
  //   }

  //   static authUsersOnly(request, response, next) {
  //     const token = request.headers.authorization;
  //     let currentUserID = '';
  //     try {
  //       cache.forEach((item) => {
  //         currentUserID = item.id;
  //       });
  //       const { is_admin, id } = jwt.verify(Helper.slice(token), process.env.JWT_KEY);

  //       if (currentUserID !== id) { return Helper.error(response, UNAUTHORIZED_CODE, NOT_LOGGED_IN); }

  //       if (is_admin) { return Helper.error(response, UNAUTHORIZED_CODE, ACCESS_USERS_ONLY); }

//       return next();
//     } catch (error) { return Helper.error(response, UNAUTHORIZED_CODE, INVALID_TOKEN); }
//   }
}
