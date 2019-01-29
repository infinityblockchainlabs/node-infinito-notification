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

describe('socket.block', () => {

  beforeEach(async() => {
    client = new Socket(options);
    await client.connect();
  });

  describe('subscribe to server', () => {
    it('on', done => {
      try {
        let block = client.Block;
        block.subscribe({
          coins: ['BTC', 'ETH', 'DOGE', 'DASH']
        });

        block.on((data) => {
          num++;
          Assert.ok(data);
          block.unsubscribe({
            coins: ['BTC', 'ETH']
          });
          if (num == 1) {
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