export const preSave = {
  first_name: 'Eliezer',
  last_name: 'Basubi',
  email: 'eliezer.basubi30@gmail.com',
  password: '123456',
  phone_number: '0708372228',
  country: 'Uganda',
  city: 'Kampala',
  is_admin: true
};
export const explicitData = {
  first_name: 'Eliezer',
  last_name: 'Basubi',
  email: 'eliezer@gmail.com',
  password: '123456',
  phone_number: '0708372228',
  country: 'Uganda',
  city: 'Kampala',
  bootcamp: 'August',
  is_admin: true
};

export const faker = {
  faker: false
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
const road = '/api/v2/';

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

export const correctTrip = {
  trip_id: 1,
  trip_name: 'Bootcamp',
  seating_capacity: '44',
  bus_license_number: 'BO7865',
  origin: 'Bukavu',
  destination: 'Kigali',
  trip_date: '2019-12-05',
  arrival_date: '2019-12-16',
  time: '17:30',
  fare: '120.5',
  status: 'active'
};

export const noTokenTrip = {
  trip_name: 'Bootcamp',
  seating_capacity: '44',
  bus_license_number: 'BO7865',
  origin: 'Bukavu',
  destination: 'Kigali',
  trip_date: '2019-12-05',
  arrival_date: '2019-12-16',
  time: '17:30',
  fare: '120.5'
};
export const invalidToken = 'Bearer yJh';

export const correctBooking = {
  trip_id: 1,
  seat_number: 23
};

export const bookingStore = {
  booking_id: 1,
  bus_license_number: 'OPBIEW4',
  trip_id: '1',
  trip_date: '2019-12-12',
  trip_time: '13:30',
  trip_name: 'Boot trip',
  fare: '45.9',
  user_id: '1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'johndoe@gmail.com',
  seat_number: '34',
  createdOn: '2019-12-15',
  status: 'valid'
};
