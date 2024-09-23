module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/check-payment-status',
        handler: 'check.checkStatus',
        config:{
            auth:false,
       }
      },
    ],
  };