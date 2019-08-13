import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import omit from 'object.omit';
import UserQuery from '../models/user';
import {
  CREATED_CODE,
  BAD_REQUEST_CODE
} from '../constants/responseCodes';
import Helper from '../helpers/helper';
import { BAD_REQUEST_MSG } from '../constants/responseMessages';

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
}
