const token = localStorage.getItem('token')
fetch("https://api-gateway-5p4v.onrender.com/identity/users/my-info", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', // Định dạng dữ liệu gửi
      Authorization: `Bearer ${token}`, // Thêm token vào header
    }
})
.then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`) // Xử lý lỗi phản hồi không thành công
    }
    return response.json() // Chuyển đổi phản hồi thành JSON
  })
  .then((data) => {
    // Kiểm tra xem có username trong phản hồi không
    if (data.code === 1000) {
      const firstname = document.getElementById('firstname')
      firstname.textContent = data.result.firstname // Cập nhật nội dung thẻ span với username
      const lastname = document.getElementById('lastname')
      lastname.textContent = data.result.lastname
      // Thay đổi nội dung của ul bằng innerHTML
     
    } else {
      console.error('Không thể lấy data, mã lỗi:', data.code)
      alert('Không thể lấy data, vui lòng kiểm tra lại.')
    }
  })
  .catch((error) => {
    console.error('Có lỗi xảy ra:', error) // Xử lý lỗi
  })