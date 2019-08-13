import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import jwt from "jsonwebtoken";
import {
    preSaveLog,
    preSave,
    JSON_TYPE,
    faker,
    fakeUser,
    explicitData,
    changePassword,
} from '../data/data';
import {
    CREATED_CODE, RESOURCE_CONFLICT, SUCCESS_CODE, UNAUTHORIZED_CODE, UNPROCESSABLE_ENTITY, NOT_FOUND_CODE
} from '../constants/responseCodes';
import {
    routes
} from '../data/data';
import { EMAIL_ALREADY_EXIST, OLD_PASSWORD_NOT_MATCH, PASSWORD_DOESNT_MATCH, USER_ID_NOT_FOUND, INCORRECT_PASSWORD } from '../constants/feedback';
import { dropIntest } from '../models';
chai.use(chaiHttp);
const {
    expect,
    request
} = chai;

export const adminTokenId = jwt.sign({ email: preSave.email, id: 1, is_admin: preSave.is_admin },
    process.env.JWT_KEY, { expiresIn: '10min' });

export const userTokenId = jwt.sign({ email: "user@gmail.com", id: 1, is_admin: false },
    process.env.JWT_KEY, { expiresIn: '10min' });

before(()=>{
    dropIntest.dropUserTable('DROP TABLE IF EXISTS users');
});

describe('Test case: User authentication Endpoint => /api/v2/auth/', () => {
  
    describe('Base case: User creates new account', () => {
        it('Should return 201. Account was successfully created', (done) => {
            preSave.is_admin = false;
            request(app)
                .post(routes.signup)
                .send(preSave)
                .set('Accept', JSON_TYPE)
                .end((err, res) => {
                    expect(res).to.have.status(CREATED_CODE);
                    expect(res.type).to.be.equal(JSON_TYPE);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.be.an('object');
                    
                    done();
                });
        });

        it('Should return 422. If required fields are not inserted', (done) => {
            request(app)
                .post(routes.signup)
                .send(faker)
                .end((err, res) => {
                    expect(res).to.have.status(UNPROCESSABLE_ENTITY);
                    done();
                });
        });

        it('Should return 409. User email already exists', (done) => {
            request(app)
                .post(routes.signup)
                .send(preSave)
                .end((err, res) => {
                    expect(res.body.error).to.be.equal(EMAIL_ALREADY_EXIST);
                    expect(res.statusCode).to.be.equal(RESOURCE_CONFLICT);
                    expect(res.type).to.be.equal(JSON_TYPE);
                    done();
                });
        });

        it('Should return 422. Reject explicit values.', (done) => {
            request(app)
                .post(routes.signup)
                .send(explicitData)
                .end((err, res) => {
                    expect(res).to.have.status(UNPROCESSABLE_ENTITY);
                    expect(res.type).to.be.equal(JSON_TYPE);
                    expect(res.body.error).to.contain('is not allowed');
                    done();
                });
        });
    });
});