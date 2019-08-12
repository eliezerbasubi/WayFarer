import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import omit from 'object.omit';
import {
  EMAIL_ALREADY_EXIST, RESET_SUCCESSFUL, OLD_PASSWORD_NOT_MATCH,
  PASSWORD_DOESNT_MATCH, USER_ID_NOT_FOUND, INCORRECT_PASSWORD
} from '../constants/feedback';
import UserQuery, { currentUser } from '../models/user';
import {
  RESOURCE_CONFLICT,
  CREATED_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  UNAUTHORIZED_CODE,
  SUCCESS_CODE,
  NOT_FOUND_CODE,
  BAD_REQUEST_CODE
} from '../constants/responseCodes';
import Helper from '../helpers/helper';
import { UNAUTHORIZED_ACCESS, BAD_REQUEST_MSG } from '../constants/responseMessages';

dotenv.config();

export default class UserController {
  static async signUp(req, res) {
    try {
      const salt = await bcrypt.genSalt(10);
      const encrypt = await bcrypt.hash(req.body.password, salt);

      const values = [req.body.first_name, req.body.last_name, req.body.email, encrypt,
        req.body.phone_number,
        req.body.country,
        req.body.city
      ];
      // save the user into the database
      const result = await UserQuery.insert(values);

      if (result.error) {
        res.status(result.error.status).json({
          status: result.error.status,
          error: result.error.message
        });
        return;
      }

      const { id, is_admin } = result.rows[0];

      const token = jwt.sign({ id, is_admin }, process.env.JWT_KEY, {
        expiresIn: '24h'
      });

      req.body = Object.assign({ token, id }, omit(req.body, 'password'));
      Helper.success(res, CREATED_CODE, req.body, 'Account Successfully Created');
    } catch (error) {
      Helper.error(res, BAD_REQUEST_CODE, BAD_REQUEST_MSG);
    }
  }

  static async signIn(request, response) {
    const values = [
      request.body.email
    ];
    const result = await UserQuery.read(values);

    if (result.rowCount <= 0) {
      return response.status(401).json({ status: 401, error: UNAUTHORIZED_ACCESS });
    }
    return bcrypt.compare(request.body.password, result.rows[0].password, (err, resultat) => {
      if (err) { return Helper.error(response, UNAUTHORIZED_CODE, UNAUTHORIZED_ACCESS); }
      if (resultat) {
        const { id, email, isadmin } = result.rows[0];
        const tokenId = jwt.sign({ email, id, is_admin: isadmin }, process.env.JWT_KEY, { expiresIn: '24h' });
        currentUser.push({
          token: tokenId,
          id,
          firstname: result.rows[0].firstname,
          lastname: result.rows[0].lastname,
          email,
          phone_number: result.rows[0].firstname
        });
        return Helper.success(response, SUCCESS_CODE, Object.assign(...currentUser), 'Welcome to Wayfarer');
      }
      return Helper.error(response, UNAUTHORIZED_CODE, INCORRECT_PASSWORD);
    });
  }

  static async resetPassword(req, res) {
    const userId = req.params.user_id;
    const { new_password, old_password, confirm_password } = req.body;
    try {
      const user = await UserQuery.findOne(userId);
      const { password } = user.rows[0];
      const compared = await bcrypt.compare(old_password, password);
      if (!compared) {
        return res.status(UNAUTHORIZED_CODE).json({
          status: UNAUTHORIZED_CODE,
          error: OLD_PASSWORD_NOT_MATCH
        });
      }
      if (new_password !== confirm_password) {
        return Helper.error(res, UNAUTHORIZED_CODE, PASSWORD_DOESNT_MATCH);
      }
      const salt = await bcrypt.genSalt(10);
      const hashednewPassword = await bcrypt.hash(confirm_password, salt);
      await UserQuery.update([hashednewPassword, userId]);
      return res.status(SUCCESS_CODE).json({ status: SUCCESS_CODE, message: RESET_SUCCESSFUL });
    } catch (error) {
      return Helper.error(res, UNAUTHORIZED_CODE, USER_ID_NOT_FOUND);
    }

    // const user = userTable.find(info => info.id === parseInt(userId, 10));
    // if (user) {
    //   const userOldPwd = user.password;
    //   if (req.body.new_password === req.body.confirm_password) {
    //     const salt = await bcrypt.genSalt(10);
    //     const hashednewPassword = await bcrypt.hash(req.body.confirm_password, salt);
    //     const matchedPwd = await bcrypt.compare(req.body.old_password, userOldPwd);

    //     if (matchedPwd) {
    //       user.password = hashednewPassword;
    //       const display = {
    //         id: user.id,
    //         first_name: user.first_name,
    //         email: user.email
    //       };
    //       return Helper.success(res, SUCCESS_CODE, display, RESET_SUCCESSFUL);
    //     }
    //     return Helper.error(res, UNAUTHORIZED_CODE, OLD_PASSWORD_NOT_MATCH);
    //   }
    //   return Helper.error(res, UNAUTHORIZED_CODE, PASSWORD_DOESNT_MATCH);
    // }
    // return Helper.error(res, UNAUTHORIZED_CODE, USER_ID_NOT_FOUND);
  }

  static viewAllUsers(req, res) {
    // const users = userTable.filter(user => Boolean(user.is_admin) === false);

    // if (users.length > 0) {
    //   const details = [];
    //   users.forEach((item) => {
    //     details.push({
    //       user_id: item.id,
    //       first_name: item.first_name,
    //       last_name: item.last_name,
    //       email: item.email,
    //       phone_number: item.phone_number,
    //       city: item.city
    //     });
    //   });
    //   const display = [];
    //   Object.assign(display, details);
    //   return Helper.success(res, SUCCESS_CODE, display, 'Here is the list of users');
    // }
    // return Helper.error(res, NOT_FOUND_CODE, 'We Cannot Find Any User Now');
  }
}
