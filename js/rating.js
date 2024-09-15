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

      return fetch('http://localhost:1337/api/upload', {
        method: 'POST',
        headers: {
          Authorization:
            'Bearer dcff3e40b5780440d420a4ad97237339c846877bca7753757716917c64f8d991f8de557dd1392ce8e92514a7fa48a53280916c7e4e8f67e8a28af01a3d73f339acf3e9308e72799a51dec3889779354273231c6288696f8a563e69e2c7dd750e801100ecba0c96ccd2646f526e68f85ed57e7cd555063805bf105b310558dfa9',
        },
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
          content: reviewText,
          rating: selectedRating,
          user_id: '1',
          room_id: '1',
          status: 'active',
          images: imageUrls.filter((url) => url !== null), // Lọc các URL hợp lệ
          likes: 0,
        }
        // Gửi dữ liệu đánh giá
        fetch('http://localhost:1337/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer e287a7c877be306725b4d0956d1b78794f5879ccd971b7a150955bd4c71d4c6f1276afcedd4e92c450245d8662b55eb710ad30a6a4ec3441d9f8d20f64fb68b08e07fb68a5cd984e951f453246feb0287d3f7aec4954fc6e27e5eb2e3d1f26415e07316b83c884e7a830f0d14f753b170ce8e331eafed6f85440fb874ff6012a',
          },
          body: JSON.stringify({ data }),
        })
          .then((response) => response.json())
          .then((data) => {
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
    fetch(`http://localhost:1337/api/reviews/${idReview}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer 74241ebe2ee2702a45ea08c46809ad5c6a739136dadc984431e41f7d61c5c8da294ded0fa3e1829228f3835a5a5a09b4765aa36b715d8b7730a23b88c25408eb7317592e93f97456c93e8dbad2cef32b70656891a95cc4135d2ffcda890077c3816af136bb55c910e8bfc823d99e182cef81da317e84aeea6df9b97b8ef653a2`,
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
    fetch(`http://localhost:1337/api/reviews/${idReview}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer 74241ebe2ee2702a45ea08c46809ad5c6a739136dadc984431e41f7d61c5c8da294ded0fa3e1829228f3835a5a5a09b4765aa36b715d8b7730a23b88c25408eb7317592e93f97456c93e8dbad2cef32b70656891a95cc4135d2ffcda890077c3816af136bb55c910e8bfc823d99e182cef81da317e84aeea6df9b97b8ef653a2`,
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
