import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

import {
    JSON_TYPE,
    correctBooking,
    correctTrip,
    bookingStore,
} from '../data/data';
import {
    NOT_FOUND_CODE,
    UNPROCESSABLE_ENTITY,
    GONE,
    UNAUTHORIZED_CODE,
    SUCCESS_CODE,
} from '../constants/responseCodes';
import {
    routes
} from '../data/data';
import {
    dbTrip
} from '../models/trip';
import { userTokenId, adminTokenId } from './test.spec'
import { currentUser } from '../models/user';
import { NOT_LOGGED_IN, NO_BOOKINGS, HAVE_NO_BOOKINGS } from '../constants/feedback';
import { dbBooking } from '../models/booking';

chai.use(chaiHttp);

const {
    expect,
    request
} = chai;

describe('Test case: Booking endpoint /api/v1/bookings', () => {
    describe('Base case: User can book a seat on a trip', () => {
        it('Should return 404. Trip was not found', (done) => {
            correctBooking.trip_id = 20;
            request(app)
                .post(routes.bookings)
                .send(correctBooking)
                .set("Authorization", userTokenId)
                .end((err, res) => {
                    expect(res).to.have.status(NOT_FOUND_CODE);
                    expect(res.body).to.have.property('status').equal(NOT_FOUND_CODE);
                    done();
                });
        });
        it('Should validate trip ID and seat number', (done) => {
            correctBooking.trip_id = -23;
            request(app)
                .post(routes.bookings)
                .send(correctBooking)
                .set('Authorization', userTokenId)
                .end((err, res) => {
                    expect(res).to.have.status(UNPROCESSABLE_ENTITY);
                    expect(res.body.error).to.contain('fails');
                    expect(res.body).to.have.property('status').equal(UNPROCESSABLE_ENTITY);
                    expect(res.type).to.be.equal(JSON_TYPE);
                    expect(res).to.have.headers;
                    done();
                });
        });
        it('Should return 410. Trip was cancelled', (done) => {
            correctBooking.trip_id = 1;
            request(app)
                .post(routes.bookings)
                .send(correctBooking)
                .set('Authorization', userTokenId)
                .end((err, res) => {
                    expect(res).to.have.status(GONE);
                    expect(res).to.have.headers;
                    done();
                });
        });
    });
});