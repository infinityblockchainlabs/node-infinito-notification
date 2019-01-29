const Socket = require('../index');
const Config = require('./config.test');
const Assert = require('assert');

let options = {
  apiKey: Config.API_KEY,
  secret: Config.SECRECT,
  authUrl: Config.AUTH_URL,
  baseUrl: Config.BASE_URL
};

describe('test socket client connect', () => {

  describe('connect to the server', () => {
    it('Should establish connection', done => {
      let client = new Socket(options);
      client.connect(() => {
        Assert.ok('connected');
        done();
      }).then(() => {
        client.error((err) => {
          console.log(err);
          Assert.fail('Should connected');
          done();
        });
      });
    });

    it('Fail connection', done => {
      options.baseUrl = 'http://127.0.0.1:8000';
      let client = new Socket(options);
      client.connect(() => {
        Assert.fail('Should not connect');
        done();
      }).then(() => {
        client.error(() => {
          Assert.ok('connect fail');
          done();
        });
      });
    });
  });
});