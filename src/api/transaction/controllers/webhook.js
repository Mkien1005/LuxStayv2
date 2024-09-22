"use strict";

module.exports = ({ strapi }) => ({
  async webhook(ctx) {
    try {
      return await strapi
        .plugin("open-ai-embeddings")
        .service("embeddings")
        .webhook(ctx.request.body);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
});