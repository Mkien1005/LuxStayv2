'use strict';

import transaction from '../controllers/transaction';

/**
 * transaction router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::transaction.transaction');
