export const preSave = {
  firstName: 'Eliezer',
  lastName: 'Basubi',
  email: 'eliezer.basubi30@gmail.com',
  password: '123456',
  phoneNumber: '0708372228',
  country: 'Uganda',
  city: 'Kampala',
  isAdmin: true
};
export const explicitData = {
  firstName: 'Eliezer',
  lastName: 'Basubi',
  email: 'eliezer@gmail.com',
  password: '123456',
  phoneNumber: '0708372228',
  country: 'Uganda',
  city: 'Kampala',
  bootcamp: 'August',
  isAdmin: true
};

export const faker = {
  notFound: false
};
export const preSaveLog = {
  email: 'eliezer.basubi30@gmail.com',
  password: '123456'
};
export const fakeUser = {
  email: 'eliezer.basubi@gmail.com',
  password: '123456'
};
export const shortPassword = {
  email: 'eliezer.basubi@gmail.com',
  password: 'abcd'
};
export const changePassword = {
  old_password: '123456',
  new_password: '12345678',
  confirm_password: '12345678'
};
const road = '/api/v1/';

export const routes = {
  root: '/',
  signup: `${road}auth/signup`,
  signin: `${road}auth/signin`,
  account: `${road}auth/account/1`,
  createTrip: `${road}trips`,
  getSpecificTrip: `${road}trips/`,
  getAllTrips: `${road}trips`,
  cancelTrip: `${road}trips/:trip_id/cancel`,
  bookings: `${road}bookings`,
  viewBooking: `${road}bookings`
};

export const JSON_TYPE = 'application/json';
