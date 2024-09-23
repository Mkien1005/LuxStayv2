
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
    const transactionData = {
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
    };
    // Tạo bản ghi giao dịch
    await strapi.db.query('api::transaction.transaction').create({ data: transactionData, });

    // Tách mã đơn hàng
    const regex = /LuxStay(\d+)/;
    const matches = transactionContent.match(regex);
    const payOrderId = matches ? matches[1] : null;

    if (!payOrderId || isNaN(payOrderId)) {
      return ctx.badRequest(`Order not found. Order_id ${payOrderId}`);
    }

    // Tìm đơn hàng và cập nhật trạng thái
    const order = await strapi.db.query('api::booking.booking').findOne({
      where :{
        id: payOrderId,
        total: amountIn,
        status: 'Chưa thanh toán',
      }
    });

    if (!order) {
      return ctx.badRequest(`Order not found. Order_id ${payOrderId}`);
    }

    // Cập nhật trạng thái đơn hàng
  await strapi.db.query('api::booking.booking').update({
    where: { id: payOrderId },
    data: { status: 'Đã thanh toán' },
  });

    // Trả về kết quả thành công
    ctx.send({ success: true });
  },
}; 
