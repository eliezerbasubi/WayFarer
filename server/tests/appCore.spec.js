import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import {  JSON_TYPE } from '../data/data';
import {  METHOD_NOT_FOUND } from '../constants/responseCodes';

chai.use(chaiHttp);

const {
    expect,
    request
} = chai;

describe('Test case: Root app ', () => {
    describe('Base case: Endpoint not available', () => {
        it('Should return 405 if Bad Request', (done) => {
            request(app)
                .post('/api/v2/')
                .end((err, res) => {
                    expect(res).to.have.status(METHOD_NOT_FOUND);
                    expect(res.body).to.have.property('status').equal(METHOD_NOT_FOUND);
                    expect(res.type).to.be.equal(JSON_TYPE);
                    done();
                });
        });
    });
});