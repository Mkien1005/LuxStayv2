const token_info = localStorage.getItem('token')
fetch("https://luxstayv2.onrender.com/identity/users/my-info", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', // Định dạng dữ liệu gửi
      Authorization: `Bearer ${token_info}`, // Thêm token vào header
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
      const name = document.getElementById('name')
      name.textContent = data.result.username
      const firstname = document.getElementById('firstname')
      firstname.value = data.result.firstName // Cập nhật nội dung thẻ span với username
      const lastname = document.getElementById('lastname')
      lastname.value = data.result.lastName
      const phone = document.getElementById('phone')
      phone.value = data.result.phone
      const dob = document.getElementById('dob')
      dob.value = data.result.dob
      const email = document.getElementById('email')
      email.textContent = data.result.email
      // Thay đổi nội dung của ul bằng innerHTML
     
    } else {
      console.error('Không thể lấy data, mã lỗi:', data.code)
      alert('Không thể lấy data, vui lòng kiểm tra lại.')
    }
  })
  .catch((error) => {
    console.error('Có lỗi xảy ra:', error) // Xử lý lỗi
  })
  let saveButton = document.querySelector('.profile-button')
  saveButton.addEventListener('click', (e) => {
    e.preventDefault()
    const data = {
      firstName: document.getElementById('firstname').value,
      lastName: document.getElementById('lastname').value,
      phone: document.getElementById('phone').value,
      dob: document.getElementById('dob').value
    }
    const id = localStorage.getItem('id')
   
    fetch(`https://luxstayv2.onrender.com/identity/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token_info}`
        },
        body: JSON.stringify(data)
    })
    .then((response) => {
        if (!response.ok) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!'
            })
        }
        else{
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Update success!'
              })
        } 
        return response.json() // Chuyển đổi phản hồi thành JSON
      })
    
  })
