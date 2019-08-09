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

export const correctTrip = {
  tripId: 1,
  tripName: 'Bootcamp',
  seatingCapacity: '44',
  busLicenseNumber: 'BO7865',
  origin: 'Bukavu',
  destination: 'Kigali',
  tripDate: '2019-12-05',
  arrivalDate: '2019-12-16',
  time: '17:30',
  fare: '120.5',
  status: 'active'
};

export const noTokenTrip = {
  tripName: 'Bootcamp',
  seatingCapacity: '44',
  busLicenseNumber: 'BO7865',
  origin: 'Bukavu',
  destination: 'Kigali',
  tripDate: '2019-12-05',
  arrivalDate: '2019-12-16',
  time: '17:30',
  fare: '120.5'
};
export const invalidToken = 'Bearer yJh';

export const correctBooking = {
  tripId: 1,
  seatNumber: 23
};

export const bookingStore = {
  bookingID: 1,
  busLicenseNumber: 'OPBIEW4',
  tripId: '1',
  tripDate: '2019-12-12',
  tripTime: '13:30',
  tripName: 'Boot trip',
  fare: '45.9',
  userId: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  seatNumber: '34',
  createdOn: '2019-12-15',
  status: 'valid'
};
