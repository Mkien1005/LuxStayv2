function login() {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  if (!username || !password) {
    document.getElementById('error-message').textContent = 'Please enter both username and password'
    return
  }

  const loginData = {
    username: username,
    password: password,
  }

  fetch('https://identity-service-qboe.onrender.com/identity/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.result && data.result.token) {
        // Lưu token vào localStorage
        localStorage.setItem('token', data.result.token)
        Swal.fire({
          icon: 'success',
          title: 'Log in successfully!',
          showConfirmButton: false,
          timer: 1500,
        })
        // Chuyển hướng và truyền username qua URL
        setTimeout(() => {
          window.location.href = '../index.html'
        }, 1500)
      } else {
        // Hiển thị thông báo lỗi từ phản hồi
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Log in fail!',
        })
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Server internal!',
      })
    })
}
function register() {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const fristname = document.getElementById('fristname').value
  const lastname = document.getElementById('lastname').value
  const dob = document.getElementById('dob').value

  if (!username || !password || !fristname || !lastname || !dob) {
    alert('Please enter complete information')
    return
  }

  const registerData = {
    username: username,
    password: password,
    fristName: fristname,
    lastName: lastname,
    dob: dob,
  }

  fetch('https://identity-service-qboe.onrender.com/identity/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerData),
  })
    .then((response) => {
      if (response.ok) {
        // Đăng ký thành công, gửi yêu cầu đăng nhập ngay sau đó
        Swal.fire({
          icon: 'success',
          title: 'Register successfully!',
          showConfirmButton: false,
          timer: 2000,
        })
        setTimeout(() => {
          window.location.href = '../auth/login.html'
        }, 2000)
      } else {
        return response.json().then((data) => {
          // Kiểm tra nếu có message trong phản hồi
          if (data && data.message) {
            alert(data.message) // Hiển thị thông báo lỗi từ server
          } else {
            alert('Có lỗi xảy ra, vui lòng thử lại.') // Thông báo mặc định khi không có message cụ thể
          }
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}
