interface SepayWebhookPayload {
    id: number;                         // ID giao dịch trên SePay
    gateway: string;                    // Tên ngân hàng
    transactionDate: string;            // Thời gian giao dịch
    accountNumber: string;              // Số tài khoản ngân hàng
    code?: string | null;               // Mã code thanh toán (có thể là null)
    content: string;                    // Nội dung chuyển khoản
    transferType: 'in' | 'out';        // Loại giao dịch
    transferAmount: number;             // Số tiền giao dịch
    accumulated: number;                // Số dư tài khoản
    subAccount?: string | null;         // Tài khoản ngân hàng phụ (có thể là null)
    referenceCode: string;              // Mã tham chiếu
    description?: string;               // Mô tả (có thể để trống)
  }
  