// Lấy token từ localStorage
const token = localStorage.getItem('token');

// Kiểm tra xem token có tồn tại không
if (!token) {
    console.error("Token không tồn tại trong localStorage.");
    alert("Bạn cần đăng nhập để tiếp tục.");
} else {
    // Tạo đối tượng payload cho yêu cầu
    const loginData = {
        token: token // Sử dụng token đã lấy được
    };

    // Gửi yêu cầu fetch tới API
    fetch('https://identity-service-qboe.onrender.com/identity/auth/getUsername', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Định dạng dữ liệu gửi
            'Authorization': `Bearer ${token}` // Thêm token vào header
        },
        body: JSON.stringify(loginData) // Chuyển đổi đối tượng thành chuỗi JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // Xử lý lỗi phản hồi không thành công
        }
        return response.json(); // Chuyển đổi phản hồi thành JSON
    })
    .then(data => {
        // Kiểm tra xem có username trong phản hồi không
        if (data.code === 1000 && data.result && data.result.username) {
            const userStatus = document.getElementById("userStatus");
            userStatus.textContent = data.result.username; // Cập nhật nội dung thẻ span với username
            const dropdownList = document.getElementById('dropdownList');

            // Thay đổi nội dung của ul bằng innerHTML
            dropdownList.innerHTML = `
                <li><a href="" onclick="logout()">Logout</a></li> <!-- Thêm một mục mới -->
                <li><a href="#">Profile</a></li> <!-- Thêm một mục mới -->
            `;
        } else {
            console.error("Không thể lấy username, mã lỗi:", data.code);
            alert("Không thể lấy username, vui lòng kiểm tra lại.");
        }
    })
    .catch(error => {
        console.error("Có lỗi xảy ra:", error); // Xử lý lỗi
        alert("Có lỗi xảy ra, vui lòng thử lại.");
    });
}
function logout(){
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');

    // Thông báo cho người dùng và điều hướng đến trang đăng nhập
    alert("Bạn đã đăng xuất thành công.");
    window.location.href = "../auth/login.html";
}