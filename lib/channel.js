const Config = require('./config');

/**
 * Socket channel
 *
 * @class Channel
 */
class Channel {
  constructor(socket, channel, tokenProvider) {
    this.channel = channel;
    this.socket = socket;
    this.tokenProvider = tokenProvider;
  }

  /**
   * Subscribe channel
   *
   * @param {*} params
   * @memberof Channel
   */
  async subscribe(params) {
    if (!params.token) {
      let token = await this.tokenProvider.getLatestToken();
      params.token = `${Config.AUTH_PREFIX} ${token}`;
    }

    this.socket.emit(this.channel.subscribe.event, params);
  }

  /**
   * Unsubscribe channel
   *
   * @param {*} params
   * @memberof Channel
   */
  unsubscribe(params) {
    this.socket.emit(this.channel.unsubscribe.event, params);
  }

  /**
   * Receive event
   *
   * @param {*} callback
   * @memberof Channel
   */
  on(callback) {
    this.socket.on(this.channel.on.event, function(data) {
      callback(data);
    });
  }
}

module.exports = Channel;