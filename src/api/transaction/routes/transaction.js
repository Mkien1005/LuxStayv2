'use strict';

/**
 * transaction router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const coreRouter = createCoreRouter('api::transaction.transaction');
module.exports = {
    // Gộp các route mặc định với các route tùy chỉnh
    routes: [
      coreRouter.routes,
      {
        method: 'POST',
        path: '/webhook',
        handler: 'transaction.webhook', // Phương thức POST cho webhook
        config: {
          auth: false,
        },
      },
    ],
  };