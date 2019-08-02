import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

import {
    preSave,
    JSON_TYPE,
    invalidToken,
    correctBooking,
    adminBooking,
    userToken,
    bookingStore,
    adminToken
} from '../data/data';
import {
    SUCCESS_CODE,
    RESOURCE_CONFLICT,
    BAD_REQUEST_CODE,
    UNAUTHORIZED_CODE,
    INTERNAL_SERVER_ERROR_CODE,
    NOT_FOUND_CODE,
    UNPROCESSABLE_ENTITY,
    CREATED_CODE
} from '../constants/responseCodes';
import {
    routes
} from '../data/data';
import {
    NOT_FOUND
} from '../constants/responseMessages';
import {
    dbTrip
} from '../models/trip';
import {
    userTable,
    cache
} from '../models/user';
import {
    dbBookings
} from '../models/booking';
import {
    TRIP_CANCELLED, MAXIMUM_BOOKINGS, ACCESS_USERS_ONLY, NOT_LOGGED_IN
} from '../constants/feedback';

chai.use(chaiHttp);

const {
    expect,
    request
} = chai;

describe('Test case: Booking endpoint /api/v1/bookings', () => {
    describe('Base case: User can book a seat on a trip', () => {
        it('Should return 404 If trip was cancelled', (done) => {
            dbBookings.push(correctBooking)
            request(app)
                .post(routes.bookings)
                .set(correctBooking)
                .end((err, res) => {
                    expect(res).to.have.status(NOT_FOUND_CODE);
                    expect(res.body).to.have.property('status').equal(NOT_FOUND_CODE);
                    done();
                });
        });

        it('Should return 500 If seat number is greater seating capacity', (done) => {
            correctBooking.seat_number = 455;
            dbTrip.map(element => {
                element.status = 'active';
            });
    
            request(app)
                .post(routes.bookings)
                .set(correctBooking)
                .end((err, res) => {
                    expect(res).to.have.status(INTERNAL_SERVER_ERROR_CODE);
                    expect(res.body).to.have.property('status').equal(INTERNAL_SERVER_ERROR_CODE);
                    done();
                });
        });
    
        it('Should return 200 If every details is provided', (done) => {
            correctBooking.seat_number = 23;
            correctBooking.trip_id = 455;
            dbBookings.push(correctBooking);
            dbTrip.push({
                token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVsaWV6ZXIuYmFzdWJpMzBAZ21haWwuY29tIiwiaWQiOjEsImlzQWRtaW4iOnRydWUsImlhdCI6MTU2MzQ3MjA2MywiZXhwIjoxNTY2MDY0MDYzfQ.1ePXEQwxUUrU5fkiTP-6e-IES22XgaA09KMBzbqzVws',
                tripId: 455,
                trip_name: 'Bootcamp',
                seating_capacity: '44',
                bus_license_number: 'BO7865',
                trip_origin: 'Bukavu',
                destination: 'Kigali',
                trip_date: '2019-08-05',
                arrival_date: '2019-08-16',
                time: '17:30',
                fare: '120.5'
            });
            request(app)
                .post(routes.bookings)
                .set(correctBooking)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res).to.have.status(CREATED_CODE);
                    expect(res.body).to.have.property('status').equal(CREATED_CODE);
                    expect(res.body).to.have.property('data');
                    expect(res.type).to.be.equal(JSON_TYPE);
                    done();
                });
        });

        it('Should return 409 If seat is already booked', (done) => {
            dbBookings.push(correctBooking);
            request(app)
                .post(routes.bookings)
                .set(correctBooking)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res).to.have.status(RESOURCE_CONFLICT);
                    expect(res.body).to.have.property('status').equal(RESOURCE_CONFLICT);
                    expect(res.body).to.have.property('error');
                    expect(res.body.error).to.be.equal('The given seat is already booked')
                    expect(res.type).to.be.equal(JSON_TYPE);
                    done();
                });
        });

        it('Should return 409 If user tries to book more than one', (done) => {
            correctBooking.seat_number = 15;
            dbBookings.push(correctBooking);
            dbTrip.tripId = 23;
            request(app)
                .post(routes.bookings)
                .set(correctBooking)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res).to.have.status(RESOURCE_CONFLICT);
                    expect(res.body).to.have.property('status').equal(RESOURCE_CONFLICT);
                    expect(res.body).to.have.property('error');
                    expect(res.body.error).to.be.equal('You have reached the maximum number of bookings')
                    expect(res.type).to.be.equal(JSON_TYPE);
                    done();
                });
        });

        it('Should validate trip ID and seat number', (done) => {
            correctBooking.trip_id = -23;
            request(app)
                .post(routes.bookings)
                .set(correctBooking)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res).to.have.status(INTERNAL_SERVER_ERROR_CODE);
                    expect(res.body.error).to.contain('fails');
                    expect(res.body).to.have.property('status').equal(INTERNAL_SERVER_ERROR_CODE);
                    expect(res.type).to.be.equal(JSON_TYPE);
                    expect(res).to.have.headers;
                    done();
                });
        });
    });

    describe('Base case: User can view all of his/her bookings', () => {
        it('Should return 401 If user is not logged in', (done) => {
            cache.map(user => { user.id = 2 });
            request(app)
                .get(routes.bookings)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res).to.have.status(UNAUTHORIZED_CODE);
                    expect(res.body).to.have.property('status').equal(UNAUTHORIZED_CODE);
                    expect(res.body.error).to.be.equal(NOT_LOGGED_IN);
                    expect(res.type).to.be.equal(JSON_TYPE);
                    expect(res).to.have.headers;
                    done();
                })
        });

        // User has logged in
        it('Should return 200 If user has logged in', (done) => {
            cache.push({
                id: 1,
                firstName: 'Eliezer',
                lastName: 'Basubi',
                email: 'eliezer.basubi30@gmail.com',
                isAdmin: false
            });
            request(app)
                .get(routes.bookings)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res).to.have.status(SUCCESS_CODE);
                    expect(res.body).to.have.property('status').equal(SUCCESS_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res.type).to.be.equal(JSON_TYPE);
                    expect(res.body).to.have.property('data');
                
                    done();
                });
        });

        it('Should return 404 If user has no yet booked', (done) => {
            cache.map(item => {
                item.email = 'eliezer.hacker30@gmail.com'
            });
            dbBookings.push(correctBooking);
            request(app)
                .get(routes.bookings)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).to.be.equal(NOT_FOUND_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res.body.error).to.be.equal('You have no bookings');
                    expect(res.body).to.have.property('status').equal(NOT_FOUND_CODE)
                    done();
                });
        });

        it('Should return 404 If booking is empty', (done) => {
            for (let index = 0; index < dbBookings.length; index++) {
                dbBookings.splice(index, dbBookings.length);
            }
            request(app)
                .get(routes.bookings)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).to.be.equal(NOT_FOUND_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res.body.error).to.be.equal('No bookings yet');
                    done();
                });
        });
    });

    describe('Base case: Admin can view all bookings', () => {
        it('Should display all bookings if user is an admin', (done) => {
            cache.map(item => {
                item.isAdmin = true
            });
            dbBookings.push(bookingStore)
            request(app)
                .get(routes.bookings)
                .set('Authorization', adminToken)
                .end((err, res) => {
                    expect(res).to.have.status(SUCCESS_CODE);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
    });
});