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
    adminToken,
    correctTrip
} from '../data/data';
import {
    SUCCESS_CODE,
    RESOURCE_CONFLICT,
    BAD_REQUEST_CODE,
    UNAUTHORIZED_CODE,
    INTERNAL_SERVER_ERROR_CODE,
    NOT_FOUND_CODE,
    UNPROCESSABLE_ENTITY,
    CREATED_CODE,
    GONE
} from '../constants/responseCodes';
import {
    routes
} from '../data/data';
import {
    dbTrip
} from '../models/trip';
import {
    cache
} from '../models/user';
import {
    dbBookings
} from '../models/booking';
import {
   NOT_LOGGED_IN
} from '../constants/feedback';
import { GONE_MSG } from '../constants/responseMessages';

chai.use(chaiHttp);

const {
    expect,
    request
} = chai;

describe('Test case: Booking endpoint /api/v1/bookings', () => {
    describe('Base case: User can book a seat on a trip', () => {
        it('Should return 200. User booked seat successfully', (done) => {
            // correctBooking.seat_number = 23;
            // correctBooking.trip_id = 455;
            // dbBookings.push(correctBooking);
            request(app)
                .post(routes.bookings)
                .send(correctBooking)
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
            request(app)
                .post(routes.bookings)
                .send(correctBooking)
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
            correctBooking.seatNumber = 2
            request(app)
                .post(routes.bookings)
                .send(correctBooking)
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

        it('Should return 500 If seat number is greater seating capacity', (done) => {
            correctBooking.seatNumber = 455;
            request(app)
                .post(routes.bookings)
                .send(correctBooking)
                .set("Authorization", userToken)
                .end((err, res) => {
                    expect(res).to.have.status(INTERNAL_SERVER_ERROR_CODE);
                    expect(res.body).to.have.property('status').equal(INTERNAL_SERVER_ERROR_CODE);
                    done();
                });
        });

        it('Should validate trip ID and seat number', (done) => {
            correctBooking.tripId = -23;
            request(app)
                .post(routes.bookings)
                .send(correctBooking)
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

        it('Should return 404 If trip was cancelled', (done) => {
            correctBooking.seatNumber = 5;
            correctBooking.tripId = 2;
            correctTrip.tripId = 2;
            dbTrip.push(correctTrip);
            dbTrip.map(trip => { trip.status = "cancelled" });
            request(app)
                .post(routes.bookings)
                .send(correctBooking)
                .set("Authorization", userToken)
                .end((err, res) => {
                    expect(res).to.have.status(GONE);
                    expect(res.body).to.have.property('status').equal(GONE);
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

        // // User has logged in
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

    describe('Base case: Users can delete their booking', () => {
        it('Should not delete booking if user has no booking', (done) => {
            request(app)
                .delete('/api/v1/bookings/1')
                .set('Authorization', userToken)

                .end((err, res) => {
                    expect(res.status).to.be.equal(NOT_FOUND_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res.body.error).to.be.equal('You have no bookings');
                    expect(res.body).to.have.property('status').equal(NOT_FOUND_CODE)
                    done();
                });
        });

        it('Should delete a booking', (done) => {
            cache.map(item => {
                item.email = 'eliezer.basubi30@gmail.com';
                item.isAdmin = false;
            });
            bookingStore.email = 'eliezer.basubi30@gmail.com';
            dbBookings.push(bookingStore);
            request(app)
                .delete('/api/v1/bookings/1')
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

        it('Should return 404 If booking with wrong ID', (done) => {
            request(app)
                .delete('/api/v1/bookings/10')
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res).to.have.status(NOT_FOUND_CODE);
                    expect(res.body).to.have.property('status').equal(NOT_FOUND_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res.type).to.be.equal(JSON_TYPE);
                    done();
                });
        });

        it('Should not delete booking with wrong ID', (done) => {
            request(app)
                .delete('/api/v1/bookings/-1')
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res).to.have.status(BAD_REQUEST_CODE);
                    expect(res.body).to.have.property('status').equal(BAD_REQUEST_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res.type).to.be.equal(JSON_TYPE);
                    done();
                });
        });
    });
});