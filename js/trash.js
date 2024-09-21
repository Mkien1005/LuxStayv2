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
