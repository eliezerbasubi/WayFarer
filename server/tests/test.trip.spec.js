import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import {
    JSON_TYPE,
    correctTrip,
    noTokenTrip,
    userToken,
    adminToken,
    invalidToken,
} from '../data/data';
import {
    CREATED_CODE, INTERNAL_SERVER_ERROR_CODE, RESOURCE_CONFLICT, SUCCESS_CODE, UNAUTHORIZED_CODE, FORBIDDEN_CODE, BAD_REQUEST_CODE, NOT_FOUND_CODE
} from '../constants/responseCodes';
import {
    routes
} from '../data/data';
import { TRIP_ID_EXISTS, INVALID_TOKEN, NOT_LOGGED_IN } from '../constants/feedback';
import { FORBIDDEN_MSG, BAD_REQUEST_MSG } from '../constants/responseMessages';
import { cache } from '../models/user';
import { dbTrip } from '../models/trip';
chai.use(chaiHttp);

const {
    expect,
    request
} = chai;

describe('Test case: Trip CRUD Endpoint => /api/v1/trips', () => {
    describe('Base case: Admin can create a trip', () => {
       it('Should return 200. If all fields are provided', (done) => {
        request(app)
            .post(routes.createTrip)
            .set(correctTrip)
            .end((err, res) => {
                expect(res).to.have.status(CREATED_CODE);
                expect(res.type).to.be.equal(JSON_TYPE);
                expect(res.body).to.be.an('object');
                done();
            });
        });

        it('Should return 401. If not token provided', (done) => {
            request(app)
                .post(routes.createTrip)
                .set(noTokenTrip)
                .end((err, res) => {
                    expect(res).to.have.status(UNAUTHORIZED_CODE)
                    expect(res.body.error).to.be.equal(INVALID_TOKEN);
                    expect(res.body.status).to.be.equal(UNAUTHORIZED_CODE)
                    done()
                });
        });

        it('Should restrict access to unauthorized users. Status 401', (done) => {
            correctTrip.token = userToken;
            request(app)
                .post(routes.createTrip)
                .set(correctTrip)
                .end((err, res) => {
                    expect(res).to.have.status(FORBIDDEN_CODE)
                    expect(res.body.error).to.be.equal(FORBIDDEN_MSG);
                    expect(res.body.status).to.be.equal(FORBIDDEN_CODE)
                    done();
                });
        });

        it('Should not create a trip twice with same id', (done) => {
            correctTrip.token = adminToken;
            request(app)
                .post(routes.createTrip)
                .set(correctTrip)
                .end((err, res) => {
                    expect(res).to.have.status(RESOURCE_CONFLICT)
                    expect(res.body.error).to.be.equal(TRIP_ID_EXISTS);
                    expect(res.body.status).to.be.equal(RESOURCE_CONFLICT)
                    done();
                });
        });

        it('Should not create trip if arrival date is before trip date', (done) => {
            correctTrip.arrival_date = "2019-08-5";
            request(app)
                .post(routes.createTrip)
                .set(correctTrip)
                .end((err, res) => {
                    expect(res).to.have.status(INTERNAL_SERVER_ERROR_CODE)
                    expect(res.body.error).to.contain('arrival_date fails');
                    expect(res.body.status).to.be.equal(INTERNAL_SERVER_ERROR_CODE)
                    done()
                });
        });

        it('Should not create trip two trips have same bus license and date', (done) => {
            correctTrip.trip_id = 205;
            correctTrip.arrival_date = '2019-08-16';
            request(app)
                .post(routes.createTrip)
                .set(correctTrip)
                .end((err, res) => {
                    expect(res).to.have.status(RESOURCE_CONFLICT);
                    expect(res.body.error).to.contain('Bus is already taken');
                    expect(res.body.status).to.be.equal(RESOURCE_CONFLICT);
                    done()
                });
        });
        it('Should return 401 if admin is not signed in', (done) => {
            correctTrip.trip_id = 215;
            cache.map(user => { user.id = 2 });
            request(app)
                .post(routes.createTrip)
                .set(correctTrip)
                .end((err, res) => {
                    expect(res).to.have.status(UNAUTHORIZED_CODE);
                    expect(res.body.error).to.be.equal(NOT_LOGGED_IN);
                    expect(res.body.status).to.be.equal(UNAUTHORIZED_CODE);
                    done();
                });
        });
    });

    describe('Base case: Admin can cancel a trip => /api/v1/trips/:trip_id/cancel', () => {
        it('Should validate admin token', (done) => {
            cache.map(user => { user.id = 1 });
            request(app)
                .patch('/api/v1/trips/455/cancel')
                .set('Authorization', adminToken)
                .end((err, res) => {
                    expect(res).to.have.status(SUCCESS_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res).to.have.headers;
                    done();
                });
        });

        it('Should reject invalid ID', (done) => {
            request(app)
                .patch('/api/v1/trips/-455/cancel')
                .set('Authorization', correctTrip.token)
                .end((err, res) => {
                    expect(res).to.have.status(BAD_REQUEST_CODE);
                    expect(res.body.error).to.be.equal(BAD_REQUEST_MSG);
                    expect(res.body).to.have.property('status').equal(BAD_REQUEST_CODE)
                    done();
                });
        });
        it('Should reject Bad Requests', (done) => {
            request(app)
                .patch('/api/v1/trips/55/cancel')
                .set('Authorization', correctTrip.token)
                .end((err, res) => {
                    expect(res).to.have.status(BAD_REQUEST_CODE);
                    expect(res.body.error).to.be.equal(BAD_REQUEST_MSG);
                    expect(res.body).to.have.property('status').equal(BAD_REQUEST_CODE)
                    done();
                });
        });
        it('Should return 401. If the person is not an admin', (done) => {
            request(app)
                .patch('/api/v1/trips/455/cancel')
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res).to.have.status(FORBIDDEN_CODE);
                    expect(res.body).to.have.property('status').equal(FORBIDDEN_CODE);
                    done();
                });
        });
        it('Should return 404. If trip table is empty', (done) => {
            dbTrip.pop();
            request(app)
                .patch('/api/v1/trips/455/cancel')
                .set('Authorization', adminToken)
                .end((err, res) => {
                    expect(res).to.have.status(NOT_FOUND_CODE);
                    expect(res.body).to.have.property('status').equal(NOT_FOUND_CODE);
                    done();
                });
        });
    });

    describe('Base case: Both admin and users can view all trips => /api/v1/trips', () =>{
        it('Should return 404. If database(dbTrip) is empty', (done) => {
            request(app)
                .get(routes.getAllTrips)
                .set('Authorization', correctTrip.token)
                .end((err, res) => {
                    expect(res).to.have.status(NOT_FOUND_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res.body.status).to.be.equal(NOT_FOUND_CODE);
                    done();
                });
        });

        it('Should return 401. If user puts an invalid token', (done) => {
            request(app)
                .get(routes.getAllTrips)
                .set('Authorization', invalidToken)
                .end((err, res) => {
                    expect(res).to.have.status(UNAUTHORIZED_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res.body.status).to.be.equal(UNAUTHORIZED_CODE);
                    done();
                });
        });

        it('Should return 401. If user is not logged in', (done) => {
            cache.map(user => { user.id = 2 });
            request(app)
                .get(routes.getAllTrips)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res).to.have.status(UNAUTHORIZED_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res.body.status).to.be.equal(UNAUTHORIZED_CODE);
                    done();
                });
        });

        it('Should return 200. Display all trips', (done) => {
            cache.map(user => { user.id = 1 });
            dbTrip.push(correctTrip);
            correctTrip.trip_id = 455;
            request(app)
                .get(routes.getAllTrips)
                .set('Authorization', correctTrip.token)
                .end((err, res) => {
                    expect(res).to.have.status(SUCCESS_CODE);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
    });

    describe('Base Case : Both admin and users can view a specific trip', () =>{
        it('Should return 404. When there is no trip available', (done) => {
            dbTrip.pop();
            request(app)
                .get(`${routes.getSpecificTrip}445`)
                .set('Authorization', correctTrip.token)
                .end((err, res) => {
                    expect(res).to.have.status(NOT_FOUND_CODE);
                    expect(res.body).to.have.property('status').equal(NOT_FOUND_CODE)
                    done();
                });
        });

        it('Should return 200. For valid token and trip ID', (done) => {
            dbTrip.push(correctTrip)
            request(app)
                .get(`${routes.getSpecificTrip}455`)
                .set('Authorization', adminToken)
                .end((err, res) => {
                    expect(res).to.have.status(SUCCESS_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res.type).to.equal(JSON_TYPE);
                    done();
                });
        });

        it('Should return 401. For invalid token', (done) => {
            request(app)
                .get(`${routes.getSpecificTrip}455`)
                .set('Authorization', invalidToken)
                .end((err, res) => {
                    expect(res).to.have.status(UNAUTHORIZED_CODE);
                    expect(res.body.error).to.be.equal('Token is not valid');
                    expect(res.body).to.have.property('status').equal(UNAUTHORIZED_CODE);
                    expect(res.type).to.be.equal(JSON_TYPE);
                    expect(res).to.have.headers;
                    done();
                });
        });
    });
});