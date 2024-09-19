document.addEventListener('DOMContentLoaded', function () {
  let selectedRating = 0
  let filesArray = [] // Mảng để lưu trữ các file đã chọn

  // Cập nhật giao diện sao
  function updateStarDisplay(rating) {
    const stars = document.querySelectorAll('.rating .star-rating')
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('fa-star')
        star.classList.remove('fa-star-o')
      } else {
        star.classList.add('fa-star-o')
        star.classList.remove('fa-star')
      }
    })
  }

  // Xử lý khi người dùng chọn sao
  function setupStarRating() {
    const stars = document.querySelectorAll('.rating .star-rating')
    stars.forEach((star, index) => {
      star.addEventListener('click', function () {
        selectedRating = index + 1
        updateStarDisplay(selectedRating)
      })

      star.addEventListener('mouseover', function () {
        updateStarDisplay(index + 1)
      })

      star.addEventListener('mouseout', function () {
        updateStarDisplay(selectedRating)
      })
    })
  }

  // Kiểm tra và cập nhật phần tử đánh giá
  function checkReviewItem() {
    const reviewContent = document.querySelector('.rd-reviews')
    const reviewItems = reviewContent.querySelectorAll('.review-item')

    // Tìm phần tử "No reviews yet" nếu có
    const noReviewItem = reviewContent.querySelector('.review-item.no-reviews')

    // Nếu không có đánh giá nào
    if (reviewItems.length === 0) {
      if (!noReviewItem) {
        const newNoReviewItem = document.createElement('div')
        newNoReviewItem.className = 'review-item no-reviews' // Thêm lớp no-reviews
        newNoReviewItem.innerHTML = '<p>No reviews yet</p>'
        reviewContent.appendChild(newNoReviewItem)
      }
    } else {
      // Nếu có đánh giá, xóa phần tử "No reviews yet" nếu có
      if (noReviewItem) {
        noReviewItem.remove()
      }
    }
  }

  // Xử lý khi nhấn nút uploadButton
  document.getElementById('uploadButton').addEventListener('click', function (e) {
    e.preventDefault()
    document.getElementById('fileInput').click()
  })

  // Hiển thị ảnh đã chọn trong preview
  function displayPreview() {
    const previewContainer = document.getElementById('previewContainer')
    previewContainer.innerHTML = '' // Xóa hình ảnh cũ trước khi thêm hình ảnh mới

    filesArray.forEach((file) => {
      const reader = new FileReader()

      reader.onload = function (e) {
        const div = document.createElement('div')
        div.style.position = 'relative'

        const img = document.createElement('img')
        img.src = e.target.result
        img.alt = 'Preview'
        img.style.width = '100px' // Kích thước ảnh preview

        const removeButton = document.createElement('button')
        removeButton.textContent = 'X'
        removeButton.className = 'removeImageButton'
        removeButton.onclick = function () {
          filesArray = filesArray.filter((f) => f !== file) // Xóa file khỏi mảng
          displayPreview() // Cập nhật lại preview
        }

        div.appendChild(img)
        div.appendChild(removeButton)
        previewContainer.appendChild(div)
      }

      reader.readAsDataURL(file)
    })
  }

  // Tải lên các tệp ảnh
  function uploadFiles(files) {
    const uploadPromises = Array.from(files).map((file) => {
      const formData = new FormData()
      formData.append('files', file)

      return fetch('https://review-services.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => data[0].url) // Giả sử API trả về mảng các URL của ảnh
        .catch((error) => {
          console.error('Upload Error:', error)
          return null
        })
    })

    return Promise.all(uploadPromises)
  }

  // Xử lý khi người dùng chọn file
  document.getElementById('fileInput').addEventListener('change', function () {
    const newFiles = Array.from(this.files)
    filesArray = [...filesArray, ...newFiles] // Thêm file mới vào mảng
    displayPreview() // Cập nhật preview với file mới
  })

  // Xử lý khi người dùng gửi đánh giá
  function setupFormSubmission() {
    const form = document.querySelector('.ra-form')
    form.addEventListener('submit', async function (event) {
      event.preventDefault()

      const reviewText = form.querySelector('textarea').value.trim()

      if (selectedRating > 0 && reviewText) {
        // Tải ảnh lên trước
        const imageUrls = await uploadFiles(filesArray)

        // Tạo đối tượng dữ liệu
        const data = {
          comment: reviewText,
          rating: selectedRating,
          user_id: '1',
          room_id: '1',
          status: 'active',
          images: imageUrls.filter((url) => url !== null), // Lọc các URL hợp lệ
          likes: 0,
        }
        // Gửi dữ liệu đánh giá
        fetch('https://mkienfs.id.vn/api/reviews/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            const comment = data.data
            const idReview = data.data.id
            const createDate = formatDate(comment.attributes.createdAt)
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
                  ${'<i class="fa fa-star"></i>'.repeat(selectedRating)}
                  ${'<i class="fa fa-star-o"></i>'.repeat(5 - selectedRating)}
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
                <p>${reviewText}</p>
                <div class="review-images">
                  ${imageUrls.map((url) => `<img src="http://localhost:1337${url}" style="width: 175px" alt="Review Image" />`).join('')}
                </div>
              </div>
            `

            document.querySelector('.rd-reviews').appendChild(reviewItem)
            form.reset()
            document.getElementById('previewContainer').innerHTML = ''
            filesArray = [] // Xóa các file đã chọn
            selectedRating = 0
            updateStarDisplay(0)
            checkReviewItem()
            addEventBtn()
          })
          .catch((error) => console.error('Error:', error))
      } else {
        alert('Vui lòng nhập đánh giá và chọn điểm trước khi gửi.')
      }
    })
  }

  // Khởi tạo các sự kiện và chức năng
  setupStarRating()
  checkReviewItem()
  setupFormSubmission()
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
    fetch(`https://mkienfs.id.vn/api/reviews/${idReview}`, {
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
    fetch(`https://mkienfs.id.vn/api/reviews/${idReview}`, {
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
})
