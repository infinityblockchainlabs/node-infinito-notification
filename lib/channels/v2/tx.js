module.exports =
  {
    subscribe: {
      event: 'tx_sub',
      params: { coins: [] }
    },
    unsubscribe: {
      event: 'tx_unsub',
      params: { coins: [] }
    },
    on: {
      event: 'tx'
    }
  };