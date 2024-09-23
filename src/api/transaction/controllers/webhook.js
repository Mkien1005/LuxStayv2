
'use strict';

module.exports = {
  async webhook(ctx) {
    // Lấy dữ liệu từ webhook
    const data = ctx.request.body;

    if (!data || typeof data !== 'object') {
      return ctx.badRequest('No data');
    }

    // Khai báo các biến từ dữ liệu
    const { gateway, transactionDate, accountNumber, subAccount, transferType, transferAmount, accumulated, code, content: transactionContent, referenceCode, description: body } = data;

    let amountIn = 0;
    let amountOut = 0;

    // Xác định giao dịch tiền vào hay tiền ra
    if (transferType === 'in') amountIn = transferAmount;
    else if (transferType === 'out') amountOut = transferAmount;

    // Tạo bản ghi giao dịch
    const transaction = await strapi.services.tb_transactions.create({
      gateway,
      transaction_date: transactionDate,
      account_number: accountNumber,
      sub_account: subAccount,
      amount_in: amountIn,
      amount_out: amountOut,
      accumulated,
      code,
      transaction_content: transactionContent,
      reference_number: referenceCode,
      body,
    });

    // Tách mã đơn hàng
    const regex = /DH(\d+)/;
    const matches = transactionContent.match(regex);
    const payOrderId = matches ? matches[1] : null;

    if (!payOrderId || isNaN(payOrderId)) {
      return ctx.badRequest(`Order not found. Order_id ${payOrderId}`);
    }

    // Tìm đơn hàng và cập nhật trạng thái
    const order = await strapi.services.tb_orders.findOne({
      id: payOrderId,
      total: amountIn,
      payment_status: 'Chưa thanh toán',
    });

    if (!order) {
      return ctx.badRequest(`Order not found. Order_id ${payOrderId}`);
    }

    // Cập nhật trạng thái đơn hàng
    await strapi.services.tb_orders.update({ id: payOrderId }, { payment_status: 'Đã thanh toán' });

    // Trả về kết quả thành công
    ctx.send({ success: true });
  },
};
