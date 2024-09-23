'use strict';

module.exports =({ strapi }) =>( {
  async checkStatus(ctx) {
    // Chỉ cho phép POST và POST có ID đơn hàng
    if (!ctx.request.body || !ctx.request.body.order_id || isNaN(ctx.request.body.order_id)) {
      return ctx.badRequest('Access denied: Invalid order ID');
    }

    const orderId = ctx.request.body.order_id;

    // Kiểm tra đơn hàng có tồn tại không
    const order = await strapi.services.booking.findOne({ id: orderId });

    if (order) {
      // Trả về kết quả trạng thái đơn hàng dạng JSON
      return ctx.send({ payment_status: order.payment_status });
    } else {
      // Trả về kết quả không tìm thấy đơn hàng
      return ctx.send({ payment_status: 'order_not_found' });
    }
  },
});
