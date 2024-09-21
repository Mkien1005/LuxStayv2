'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::transaction.transaction', ({ strapi }) => ({
  async webhook(ctx) {
      const data = ctx.request; // Lấy dữ liệu từ body
      console.log('Webhook data received:', data);
  },
}));
