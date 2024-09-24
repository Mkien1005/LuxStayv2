const listRooms = document.querySelectorAll('.room-table') // Lấy tất cả các phòng
const overlay = document.querySelector('.booking-overlay') // Overlay để hiển thị khi nhấp vào phòng
const closeBtn = document.querySelector('.close') // Nút đóng overlay
const roomBooking = document.querySelector('.room-booking') // Phần tử .room-booking để đặt ID
// Lặp qua từng phòng
listRooms.forEach((card) => {
  card.addEventListener('click', () => {
    overlay.classList.add('active') // Hiển thị overlay
    roomBooking.id = card.id // Đặt id của .room-booking là id của phòng được nhấp
  })
})
overlay.addEventListener('click', () => {
  overlay.classList.remove('active')
})
roomBooking.addEventListener('click', (e) => {
  e.stopPropagation()
})
// Nút đóng overlay
closeBtn.addEventListener('click', () => {
  overlay.classList.remove('active') // Ẩn overlay
})

const checkBtn = document.querySelector('#checkAvailable')
checkBtn.addEventListener('click', (e) => {
  e.preventDefault()

  const checkin = document.querySelector('#date-in').value
  const checkout = document.querySelector('#date-out').value
  // Kiểm tra ngày checkin
  if (checkin === 'Invalid Date' || !checkin) {
    alert('Please choose a check-in day!')
    return
  }

  // Kiểm tra ngày checkout
  if (checkout === 'Invalid Date' || !checkout) {
    alert('Please choose a check-out day!')
    return
  }
  // Chuyển đổi các chuỗi ngày thành đối tượng Date
  let checkInDate = convertToISO8601(checkin).substring(0, 10)
  let checkOutDate = convertToISO8601(checkout).substring(0, 10)
  // Kiểm tra xem ngày checkout có sau ngày checkin không
  if (checkout <= checkin) {
    alert('Check-out date must be after check-in date!')
    return
  }
  const guestsText = document.querySelector('#guest + .nice-select .current').textContent
  const guests = guestsText.replace(/\D/g, '') // Loại bỏ tất cả các ký tự không phải số

  // Lấy giá trị số lượng rooms từ nice-select của room
  const roomsText = document.querySelector('#room + .nice-select .current').textContent
  const rooms = roomsText.replace(/\D/g, '') // Loại bỏ tất cả các ký tự không phải số

  // In các giá trị ra console (hoặc xử lý logic khác như gửi dữ liệu)
  console.log('Check In:', checkInDate)
  console.log('Check Out:', checkOutDate)
  console.log('Guests:', guests) // Chỉ số lượng guests
  console.log('Rooms:', rooms) // Chỉ số lượng rooms
  overlay.classList.remove('active')
  const id = roomBooking.id
  try {
    fetch(`https://api-gateway-5p4v.onrender.com/api/rooms/${id}`)
      .then((response) => response.json())
      .then(async (data) => {
        const room = data.data.attributes
        let day = calculateDaysBetween(checkInDate, checkOutDate)
        var price = room.price.value * day
        if (rooms > 1) {
          price = price * rooms
        }
        await fetch('https://api-gateway-5p4v.onrender.com/api/bookings/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              check_in: checkInDate,
              check_out: checkOutDate,
              user_id: 1,
              room_id: id,
              total: price,
            },
          }),
        })
          .then((response) => response.json())
          .then((booking) => {
            console.log('Data:', booking)
            if (booking.data) {
              let idBooking = booking.data.id
              if (isRoomAvailable(room, checkInDate, checkOutDate)) {
                // Tạo overlay
                const overlay = document.createElement('div')
                overlay.classList.add('message-overlay', 'active')
                // Tạo phần tử message
                const messageBox = document.createElement('div')
                messageBox.classList.add('message')

                // Tạo tiêu đề
                const heading = document.createElement('h3')
                heading.textContent = 'Do you want to book this room?'

                // Tạo phần tử Guest
                const guestInfo = document.createElement('p')
                guestInfo.textContent = `Guest: ${guests}`

                // Tạo phần tử Room
                const roomInfo = document.createElement('p')
                roomInfo.textContent = `Room: ${rooms}`
                const checkIn = document.createElement('p')
                checkIn.textContent = `Check in: ${checkin}`
                const checkOut = document.createElement('p')
                checkOut.textContent = `Check out: ${checkout}`
                // Tạo input giá
                const priceInput = document.createElement('p')
                priceInput.textContent = `Price: ${price} VNĐ`

                // Tạo nút Đặt ngay
                const bookButton = document.createElement('a')
                bookButton.classList.add('select-button', 'book-now')
                bookButton.textContent = 'Booking now'
                bookButton.style.right = '40px'
                bookButton.style.position = 'absolute'
                bookButton.setAttribute('href', `order.html?amount=${price}&order_id=${idBooking}`)
                // Tạo nút Quay lại
                const backButton = document.createElement('a')
                backButton.classList.add('select-button', 'back')
                backButton.textContent = 'Back'

                // Thêm các phần tử vào messageBox
                messageBox.appendChild(heading)
                messageBox.appendChild(guestInfo)
                messageBox.appendChild(roomInfo)
                messageBox.appendChild(checkIn)
                messageBox.appendChild(checkOut)
                messageBox.appendChild(priceInput)
                messageBox.appendChild(bookButton)
                messageBox.appendChild(backButton)

                // Thêm messageBox vào overlay
                overlay.appendChild(messageBox)

                // Thêm overlay vào body của trang
                document.body.appendChild(overlay)
                let messageOverlay = document.querySelector('.message-overlay')
                let back = document.querySelector('.back')
                back.addEventListener('click', async () => {
                  messageOverlay.classList.remove('active')
                  await fetch(`https://api-gateway-5p4v.onrender.com/api/bookings/${idBooking}`, {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  })
                })
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Phòng bạn muốn không có sẵn trong những ngày này',
                })
                console.log('oops :>> ')
              }
            }
          })
      })
      .catch((error) => console.log(error))
    return rooms
  } catch (error) {
    console.error('Error fetching rooms:', error)
  }
})
function convertToISO8601(dateString) {
  // Tách chuỗi theo dấu '-'
  const [day, month, year] = dateString.split('-')

  // Tạo chuỗi ISO 8601 theo định dạng yyyy-mm-dd
  const isoDateString = `${year}-${month}-${day}T00:00:00Z`

  return isoDateString
}
function isRoomAvailable(room, checkInDate, checkOutDate) {
  // Kiểm tra lịch đặt
  const bookings = room.checkdate || []
  return !bookings.some((booking) => {
    const bookingCheckIn = new Date(booking.checkInDate)
    const bookingCheckOut = new Date(booking.checkOutDate)
    return bookingCheckIn <= new Date(checkOutDate) && bookingCheckOut >= new Date(checkInDate)
  })
}
function calculateDaysBetween(checkIn, checkOut) {
  // Ngày cụ thể truyền vào dưới dạng chuỗi
  let checkin = new Date(checkIn)

  // Ngày hiện tại
  let checkout = new Date(checkOut)

  // Tính sự khác biệt về thời gian (milliseconds)
  let timeDifference = checkout - checkin

  // Chuyển đổi sự khác biệt thời gian từ milliseconds thành số ngày
  let dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

  return dayDifference
}
