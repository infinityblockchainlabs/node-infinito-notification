var appAPI = new Vue({
  el: '#restAPI',
  data: {
    config: {
      baseUrl: "https://socket.infinito.io/v2/inv",
      authUrl: "https://api.infinito.io/iam/token",
      apiKey: "",
      secret: ""
    },
    form: {
      version: '',
      channel: '',
      method: '',
      function: ''
    },
    inputData: null,
    objChannels: null,
    versionList: [],
    channelList: [],
    objMethods: null,
    methodList: [],
    objFunctions: null,
    eventName: "",
    objParams: null,
    paramList: [],
    output: null,
    input: "",
    requestInfo: {
      requestURL: "",
      statusCode: ""
    },
    responseInfo: {

    }
  },
  mounted: function() {
    let self = this;
    self.inputData = inputData;
    for (var item in inputData) {
      this.versionList.push(item);
    }
    // detect call ajax to
    var oldXHR = window.XMLHttpRequest;

    function newXHR() {
      var realXHR = new oldXHR();
      realXHR.addEventListener("readystatechange", function() {
        if (realXHR.readyState == 1) {
          //   alert('server connection established');
        }
        if (realXHR.readyState == 2) {
          //   alert('request received');
          self.requestInfo.requestURL = realXHR.responseURL;
          self.requestInfo.statusCode = realXHR.status;
        }
        if (realXHR.readyState == 3) {
          //   alert('processing request');
        }
        if (realXHR.readyState == 4) {
          //  alert('request finished and response is ready');
        }
      }, false);
      return realXHR;
    }
    window.XMLHttpRequest = newXHR;
  },
  methods: {
    changeVersion: function() {
      let self = this;

      //RESET 
      self.methodList = [];
      self.input = "";
      self.output = null;
      self.requestInfo = {
        requestURL: "",
        statusCode: ""
      };
      self.form.channel = "";
      self.form.method = "";
      self.eventName = '';
      self.objParams = null;
      self.paramList = [];

      self.objChannels = self.getObjectChildFromKeyName(self.form.version, inputData);
      self.channelList = self.getKeyListFromObject(self.objChannels);
    },
    changeChannels: function() {
      var self = this;
      //RESET 
      self.input = "";
      self.output = null;
      self.requestInfo = {
        requestURL: "",
        statusCode: ""
      };
      self.form.method = "";
      self.eventName = '';
      self.objParams = null;
      self.paramList = [];

      self.objMethods = self.getObjectChildFromKeyName(self.form.channel, self.objChannels);
      self.methodList = self.getKeyListFromObject(self.objMethods);
    },
    changeMethod: function() {
      let self = this;
      //RESET 
      self.input = "";
      self.output = null;
      self.requestInfo = {
        requestURL: "",
        statusCode: ""
      };
      self.objFunctions = self.getObjectChildFromKeyName(self.form.method, self.objMethods);
      self.eventName = self.objFunctions.event;
      self.objParams = self.objFunctions.params;
      if (self.objParams) {
        self.paramList = self.getParamListFromObjParams(self.objParams);
      }
      self.input = 'socket.' + self.form.channel + "." + self.form.method + '(';
      for (var i = 0; i < self.paramList.length; i++) {
        if (i != self.paramList.length - 1) {
          self.input += self.paramList[i].name + ', ';
        } else {
          self.input += self.paramList[i].name;
        }

      }
      self.input += ')';

    },
    onSubmit: function() {
      let self = this;
      // set config options for API
      var opts = {};
      opts.apiKey = self.config.apiKey;
      opts.secret = self.config.secret;
      opts.baseUrl = self.config.baseUrl;
      opts.authUrl = self.config.authUrl;
      opts.version = self.form.version;
      var client = new infinitoSocket(opts);
      var paramListValue = self.getParamlistValue(self.paramList);
      var params = {
        coins: paramListValue
      }
      console.log(params);
      client.connect(() => {
        alert('connected');
      }).then(() => {
        client.error((err) => {
          console.log(err);
          alert('Should connected');

        });
      })
    },
    getObjectChildFromKeyName: function(keyName, objectParent) {
      for (var item in objectParent) {
        if (keyName == item) {
          var objectChild = objectParent[item];
          return objectChild;
        }
      }
      return null;
    },
    getKeyListFromObject(object) {
      let result = [];
      for (var item in object) {
        result.push(item);
      }
      return result;
    },
    getParamListFromObjParams(objParams) {
      let self = this;
      var result = [];
      for (var item in objParams) {
        let itemType = 'string';
        if (Array.isArray(objParams[item])) { // array 
          if (objParams[item].length == 0) { //without >= 2 property
            itemType = 'array';
            let itemPush = {
              name: item,
              value: "",
              type: itemType
            }
            result.push(itemPush);
          } else { // array and item have >=2 property
            for (let i = 0; i < objParams[item].length; i++) {
              let property = objParams[item][i];
              let keyList = self.getKeyListFromObject(property);
              for (let j = 0; j < keyList.length; j++) {
                let keyName = keyList[j];
                if (Array.isArray(property[keyName])) {
                  itemType = 'array';
                }
                let itemPush = {
                  name: keyName,
                  value: "",
                  type: itemType
                }
                result.push(itemPush);
              }
            }

          }

        } else { // string only
          let itemPush = {
            name: item,
            value: "",
            type: itemType
          }
          result.push(itemPush);
        }

      }
      return result;
    },
    createParamList(paramList) {
      var result = [];
      for (var i = 0; i < paramList.length; i++) {
        console.log(paramList[i]);
        var itemPush = {
          name: paramList[i],
          value: ""
        }
        result.push(itemPush);
      }
      return result;
    },
    getParamlistValue(paramList) {
      var result = [];
      for (var i = 0; i < paramList.length; i++) {
        if (paramList[i].type == 'string') {
          result.push(paramList[i].value);
        } else {
          let arrayValue = paramList[i].value.split(',');
          result.push(arrayValue);
        }

      }
      return result;
    }
  }
})