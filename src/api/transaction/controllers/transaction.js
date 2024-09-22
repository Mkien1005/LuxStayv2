'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::transaction.transaction', ({ strapi }) => ({
  async webhook(ctx) {
      ctx.body = 'oke';
  },
}));
