import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import omit from 'object.omit';
import {
  EMAIL_ALREADY_EXIST, RESET_SUCCESSFUL, OLD_PASSWORD_NOT_MATCH,
  PASSWORD_DOESNT_MATCH, USER_ID_NOT_FOUND
} from '../constants/feedback';
import {
  userTable,
  User,
  cache
} from '../models/user';
import {
  RESOURCE_CONFLICT,
  CREATED_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  UNAUTHORIZED_CODE,
  SUCCESS_CODE
} from '../constants/responseCodes';
import Helper from '../helpers/helper';
import { UNAUTHORIZED_ACCESS } from '../constants/responseMessages';

dotenv.config();

export default class UserController {
  /**
   * This function handles user signup data and hashes the password.
   * For security reasons we assign user token to be expired in 1 hour.
   * We use email, id and user status(admin or user) to build a token
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  static async signUp(req, res) {
    const {
      firstName, lastName, email, phoneNumber, password, country, city, isAdmin
    } = req.body;
    const details = userTable.find(user => user.email === email);
    if (details) { return Helper.error(res, RESOURCE_CONFLICT, EMAIL_ALREADY_EXIST); }

    try {
      const saltedPassword = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, saltedPassword);

      const user = [];
      const tokenId = jwt.sign({
        email,
        id: userTable.length + 1,
        isAdmin
      },
      process.env.JWT_KEY, {
        expiresIn: '24h'
      });

      user.push(new User({
        token: tokenId,
        id: userTable.length + 1,
        firstName,
        lastName,
        email,
        password: hashedPass,
        phoneNumber,
        country,
        city,
        isAdmin
      }));
      userTable.push(...user);

      return Helper.success(res, CREATED_CODE, omit(req.body, ['password', 'isAdmin']), 'Account successfully created');
    } catch (error) { return Helper.error(res, INTERNAL_SERVER_ERROR_CODE, error); }
  }

  /**
   * This function logs user in the system.
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  static async signIn(request, response) {
    const user = userTable.find(users => users.email === request.body.email);
    if (user) {
      return bcrypt.compare(request.body.password, user.password, (err, result) => {
        if (err) { return Helper.error(response, UNAUTHORIZED_CODE, UNAUTHORIZED_ACCESS); }
        if (result) {
          const tokenId = jwt.sign({
            email: user.email,
            id: user.id,
            isAdmin: user.isAdmin
          }, process.env.JWT_KEY, {
            expiresIn: '24h'
          });
          cache.push({
            token: tokenId,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin
          });
          user.token = tokenId;
          return Helper.success(response, SUCCESS_CODE, cache, 'Welcome to Wayfarer');
        }
        return Helper.error(response, INTERNAL_SERVER_ERROR_CODE, UNAUTHORIZED_ACCESS);
      });
    }
    return Helper.error(response, UNAUTHORIZED_CODE, UNAUTHORIZED_ACCESS);
  }

  static async resetPassword(req, res) {
    const userId = req.params.user_id;
    // eslint-disable-next-line radix
    const user = userTable.find(info => info.id === parseInt(userId));
    if (user) {
      const userOldPwd = user.password;
      if (req.body.new_password === req.body.confirm_password) {
        const salt = await bcrypt.genSalt(10);
        const hashednewPassword = await bcrypt.hash(req.body.confirm_password, salt);
        const matchedPwd = await bcrypt.compare(req.body.old_password, userOldPwd);

        if (matchedPwd) {
          user.password = hashednewPassword;

          return Helper.success(res, SUCCESS_CODE, req.body, RESET_SUCCESSFUL);
        }
        return Helper.error(res, UNAUTHORIZED_CODE, OLD_PASSWORD_NOT_MATCH);
      }
      return Helper.error(res, UNAUTHORIZED_CODE, PASSWORD_DOESNT_MATCH);
    }
    return Helper.error(res, UNAUTHORIZED_CODE, USER_ID_NOT_FOUND);
  }
}
