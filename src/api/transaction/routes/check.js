module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/check',
        handler: 'check.checkStatus',
        config:{
            auth:false,
       }
      },
    ],
  };