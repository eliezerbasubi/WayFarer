import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import omit from 'object.omit';
import UserQuery, { currentUser } from '../models/user';
import {
  CREATED_CODE,
  BAD_REQUEST_CODE,
  UNAUTHORIZED_CODE,
  SUCCESS_CODE,
  NOT_FOUND_CODE
} from '../constants/responseCodes';
import Helper from '../helpers/helper';
import { BAD_REQUEST_MSG, UNAUTHORIZED_ACCESS } from '../constants/responseMessages';
import {
  INCORRECT_PASSWORD, OLD_PASSWORD_NOT_MATCH, PASSWORD_DOESNT_MATCH, RESET_SUCCESSFUL,
  USER_ID_NOT_FOUND
} from '../constants/feedback';

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
        Helper.error(res, result.error.status, result.error.message);
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
        const display = Object.assign(...currentUser);
        return Helper.success(response, SUCCESS_CODE, display, 'Welcome to Wayfarer');
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
  }

  static async viewAllUsers(req, res) {
    const users = await UserQuery.findAll();
    if (users.rowCount < 1) {
      return Helper.error(res, NOT_FOUND_CODE, 'We Cannot Find Any User Now');
    }
    const details = [];
    users.rows.forEach((item) => {
      details.push({
        user_id: item.id,
        first_name: item.firstname,
        last_name: item.lastname,
        email: item.email,
        phone_number: item.phone,
        city: item.city
      });
    });
    const display = [];
    Object.assign(display, details);
    return Helper.success(res, SUCCESS_CODE, display, 'Here is the list of users');
  }
}
