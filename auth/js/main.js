let loginBtn = document.querySelector('.login-button')
loginBtn.addEventListener('click', (e) => {
  e.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  if (!email || !password) {
    document.getElementById('error-message').textContent = 'Please enter both email and password'
    return
  }

  const loginData = {
    email: email,
    password: password,
  }

  fetch('https://luxstayv2.onrender.com/identity/auth/token', {
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
        alert('Login successful!')
        // Chuyển hướng và truyền username qua URL
        window.location.href = '../index.html'
      } else {
        // Hiển thị thông báo lỗi từ phản hồi
        document.getElementById('error-message').textContent = data.message || 'Login failed'
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      document.getElementById('error-message').textContent = 'An error occurred. Please try again later.'
    })
})
function register() {
  const username = document.getElementById('username').value
  const email = document.getElementById('password').value
  const password = document.getElementById('password').value

  if (!username || !password || !email) {
    alert('Please enter complete information')
    return
  }

  const registerData = {
    username: username,
    email: email,
    password: password
  }

  fetch('https://luxstayv2.onrender.com/identity/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerData),
  })
    .then((response) => {
      if (response.ok) {
        // Đăng ký thành công, gửi yêu cầu đăng nhập ngay sau đó
        alert('Đăng ký thành công')
        window.location.href = '../auth/login.html'
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
      document.getElementById('message').textContent = 'Registration failed: ' + error.message
    })
}
