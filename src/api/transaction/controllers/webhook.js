"use strict";

module.exports = ({ strapi }) => ({
  async webhook(ctx) {
    try {
      const webhookData = ctx.request.body;
      console.log(webhookData);
      ctx.send({ message: 'Webhook received successfully' });
    } catch (error) {
      console.error('Error processing webhook:', error);
      ctx.throw(500, 'Error processing webhook');
    }
  },
});