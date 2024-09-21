const checkBtn = document.querySelector('#checkAvailable')
checkBtn.addEventListener('click', (e) => {
  e.preventDefault()
  const checkinDate = document.querySelector('#date-in').value
  const checkoutDate = document.querySelector('#date-out').value
  const checkIn = new Date(checkinDate)
  const checkOut = new Date(checkoutDate)
  // Định dạng ngày theo chuẩn ISO hoặc chuẩn YYYY-MM-DD
  const formattedCheckIn = formatDateToYYYYMMDD(checkIn) // "2024-09-24"
  const formattedCheckOut = formatDateToYYYYMMDD(checkOut) // "2024-09-25"
  console.log(formattedCheckIn, '/', formattedCheckOut)
})
function formatDateToYYYYMMDD(dateStr) {
  const date = new Date(dateStr)

  // Lấy từng thành phần của ngày
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2) // getMonth() trả về từ 0-11, nên cần +1
  const day = ('0' + date.getDate()).slice(-2) // getDate() trả về ngày

  // Kết hợp lại thành chuỗi YYYY-MM-DD
  return `${year}-${month}-${day}`
}
