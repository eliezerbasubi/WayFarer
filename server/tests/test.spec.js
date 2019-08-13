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
import { UNAUTHORIZED_ACCESS, NOT_FOUND } from '../constants/responseMessages';
import { currentUser } from '../models/user';
import DB_URL from '../config/config';
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
    dropIntest.dropTable('DROP TABLE IF EXISTS users');
    dropIntest.dropTable('DROP TABLE IF EXISTS trips');
});

describe('Test case: User authentication Endpoint => /api/v1/auth/', () => {
  
    describe('Base case: User creates new account', () => {
        it('Should return 201. Account was successfully created', (done) => {
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

        it('Should reject explicit values. Return status 400', (done) => {
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

    describe('Base case: User logs in -> /api/v1/auth/signin', () => {
        it('Should return 200. Signin user with correct credentials', (done) => {
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
            .patch('/api/v1/auth/reset/1')
            .send(changePassword).end((err,res) =>{
                expect(res.status).to.equal(SUCCESS_CODE);
                expect(res.body).to.have.property('status').equal(SUCCESS_CODE);
                expect(res.body.message).to.be.a("string")
                done();
            });
        });

        it('Should not reset password if it does not match old password',(done)=>{
            changePassword.old_password = "1234567";
            request(app)
            .patch('/api/v1/auth/reset/1')
            .send(changePassword).end((err,res) =>{
                expect(res.status).to.equal(UNAUTHORIZED_CODE);
                expect(res.body).to.have.property('status').equal(UNAUTHORIZED_CODE);
                expect(res.body.error).to.be.equal(OLD_PASSWORD_NOT_MATCH);
                done();
            });
        });
        it('Should return 401 if confirm password does not match new password',(done)=>{
            changePassword.old_password = "12345678";
            changePassword.confirm_password = "1234567b";
            request(app)
            .patch('/api/v1/auth/reset/1')
            .send(changePassword).end((err,res) =>{
                expect(res.status).to.equal(UNAUTHORIZED_CODE);
                expect(res.body).to.have.property('status').equal(UNAUTHORIZED_CODE);
                expect(res.body.error).to.be.equal(PASSWORD_DOESNT_MATCH);
                done();
            });
        });
        it('Should not reset password if ID is not found',(done)=>{
            request(app)
            .patch('/api/v1/auth/reset/2')
            .send(changePassword).end((err,res) =>{
                expect(res.status).to.equal(UNAUTHORIZED_CODE);
                expect(res.body).to.have.property('status').equal(UNAUTHORIZED_CODE);
                expect(res.body.error).to.be.equal(USER_ID_NOT_FOUND);
                done();
            });
        });
        it('Should not reset password If new password is less than 6',(done)=>{
            changePassword.new_password = "123";
            request(app)
            .patch('/api/v1/auth/reset/1')
            .send(changePassword).end((err,res) =>{
                expect(res.status).to.equal(UNPROCESSABLE_ENTITY);
                expect(res.body).to.have.property('status').equal(UNPROCESSABLE_ENTITY);
                done();
            });
        });
    });

    describe('Admin can view all users',()=>{
        it('Should return 404. Users not found',(done) => {
            dropIntest.truncateUserTable();
            request(app)
            .get('/api/v1/users')
            .set('Authorization', adminTokenId)
            .end((err,res) => {
                expect(res.status).to.be.equal(NOT_FOUND_CODE);
                done();
            })
        });
        it('Should return 201. Account was successfully created', (done) => {
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
        it('Should return 200. Find all users',(done) => {
            request(app)
            .get('/api/v1/users')
            .set('Authorization', adminTokenId)
            .end((err,res) => {
                expect(res.status).to.be.equal(SUCCESS_CODE);
                expect(res.body.data).to.be.an('array');
                expect(res.body.message).to.be.a("string")
                done();
            })
        });
    });
});

