import Joi from 'joi';
import Helper from '../helpers/helper';

export default class Validator {
  static signup(request, response, next) {
    const schema = Joi.object().keys({
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      first_name: Joi.string().regex(/^[aA-zZ]+$/i).min(3).max(25)
        .required(),
      last_name: Joi.string().regex(/^[aA-zZ]+$/i).min(3).max(25)
        .required(),
      password: Joi.string().min(6).max(50).required(),
      phone_number: Joi.string().regex(/^[0-9]{7,10}$/).required(),
      city: Joi.string().min(5).max(30).required(),
      country: Joi.string().min(5).max(30).optional(),
      is_admin: Joi.boolean().strict().valid(true, false).optional()
    });

    const { error } = Joi.validate(request.body, schema);

    if (!error) { return next(); }

    return Helper.joiError(response, error);
  }

  static validatePassword(req, res, next) {
    const { error } = Joi.validate(req.body.new_password, Joi.string().min(6).max(50));
    if (!error) { return next(); }
    return Helper.joiError(res, error);
  }
}
