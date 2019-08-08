import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import {  JSON_TYPE } from '../data/data';
import {  BAD_REQUEST_CODE } from '../constants/responseCodes';

chai.use(chaiHttp);

const {
    expect,
    request
} = chai;

describe('Test case: Root app ', () => {
    describe('Base case: Endpoint not available', () => {
        it('Should return 400 if Bad Request', (done) => {
            request(app)
                .post('/api/v1/')
                .end((err, res) => {
                    expect(res).to.have.status(BAD_REQUEST_CODE);
                    expect(res.body).to.have.property('status').equal(BAD_REQUEST_CODE);
                    expect(res.type).to.be.equal(JSON_TYPE);
                    done();
                });
        });
    });
});