import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
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
    CREATED_CODE, INTERNAL_SERVER_ERROR_CODE, RESOURCE_CONFLICT, SUCCESS_CODE, UNAUTHORIZED_CODE
} from '../constants/responseCodes';
import {
    routes
} from '../data/data';
import { EMAIL_ALREADY_EXIST, OLD_PASSWORD_NOT_MATCH, PASSWORD_DOESNT_MATCH, USER_ID_NOT_FOUND, INCORRECT_PASSWORD } from '../constants/feedback';
import { UNAUTHORIZED_ACCESS } from '../constants/responseMessages';
import { userTable } from '../models/user';
chai.use(chaiHttp);

const {
    expect,
    request
} = chai;

describe('Test case: User authentication Endpoint => /api/v1/auth/', () => {

    describe('Base case: User creates an account', () => {
        it('Should return status 200. Correct credentials', (done) => {
            request(app)
                .post(routes.signup)
                .send(preSave)
                .end((err, res) => {
                    expect(res).to.have.status(CREATED_CODE);
                    expect(res.type).to.be.equal(JSON_TYPE);
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

        it('Should return status 400. If required fields are not inserted', (done) => {
            request(app)
                .post(routes.signup)
                .send(faker)
                .end((err, res) => {
                    expect(res).to.have.status(INTERNAL_SERVER_ERROR_CODE);
                    done();
                });
        });

        it('Should not duplicate users if email already exists', (done) => {
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

        it('Should reject explicit values. Return status 400', (done) => {
            request(app)
                .post(routes.signup)
                .send(explicitData)
                .end((err, res) => {
                    expect(res).to.have.status(INTERNAL_SERVER_ERROR_CODE);
                    expect(res.type).to.be.equal(JSON_TYPE);
                    expect(res.body.error).to.contain('is not allowed');
                    done();
                });
        });
    });

    describe('Base case: User logs in -> /api/v1/auth/signin', () => {
        it('Should return status 200. Signin user with correct credentials', (done) => {
            request(app)
                .post(routes.signin)
                .send(preSaveLog)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(SUCCESS_CODE);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('status');
                    expect(res.type).to.be.equal(JSON_TYPE);
                    done();
                });
        });

        it('Should return status 401. User puts fake credentials', (done) => {
            request(app)
                .post(routes.signin)
                .send(fakeUser)
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(UNAUTHORIZED_CODE);
                    expect(res.body.error).to.be.equal(UNAUTHORIZED_ACCESS);
                    expect(res.body).to.have.property('status').to.be.equal(UNAUTHORIZED_CODE);
                    done();
                });
        });

        it('Should return status 401. Incorrect credentials', (done) => {
            request(app)
                .post(routes.signin)
                .send(explicitData)
                .end((err, res) => {
                    expect(res.status).to.equal(UNAUTHORIZED_CODE);
                    done();
                });
        });

        it('Should return status 401. Incorrect password', (done) => {
            preSaveLog.password = '123';
            request(app)
                .post(routes.signin)
                .send(preSaveLog)
                .end((err, res) => {
                    expect(res.status).to.equal(UNAUTHORIZED_CODE);
                    expect(res.type).to.be.equal(JSON_TYPE);
                    expect(res.body).to.be.an('object');
                    expect(res.body.error).to.be.equal(INCORRECT_PASSWORD)
                    expect(res.body).to.have.property('status').equal(UNAUTHORIZED_CODE)
                    done();
                });
        });
    });

    describe('Reset password', ()=> {
        it('Should change user password',(done)=>{
            request(app)
            .post('/api/v1/auth/reset/1')
            .send(changePassword).end((err,res) =>{
                expect(res.status).to.equal(SUCCESS_CODE);
                expect(res.body).to.have.property('status').equal(SUCCESS_CODE);
                expect(res.body.data).to.be.an('object');
                expect(res.body.message).to.be.a("string")
                done();
            });
        });

        it('Should not reset password if it does not match old password',(done)=>{
            changePassword.old_password = "1234567";
            request(app)
            .post('/api/v1/auth/reset/1')
            .send(changePassword).end((err,res) =>{
                expect(res.status).to.equal(UNAUTHORIZED_CODE);
                expect(res.body).to.have.property('status').equal(UNAUTHORIZED_CODE);
                expect(res.body.error).to.be.equal(OLD_PASSWORD_NOT_MATCH);
                done();
            });
        });
        it('Should return 401 if confirm password does not match new password',(done)=>{
            changePassword.old_password = "123456";
            changePassword.confirm_password = "1234567b";
            request(app)
            .post('/api/v1/auth/reset/1')
            .send(changePassword).end((err,res) =>{
                expect(res.status).to.equal(UNAUTHORIZED_CODE);
                expect(res.body).to.have.property('status').equal(UNAUTHORIZED_CODE);
                expect(res.body.error).to.be.equal(PASSWORD_DOESNT_MATCH);
                done();
            });
        });
        it('Should not reset password if ID is not found',(done)=>{
            userTable.map(user => { user.id = 2 })
            request(app)
            .post('/api/v1/auth/reset/1')
            .send(changePassword).end((err,res) =>{
                expect(res.status).to.equal(UNAUTHORIZED_CODE);
                expect(res.body).to.have.property('status').equal(UNAUTHORIZED_CODE);
                expect(res.body.error).to.be.equal(USER_ID_NOT_FOUND);
                done();
            });
        });
        it('Should not reset password If new password is less than 6',(done)=>{
            userTable.map(user => { user.id = 1 });
            changePassword.new_password = "123";
            request(app)
            .post('/api/v1/auth/reset/1')
            .send(changePassword).end((err,res) =>{
                expect(res.status).to.equal(INTERNAL_SERVER_ERROR_CODE);
                expect(res.body).to.have.property('status').equal(INTERNAL_SERVER_ERROR_CODE);
                done();
            });
        });
    });
});

