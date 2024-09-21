'use strict';

/**
 * transaction router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;


module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/transactions',
        handler: 'api::transaction.transaction.webhook', // Đường dẫn đến controller và function
       
      }
    ],
  };