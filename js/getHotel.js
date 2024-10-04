const hotelId = getHotelIdFromUrl()
fetch(`https://luxstayv2.onrender.com/api/hotels/${hotelId}`)
  .then((response) => response.json())
  .then((data) => {
    renderHotel(data.data)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
function getHotelIdFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return parseInt(params.get('hotel_id'))
}
function renderHotel(hotel) {
  console.log('hotel', hotel)
  const hotelImage = document.querySelector('.hotel-image')
  hotelImage.src = hotel.attributes.images[0].url
  const hotelName = document.querySelector('#hotel-name')
  hotelName.textContent = hotel.attributes.name
  const hotelStar = document.querySelector('.hotel-star')
  let star = parseInt(hotel.attributes.star)
  hotelStar.innerHTML = '<i class="fa fa-star"></i>'.repeat(star) + '<i class="fa fa-star-o"></i>'.repeat(5 - star)
  const hotelAddress = document.querySelector('#hotel-address')
  hotelAddress.textContent = hotel.attributes.address
  const hotelDescription = document.querySelector('#hotel-description')
  hotelDescription.textContent = hotel.attributes.comment
  const hotelEmail = document.querySelector('#hotel-email')
  hotelEmail.textContent = hotel.attributes.email
  const hotelQuantity = document.querySelector('#hotel-quantity')
  hotelQuantity.textContent = hotel.attributes.rooms
  const hotelPhone = document.querySelector('#hotel-phone')
  hotelPhone.textContent = hotel.attributes.phone_number
  fetch(`https://luxstayv2.onrender.com/api/rooms/min-max-price/${hotelId}`)
    .then((response) => response.json())
    .then((data) => {
      const minPrice = data.minPrice
      const maxPrice = data.maxPrice
      const minPriceElement = document.querySelector('#min-price')
      const maxPriceElement = document.querySelector('#max-price')
      minPriceElement.textContent = minPrice
      maxPriceElement.textContent = maxPrice
    })
}
// Hàm fetch dữ liệu room và review
async function fetchRoomAndReviews(hotelId) {
  if (!hotelId) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Không tìm thấy khách sạn này!',
    })
    return
  }
  try {
    // Fetch room theo room_id
    const roomResponse = await fetch(`https://luxstayv2.onrender.com/api/rooms/?filters[hotel_id][$eq]=${hotelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!roomResponse.ok) {
      throw new Error('Không tìm thấy phòng hoặc khách sạn này chưa có phòng.')
    }
    const roomData = await roomResponse.json()
    displayRoomData(roomData.data)
    initOverlay()
    // Fetch reviews liên quan đến room_id
    const reviewsResponse = await fetch(`https://luxstayv2.onrender.com/api/reviews/?filters[hotel_id][$eq]=${hotelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!reviewsResponse.ok) {
      console.log('Không tìm thấy bài đánh giá nào hoặc chưa có người đánh giá.')
    }
    const reviewsData = await reviewsResponse.json()
    console.log('Reviews Data:', reviewsData) // In thông tin reviews ra console

    // Xử lý hiển thị room và review ở đây
    displayReviews(reviewsData.data) // Assuming reviews are inside `data` field
  } catch (error) {
    console.error('Lỗi khi fetch room hoặc reviews:', error)
  }
}
fetchRoomAndReviews(hotelId)

function displayRoomData(roomData) {
  var roomList = document.querySelector('.list-rooms')
  roomList.innerHTML = '' // Clear previous content
  roomData.forEach((data) => {
    let images = Object.values(data.attributes.images)
    let roomCard = document.createElement('div')
    roomCard.className = 'room-card'
    roomCard.innerHTML = `
      <div class="room-name">${data.attributes.name}</div>
      <div class="room-content">
        <div class="slideshow-container">
          <div class="slides">
            ${images.map((image) => `<img src="${image}" alt="Image 1" class="active" style="transform: translateX(0px);">`).join('')}
          </div>

          <!-- Navigation buttons -->
          <a class="prev" style="display: none;">❮</a>
          <a class="next" style="display: none;">❯</a>

          <!-- Dots for slide position -->
          <div class="dots">
            ${images.map((image, index) => `<span class="dot active" onclick="currentSlide(${index + 1})"></span>`).join('')}
          </div>
        </div>

        <table id="${data.id}" class="room-table table table-bordered mx-2">
          <thead class="table-warning">
            <tr>
              <th scope="col">Room selection</th>
              <th scope="col">Guest</th>
              <th scope="col">Price/Room/Night</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="3">
                <div class="room-title">${data.attributes.type} Room</div>
                <div class="room-option">${data.attributes.description}</div>
              </td>
              ${
                data.attributes.capacity === 'Single'
                  ? `<td rowspan="3" class="text-center"><i class="fa fa-user"></i></td>`
                  : data.attributes.capacity === 'Couple'
                  ? `<td rowspan="3" class="text-center"><i class="fa fa-user"></i> <i class="fa fa-user"></i></td>`
                  : `<td rowspan="3" class="text-center"><i class="fa fa-user"></i> <i class="fa fa-user"></i> <i class="fa fa-user"></i><i class="fa fa-user"></i></td>`
              }

              <td rowspan="3">
                <div class="room-price">
                  <span class="original-price" style="display: block">1000 VND</span>
                  ${data.attributes.price} VND
                </div>
              </td>
              <td rowspan="3" class="text-right">
                <a class="select-button">Select</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`
    roomList.appendChild(roomCard)
    let slideContainer = roomCard.querySelector('.slideshow-container')
    console.log('slideContainer', slideContainer)
    initSlide(slideContainer)
  })
}

function displayReviews(reviewsData) {
  reviewsData.forEach((data) => {
    console.log(data)
    const review = data.attributes
    const idReview = data.id
    const createDate = formatDate(review.createdAt)
    // Tạo phần tử đánh giá mới
    const reviewItem = document.createElement('div')
    reviewItem.className = 'review-item'
    reviewItem.innerHTML = `
                <div class="ri-pic">
                  <img src="img/blog/blog-details/avatar/avatar-${Math.floor(Math.random() * 3) + 1}.jpg" alt="" />
                </div>
                <div class="ri-text">
                  <span>${createDate}</span>
                  <div class="rating">
                    ${'<i class="fa fa-star"></i>'.repeat(review.rating)}
                    ${'<i class="fa fa-star-o"></i>'.repeat(5 - review.rating)}
                  </div>
                  <div class="like" style="
                  position: absolute;
                  right: 25px; cursor: pointer;">
                  <div class="idReview" style="display:none">${idReview}</div>
                  <i class="fa fa-thumbs-o-up likeIcon"  aria-hidden="true">(<span class="likeCount">0</span>)</i>
                  </div>
                  <div class="more" style="
                    position: absolute;
                    right: 0;
                    cursor: pointer;">
                      <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                  </div>
                  <h5>Người dùng</h5>
                  <p>${review.comment}</p>
                  <div class="review-images">
                    ${review.images.map((url) => `<img src="http://localhost:1337${url}" style="width: 175px" alt="Review Image" />`).join('')}
                  </div>
                </div>
              `

    document.querySelector('.rd-reviews').appendChild(reviewItem)
    addEventBtn()
  })
}
function formatDate(dateString) {
  const date = new Date(dateString)

  // Định dạng ngày tháng năm theo kiểu ngày/tháng/năm
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Tháng bắt đầu từ 0
  const year = date.getFullYear()

  // Định dạng giờ phút giây
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}
function addEventBtn() {
  const likeButtons = document.querySelectorAll('.like')
  if (likeButtons) {
    likeButtons.forEach((likeButton) => {
      likeButton.addEventListener('click', handleLikeClick)
    })
  }

  const likedButtons = document.querySelectorAll('.liked')
  if (likedButtons) {
    likedButtons.forEach((likedButton) => {
      likedButton.addEventListener('click', handleUnlikeClick)
    })
  }
}

function handleLikeClick(event) {
  like(event.currentTarget)
}

function handleUnlikeClick(event) {
  unlike(event.currentTarget)
}

function like(likeButton) {
  const parentDiv = likeButton.parentElement
  const idReview = likeButton.querySelector('.idReview').innerHTML
  const currentLikeCount = parentDiv.querySelector('.likeCount').innerHTML
  const newLikeCount = parseInt(currentLikeCount) + 1

  // Cập nhật giao diện ngay lập tức
  const likeIcon = parentDiv.querySelector('.likeIcon')
  likeIcon.classList.remove('fa-thumbs-o-up')
  likeIcon.classList.add('fa-thumbs-up')
  parentDiv.querySelector('.likeCount').innerHTML = newLikeCount

  // Gửi yêu cầu fetch để cập nhật ở phía server
  fetch(`https://luxstayv2.onrender.com/api/reviews/${idReview}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        likes: newLikeCount,
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      likeButton.classList.remove('like')
      likeButton.classList.add('liked')

      // Loại bỏ sự kiện like và thêm sự kiện unlike
      likeButton.removeEventListener('click', handleLikeClick)
      likeButton.addEventListener('click', handleUnlikeClick)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

function unlike(likedButton) {
  const parentDiv = likedButton.parentElement
  const idReview = likedButton.querySelector('.idReview').innerHTML
  const currentLikeCount = parentDiv.querySelector('.likeCount').innerHTML
  const newLikeCount = parseInt(currentLikeCount) - 1

  // Cập nhật giao diện ngay lập tức
  const likeIcon = parentDiv.querySelector('.likeIcon')
  likeIcon.classList.remove('fa-thumbs-up')
  likeIcon.classList.add('fa-thumbs-o-up')
  parentDiv.querySelector('.likeCount').innerHTML = newLikeCount

  // Gửi yêu cầu fetch để cập nhật ở phía server
  fetch(`https://luxstayv2.onrender.com/api/reviews/${idReview}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        likes: newLikeCount,
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      likedButton.classList.remove('liked')
      likedButton.classList.add('like')

      // Loại bỏ sự kiện unlike và thêm sự kiện like
      likedButton.removeEventListener('click', handleUnlikeClick)
      likedButton.addEventListener('click', handleLikeClick)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

function initSlide(slideContainer) {
  let currentSlideIndex = 0
  const slides = slideContainer.querySelectorAll('.slides img')
  const dots = slideContainer.querySelectorAll('.dot')
  // Khởi tạo trạng thái ban đầu
  showSlide(currentSlideIndex)
  function showSlide(index) {
    // Xử lý chỉ số trượt
    if (index >= slides.length) {
      currentSlideIndex = 0
    } else if (index < 0) {
      currentSlideIndex = slides.length - 1
    } else {
      currentSlideIndex = index
    }

    // Ẩn tất cả các ảnh
    slides.forEach((slide, idx) => {
      slide.classList.remove('active')
      slide.style.transform = 'translateX(0)' // Reset animation
    })

    // Hiển thị ảnh hiện tại
    slides[currentSlideIndex].classList.add('active')

    // Cập nhật dấu chấm
    dots.forEach((dot) => dot.classList.remove('active'))
    dots[currentSlideIndex].classList.add('active')
  }
  const prev = slideContainer.querySelector('.prev')
  const next = slideContainer.querySelector('.next')
  slideContainer.addEventListener('mouseover', () => {
    prev.style.display = 'inline'
    next.style.display = 'inline'
  })
  slideContainer.addEventListener('mouseout', () => {
    prev.style.display = 'none'
    next.style.display = 'none'
  })

  function changeSlide(step) {
    showSlide(currentSlideIndex + step)
  }
  prev.addEventListener('click', () => {
    changeSlide(-1)
  })
  next.addEventListener('click', () => {
    changeSlide(1)
  })
}
function initOverlay() {
  var listRooms = document.querySelectorAll('.room-table') // Lấy tất cả các phòng
  var overlay = document.querySelector('.booking-overlay') // Overlay để hiển thị khi nhấp vào phòng
  var closeBtn = document.querySelector('.close') // Nút đóng overlay
  var roomBooking = document.querySelector('.room-booking') // Phần tử .room-booking để đặt ID
  // Lặp qua từng phòng
  listRooms.forEach((card) => {
    card.addEventListener('click', () => {
      overlay.classList.add('active') // Hiển thị overlay
      roomBooking.id = card.id
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
    overlay.classList.remove('active')
    const id = roomBooking.id
    try {
      fetch(`https://luxstayv2.onrender.com/api/rooms/${id}`)
        .then((response) => response.json())
        .then(async (data) => {
          const room = data.data.attributes
          let day = calculateDaysBetween(checkInDate, checkOutDate)
          var price = room.price * day
          if (rooms > 1) {
            price = price * rooms
          }
          console.log('price', price)
          await fetch('https://luxstayv2.onrender.com/api/bookings/', {
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
                if (isRoomAvailable(room.check_in_date, checkInDate, checkOutDate)) {
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
                    await fetch(`https://luxstayv2.onrender.com/api/bookings/${idBooking}`, {
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
  function isRoomAvailable(bookingDates, newCheckIn, newCheckOut) {
    // Chuyển đổi ngày mới từ chuỗi sang đối tượng Date
    const newCheckInDate = new Date(newCheckIn)
    const newCheckOutDate = new Date(newCheckOut)

    // Kiểm tra từng booking date trong mảng
    for (let booking of bookingDates) {
      const bookedCheckIn = new Date(booking.check_in)
      const bookedCheckOut = new Date(booking.check_out)

      // Kiểm tra nếu khoảng thời gian mới trùng với khoảng đã đặt
      if (newCheckInDate < bookedCheckOut && newCheckOutDate > bookedCheckIn) {
        return false // Không khả dụng
      }
    }

    return true // Phòng khả dụng
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
}
