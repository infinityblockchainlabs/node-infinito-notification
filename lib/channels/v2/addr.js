module.exports =
  {
    subscribe: {
      event: 'addr_sub',
      params: {
        coins: [{
          coin: '', addresses: []
        }]
      }
    },
    unsubscribe: {
      event: 'addr_unsub',
      params: {
        coins: [{
          coin: '', addresses: []
        }]
      }
    },
    on: {
      event: 'addr'
    }
  };