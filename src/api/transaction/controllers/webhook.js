"use strict";

module.exports = ({ strapi }) => ({
  async webhook(ctx) {
    try {
      // Lấy dữ liệu từ body của request webhook
      const data = ctx.request.body;

      // Kiểm tra dữ liệu nhận được có hợp lệ hay không
      if (!data || typeof data !== 'object') {
        return ctx.badRequest('No data received');
      }

      // Lấy các giá trị từ dữ liệu Sepay gửi về
      const gateway = data.gateway;
      const transactionDate = data.transactionDate;
      const accountNumber = data.accountNumber;
      const subAccount = data.subAccount;

      const transferType = data.transferType;
      const transferAmount = data.transferAmount;
      const accumulated = data.accumulated;

      const code = data.code;
      const transactionContent = data.content;
      const referenceNumber = data.referenceCode;
      const body = data.description;

      // Xác định loại giao dịch (in hoặc out)
      const amountIn = transferType === 'in' ? transferAmount : 0;
      const amountOut = transferType === 'out' ? transferAmount : 0;

      // Tạo đối tượng để lưu vào cơ sở dữ liệu
      const transaction = {
        gateway,
        transaction_date: transactionDate,
        account_number: accountNumber,
        sub_account: subAccount,
        amount_in: amountIn,
        amount_out: amountOut,
        accumulated,
        code,
        transaction_content: transactionContent,
        reference_number: referenceNumber,
        body,
      };

      // Sử dụng ORM của Strapi để tạo bản ghi mới trong cơ sở dữ liệu
      await strapi.db.query('api::transaction.transaction').create({ data: transaction });

      // Trả về phản hồi thành công
      ctx.send({ success: true });
    } catch (err) {
      // Xử lý lỗi và trả về phản hồi thất bại
      ctx.send({ success: false, message: 'Failed to process webhook', error: err.message });
    }
  },
});