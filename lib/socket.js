const Util = require('util');
const Messages = require('./messages');
const SocketClient = require('socket.io-client');
const Channels = require('./channels');
const Channel = require('./channel');
const { TokenProvider, Logger, AppError, Helper } = require('node-infinito-util');

/**
 * Socket class
 *
 * @class Socket
 */
class Socket {

  /**
   * Creates an instance of Api.
   * @param {Object} options
   * @param {String} options.apiKey              (required) API Key
   * @param {String} options.secret              (required) Secret Key
   * @param {String} options.baseUrl             (optional) Base url of socket
   * @param {String} options.authUrl             (optional) Url of authentication server
   * @param {String} options.version             (optional) API version. Default is v1
   * @param {String} options.logger              (optional) Logger interface
   * @param {String} options.logLevel            (optional) Set internal logger level (ALL < DEBUG < INFO < WARN < ERROR < NONE)
   * @memberof Socket
   */
  constructor(options) {
    const defaultOpt = {
      baseUrl: 'https://socket.infinito.io/v2/inv',
      authUrl: 'https://api.infinito.io/iam/token',
      version: 'v2',
      tokenExpired: 86400
    };

    if (!options) {
      throw new AppError(Util.format(Messages.missing_parameter.message, 'options'), Messages.missing_parameter.code);
    }

    this.options = Helper.merge({}, defaultOpt, options);

    if (this.options.logger) {
      Logger.setLogger(this.options.logger);
    }
    Logger.setLogLevel(options.logLevel);

    let tokenProvider = new TokenProvider({
      apiKey: this.options.apiKey,
      secret: this.options.secret,
      url: `${this.options.authUrl}`,
      expired: this.options.tokenExpired
    });
    this.tokenProvider = tokenProvider;

    if (!Channels[this.options.version]) {
      throw new AppError(Util.format(Messages.invalid_version.message, this.options.version), Messages.invalid_version.code);
    }
  }

  /**
   * Connect socket
   *
   * @param {*} cb
   * @memberof Socket
   */
  async connect(cb) {
    let socket = SocketClient(this.options.baseUrl, {
      transports: ['websocket'],
    });

    this.socket = socket;
    let definitions = Channels[this.options.version];
    Object.keys(definitions).forEach((channelName) => {
      this[channelName] = new Channel(this.socket, definitions[channelName], this.tokenProvider);
    });

    this.socket.on('connect', function() {
      if (cb) {
        cb();
      }
    });
  }

  disconnect(cb) {
    this.socket.on('disconnect', function() {
      if (cb) {
        cb();
      } else {
        throw new AppError(Util.format(Messages.disconnect_socket.message, this.options.version), Messages.disconnect_socket.code);
      }
    });
  }

  error(cb) {
    this.socket.on('error', function(error) {
      if (cb) {
        cb(error);
      } else {
        throw new AppError(Util.format(Messages.error_socket.message, this.options.version), Messages.error_socket.code);
      }
    });
  }

  connect_error(cb) {
    this.socket.on('connect_error', function(error) {
      if (cb) {
        cb(error);
      } else {
        throw new AppError(Util.format(Messages.error_socket.message, this.options.version), Messages.error_socket.code);
      }
    });
  }

}

module.exports = Socket;