// Lấy token từ localStorage
const token = localStorage.getItem('token')

// Lấy username từ localStorage
const username = localStorage.getItem('username')

// Kiểm tra xem token và username có tồn tại không
if (!token || !username) {
  console.error('Token hoặc username không tồn tại trong localStorage.')
} else {
  // Cập nhật nội dung thẻ span với username
  const userStatus = document.getElementById('userStatus')
  userStatus.textContent = username

  // Cập nhật dropdown menu
  const dropdownList = document.getElementById('dropdownList')
  dropdownList.style.paddingLeft = '0px'
  // Thay đổi nội dung của ul bằng innerHTML
  dropdownList.innerHTML = `
    <li><a href="" onclick="logout()">Logout</a></li> <!-- Thêm một mục mới -->
    <li><a href="../profile.html">Profile</a></li> <!-- Thêm một mục mới -->
  `
}

function logout() {
  // Xóa token khỏi localStorage
  localStorage.removeItem('token')

  // Thông báo cho người dùng và điều hướng đến trang đăng nhập
  Swal.fire({
    icon: 'success',
    title: 'Log out successfully!',
    showConfirmButton: false,
    timer: 2000,
  })
  window.location.href = '../auth/login.html'
}
