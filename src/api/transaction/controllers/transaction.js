'use strict';

/**
 * transaction controller
 */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Sử dụng body-parser để xử lý JSON từ body
app.use(bodyParser.json());
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::transaction.transaction');
app.post('/webhook', (req, res) => {
    // Lấy dữ liệu thô từ body (JSON đã được phân tích)
    const data = req.body;
    
    console.log('Webhook data received:', data);
  
    // Kiểm tra và xử lý dữ liệu
    if (data && data.id && data.gateway) {
      console.log('Transaction ID:', data.id);
      console.log('Gateway:', data.gateway);
      // Thực hiện xử lý tiếp (như lưu vào cơ sở dữ liệu)
  
      // Gửi phản hồi lại cho SePay
      res.status(200).json({ message: 'Webhook received and processed' });
    } else {
      res.status(400).json({ message: 'Invalid data' });
    }
  });
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });