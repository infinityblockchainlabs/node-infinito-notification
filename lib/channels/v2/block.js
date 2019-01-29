module.exports =
  {
    subscribe: {
      event: 'block_sub',
      params: { coins: [] }
    },
    unsubscribe: {
      event: 'block_unsub',
      params: { coins: [] }
    },
    on: {
      event: 'block'
    }
  };