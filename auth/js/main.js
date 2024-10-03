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
        localStorage.setItem('id',data.result.id)
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
