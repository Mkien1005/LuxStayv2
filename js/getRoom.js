function getRoomIdFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get('room_id') // Lấy giá trị của param room_id
}
// Hàm fetch dữ liệu room và review
async function fetchRoomAndReviews() {
  const roomId = getRoomIdFromUrl() // Lấy room_id từ URL
  if (!roomId) {
    console.error('Room ID không hợp lệ.')
    return
  }
  fetch('https://api-gateway-5p4v.onrender.com/api/reviews/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  try {
    // Fetch room theo room_id
    const roomResponse = await fetch(`https://api-gateway-5p4v.onrender.com/api/rooms/${roomId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!roomResponse.ok) {
      throw new Error('Không tìm thấy room.')
    }
    const roomData = await roomResponse.json()
    console.log('Room Data:', roomData) // In thông tin room ra console

    // Fetch reviews liên quan đến room_id
    const reviewsResponse = await fetch(`https://api-gateway-5p4v.onrender.com/api/reviews/?filters[room_id][$eq]=${roomId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!reviewsResponse.ok) {
      throw new Error('Không tìm thấy review cho room.')
    }
    const reviewsData = await reviewsResponse.json()
    console.log('Reviews Data:', reviewsData) // In thông tin reviews ra console

    // Xử lý hiển thị room và review ở đây
    displayRoomData(roomData)
    displayReviews(reviewsData.data) // Assuming reviews are inside `data` field
  } catch (error) {
    console.error('Lỗi khi fetch room hoặc reviews:', error)
  }
}
fetchRoomAndReviews()

function displayRoomData(roomData) {}

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
  fetch(`https://api-gateway-5p4v.onrender.com/api/reviews/${idReview}`, {
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
  fetch(`https://api-gateway-5p4v.onrender.com/api/reviews/${idReview}`, {
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
let currentSlideIndex = 0
const slides = document.querySelectorAll('.slides img')
const dots = document.querySelectorAll('.dot')

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

function changeSlide(step) {
  showSlide(currentSlideIndex + step)
}

function currentSlide(index) {
  showSlide(index - 1) // Chuyển từ vị trí hiển thị (1-based) sang chỉ số (0-based)
}

// Khởi tạo trạng thái ban đầu
showSlide(currentSlideIndex)

const slide = document.querySelector('.slideshow-container')
const prev = document.querySelector('.prev')
const next = document.querySelector('.next')
slide.addEventListener('mouseover', () => {
  prev.style.display = 'inline'
  next.style.display = 'inline'
})
slide.addEventListener('mouseout', () => {
  prev.style.display = 'none'
  next.style.display = 'none'
})
