const checkBtn = document.querySelector('#checkAvailable')
checkBtn.addEventListener('click', (e) => {
  e.preventDefault()

  const checkinDate = document.querySelector('#date-in').value
  const checkoutDate = document.querySelector('#date-out').value

  // Kiểm tra ngày checkin
  if (checkinDate === 'Invalid Date' || !checkinDate) {
    alert('Please choose a check-in day!')
    return
  }

  // Kiểm tra ngày checkout
  if (checkoutDate === 'Invalid Date' || !checkoutDate) {
    alert('Please choose a check-out day!')
    return
  }

  // Chuyển đổi các chuỗi ngày thành đối tượng Date
  const checkin = new Date(checkinDate.split('-').reverse().join('-')) // Định dạng dd-mm-yyyy
  const checkout = new Date(checkoutDate.split('-').reverse().join('-'))

  // Kiểm tra xem ngày checkout có sau ngày checkin không
  if (checkout <= checkin) {
    alert('Check-out date must be after check-in date!')
    return
  }

  console.log(checkinDate, '/', checkoutDate)
})
