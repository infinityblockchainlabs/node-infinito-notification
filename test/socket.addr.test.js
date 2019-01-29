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

describe('socket.addr', () => {

  beforeEach(async() => {
    client = new Socket(options);
    await client.connect();
  });

  describe('subscribe to server', () => {
    it('on', done => {
      try {
        let chAddr = client.Address;
        let params = {
          coins: [{
            coin: 'BTC',
            addresses: [
              'bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej'
            ]
          }]
        };

        chAddr.subscribe(params);

        chAddr.on((data) => {
          num++;
          Assert.ok(data.coin !== undefined, 'coin must be exist');
          Assert.ok(data.tx_id !== undefined, 'tx_id must be exist');
          chAddr.unsubscribe(params);

          if (num >= 1) {
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