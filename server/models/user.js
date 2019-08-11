import { creator, pool } from './index';
import { RESOURCE_CONFLICT } from '../constants/responseCodes';
import { EMAIL_ALREADY_EXIST } from '../constants/feedback';

export default class UserQuery {
  static async insert(values) {
    try {
      const def = await creator.usersTable();
      if (def.error) {
        return { error: { status: 500, message: def.res } };
      }

      const exist = await pool.query('SELECT * FROM users WHERE email = $1', [values[2]]);
      if (exist.rowCount > 0) {
        return { error: { status: RESOURCE_CONFLICT, message: EMAIL_ALREADY_EXIST } };
      }

      const result = await pool.query(`INSERT INTO users (firstname, lastname, email,password,phone,country,city
          ) VALUES($1, $2, $3, $4, $5,$6,$7) RETURNING id, email,isadmin`, values);

      return result;
    } catch (e) {
      return { error: { status: 500, message: e, err: e } };
    }
  }
}
