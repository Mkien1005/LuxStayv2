import { config } from "dotenv";

module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/webhook',
        handler: 'transaction.webhook', // Đường dẫn đến controller và function
        config:{
            auth:false,
       }
       
      }
    ],
  };