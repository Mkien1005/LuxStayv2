
let signupbt = document.querySelector('.signup-button')
signupbt.addEventListener('click', (e) => {
  e.preventDefault()
  const username = document.getElementById('username').value
  const email = document.getElementById('email').value
  const password = document.getElementById('pass').value

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
        Swal.fire({
            icon: 'success',
            title: 'Đăng ký thành công',
            showConfirmButton: false,
            timer: 2000,
          })
          setTimeout(() => {
            window.location.href = '../auth/login.html'
          }, 2000)
      } else {
        return response.json().then((data) => {
            console.log(data)
          // Kiểm tra nếu có message trong phản hồi
          if (data && data.message) {
            Swal.fire({
                icon: 'error',
                title: data.message,
                showConfirmButton: false,
                timer: 2000,
              })
          } else {
            Swal.fire({
                icon: 'error',
                title: 'Có lỗi xảy ra, vui lòng thử lại.',
                showConfirmButton: false,
                timer: 2000,
              })
          }
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      document.getElementById('message').textContent = 'Registration failed: ' + error.message
    })
})