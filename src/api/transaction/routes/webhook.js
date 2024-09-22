
module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/webhook',
        handler: 'webhook.webhook', // Đường dẫn đến controller và function
      }
    ],
  };