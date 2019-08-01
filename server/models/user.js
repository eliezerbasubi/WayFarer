export const userTable = [];
export const cache = [];
export const userCredentials = [];

export class User {
  constructor({
    id,
    token,
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    country,
    city,
    isAdmin
  }) {
    this.token = token;
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.country = country;
    this.city = city;
    this.isAdmin = this.isAdmin;
  }
}
