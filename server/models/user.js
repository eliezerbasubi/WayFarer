export const userTable = [];
export const cache = [];
export const userCredentials = [];

export class User {
  constructor({
    id,
    token,
    first_name,
    last_name,
    email,
    password,
    phone_number,
    country,
    city,
    is_admin
  }) {
    this.token = token;
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.phone_number = phone_number;
    this.country = country;
    this.city = city;
    this.is_admin = is_admin;
  }
}
