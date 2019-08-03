import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import { preSave, JSON_TYPE } from '../data/data';
import { NOT_FOUND_CODE } from '../constants/responseCodes';

chai.use(chaiHttp);

const {
    expect,
    request
} = chai;

describe('Test case: Root app ', () => {
    describe('Base case: Endpoint not available', () => {
        it('Should return 404 if request no found', (done) => {
            request(app)
                .post('/api/v1/')
                .end((err, res) => {
                    expect(res).to.have.status(NOT_FOUND_CODE);
                    expect(res.body).to.have.property('status').equal('error');
                    expect(res.type).to.be.equal(JSON_TYPE);
                    done();
                });
        });
        it('Should return 404 if request no found', (done) => {
            request(app)
                .post('/')
                .send(preSave)
                .end((err, res) => {
                    expect(res).to.have.status(NOT_FOUND_CODE);
                    expect(res.body).to.have.property('status').equal('error');
                    expect(res.type).to.be.equal(JSON_TYPE);
                    done();
                });
        });
    });
});