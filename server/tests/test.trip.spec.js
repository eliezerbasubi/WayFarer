import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import dotenv from "dotenv";
import {
    JSON_TYPE,
    correctTrip,
    invalidToken,
} from '../data/data';
import { userTokenId, adminTokenId } from './test.spec'
import {
    CREATED_CODE,
    RESOURCE_CONFLICT, SUCCESS_CODE, UNAUTHORIZED_CODE, FORBIDDEN_CODE, BAD_REQUEST_CODE, NOT_FOUND_CODE, UNPROCESSABLE_ENTITY
} from '../constants/responseCodes';
import {
    routes
} from '../data/data';
import { INVALID_TOKEN, NOT_LOGGED_IN } from '../constants/feedback';
import { FORBIDDEN_MSG, BAD_REQUEST_MSG } from '../constants/responseMessages';
import { currentUser } from '../models/user';
chai.use(chaiHttp);
dotenv.config();

const {
    expect,
    request
} = chai;

describe('Test case: Trip CRUD Endpoint => /api/v2/trips', () => {
    describe('Base case: Admin can create a trip', () => {
       it('Should return 201. If all fields are provided', (done) => {
        request(app)
            .post(routes.createTrip)
            .set("Authorization",adminTokenId)
            .send(correctTrip)
            .end((_err, res) => {
                expect(res).to.have.status(CREATED_CODE);
                expect(res.type).to.be.equal(JSON_TYPE);
                expect(res.body).to.be.an('object');
                done();
            });
        });

        it('Should return 401. If not token provided', (done) => {
            request(app)
                .post(routes.createTrip)
                .send(correctTrip)
                .end((err, res) => {
                    expect(res).to.have.status(UNAUTHORIZED_CODE)
                    expect(res.body.error).to.be.equal(INVALID_TOKEN);
                    expect(res.body.status).to.be.equal(UNAUTHORIZED_CODE)
                    done()
                });
        });

        it('Should return 403. Restrict access to unauthorized users.', (done) => {
            request(app)
                .post(routes.createTrip)
                .set("Authorization",userTokenId)
                .send(correctTrip)
                .end((err, res) => {
                    expect(res).to.have.status(FORBIDDEN_CODE)
                    expect(res.body.error).to.be.equal(FORBIDDEN_MSG);
                    expect(res.body.status).to.be.equal(FORBIDDEN_CODE)
                    done();
                });
        });

        it('Should return 409. If trips bus is already taken', (done) => {
            correctTrip.trip_id = 2;
            correctTrip.arrival_date = '2019-12-16';
            request(app)
                .post(routes.createTrip)
                .set("Authorization",adminTokenId)
                .send(correctTrip)
                .end((err, res) => {
                    expect(res).to.have.status(RESOURCE_CONFLICT);
                    expect(res.body.error).to.contain('Bus is already taken');
                    expect(res.body.status).to.be.equal(RESOURCE_CONFLICT);
                    done()
                });
        });

        it('Should not create trip if arrival date is before trip date', (done) => {
            correctTrip.arrival_date = "2019-12-2";
            request(app)
                .post(routes.createTrip)
                .set('Authorization', adminTokenId)
                .send(correctTrip)
                .end((err, res) => {
                    expect(res).to.have.status(UNPROCESSABLE_ENTITY)
                    expect(res.body.error).to.contain('arrival_date fails');
                    expect(res.body.status).to.be.equal(UNPROCESSABLE_ENTITY)
                    done();
                });
        });

        it('Should return 401 if admin is not signed in', (done) => {
            currentUser.map(user => { user.id = 2;})
            correctTrip.arrival_date = "2020-12-30"
            request(app)
                .post(routes.createTrip)
                .set('Authorization',adminTokenId)
                .send(correctTrip)
                .end((err, res) => {
                    expect(res).to.have.status(UNAUTHORIZED_CODE);
                    expect(res.body.error).to.be.equal(NOT_LOGGED_IN);
                    expect(res.body.status).to.be.equal(UNAUTHORIZED_CODE);
                    
                    done();
                });
        });
    });

    describe('Base case: Admin can cancel a trip => /api/v2/trips/:trip_id/cancel', () => {
        it('Should return 200. Trip was cancelled successfully', (done) => {
            currentUser.map(user => { user.id = 1 });
            request(app)
                .patch('/api/v2/trips/1/cancel')
                .set('Authorization', adminTokenId)
                .end((err, res) => {
                    expect(res).to.have.status(SUCCESS_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res).to.have.headers;
                    done();
                });
        });
        it('Should return 400. Trip already successfully', (done) => {
            request(app)
                .patch('/api/v2/trips/1/cancel')
                .set('Authorization', adminTokenId)
                .end((err, res) => {
                    expect(res).to.have.status(BAD_REQUEST_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res).to.have.headers;
                    done();
                });
        });
        it('Should return 404. Trip Was Not Found', (done) => {
            request(app)
                .patch('/api/v2/trips/2/cancel')
                .set('Authorization', adminTokenId)
                .end((err, res) => {
                    expect(res).to.have.status(NOT_FOUND_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res).to.have.headers;
                    done();
                });
        });

        it('Should reject invalid ID', (done) => {
            request(app)
                .patch('/api/v2/trips/-1/cancel')
                .set('Authorization', adminTokenId)
                .end((err, res) => {
                    expect(res).to.have.status(BAD_REQUEST_CODE);
                    expect(res.body.error).to.be.equal(BAD_REQUEST_MSG);
                    expect(res.body).to.have.property('status').equal(BAD_REQUEST_CODE)
                    done();
                });
        });
    });
});