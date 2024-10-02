let loginBtn = document.querySelector('.login-button')
loginBtn.addEventListener('click', (e) => {
  e.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  if (!email || !password) {
    Swal.fire({
      icon: 'error',
      title: 'Please enter email and password!',
      showConfirmButton: false,
      timer: 2000,
    })
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
      console.log(data)
      if (data.result && data.result.token && data.result.username) {
        // Lưu token vào localStorage
        
        localStorage.setItem('token', data.result.token)
        localStorage.setItem('username',data.result.username)
        Swal.fire({
          icon: 'success',
          title: 'Login success!',
          showConfirmButton: false,
          timer: 2000,
        })
        setTimeout(()=> {window.location.href = '../index.html'},2000)
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Please enter email and password!',
          showConfirmButton: false,
          timer: 2000,
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      
    })
})
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
})
