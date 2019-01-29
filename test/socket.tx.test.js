const Socket = require('../index');
const Config = require('./config.test');
const Assert = require('assert');

let options = {
  apiKey: Config.API_KEY,
  secret: Config.SECRECT,
  authUrl: Config.AUTH_URL,
  baseUrl: Config.BASE_URL
};
let client = null;
let num = 0;

describe('socket.tx', () => {

  beforeEach(async() => {
    client = new Socket(options);
    await client.connect();
  });

  describe('subscribe to server', () => {
    it('on', done => {
      try {
        let tx = client.Tx;
        let params = { coins: ['BTC', 'ETH', 'BCH', 'DOGE', 'ONT'] };

        tx.subscribe(params);

        tx.on((data) => {
          console.log('data: ', data, num);
          num++;
          Assert.ok(data.coin !== undefined, 'coin must be exist');
          Assert.ok(data.tx_id !== undefined, 'tx_id must be exist');
          tx.unsubscribe(params);
          if (num == 1) {
            tx.unsubscribe(params);
            done();
          }
        });
      } catch (err) {
        Assert.fail(err);
        done(err);
      }
    });
  });
});