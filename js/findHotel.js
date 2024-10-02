function searchHotel() {
  const searchValue = document.getElementById('search-hotel').value

  // Kiểm tra nếu người dùng nhập gì đó
  if (searchValue) {
    // Tạo query cho API
    const query = `https://api-gateway-5p4v.onrender.com/api/hotels/?filters[$or][0][name][$contains]=${searchValue}&filters[$or][1][address][$contains]=${searchValue}`
    const hotelList = document.getElementById('hotel-list')
    hotelList.innerHTML = ''
    // Gọi API
    fetch(query)
      .then((response) => response.json())
      .then((data) => {
        data.data.forEach((hotel) => renderHotel(hotel))
        if (hotelList.innerHTML === '') {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Không tìm thấy khách sạn nào!',
          })
          hotelList.innerHTML = '<p>Không tìm thấy khách sạn nào!</p>'
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Internal Server Error!',
        })
      })
  } else {
    alert('Vui lòng nhập tên hoặc địa chỉ khách sạn')
  }
}
function renderHotel(hotel) {
  const hotelList = document.getElementById('hotel-list')

  // Tạo HTML cho từng khách sạn
  const hotelHTML = `
  <div class="col-lg-4 col-md-6">
      <div class="room-item">
        <img src="img/room/room-1.jpg" alt="${hotel.attributes.name}" />
        <div class="ri-text">
          <h4>${hotel.attributes.name}</h4>
          <h3>${hotel.attributes.star} stars<span>/Pernight</span></h3>
          <table>
            <tbody>
              <tr>
                <td class="r-o">Address:</td>
                <td>${hotel.attributes.address}</td>
              </tr>
              <tr>
                <td class="r-o">Rooms:</td>
                <td>${hotel.attributes.rooms}</td>
              </tr>
              <tr>
                <td class="r-o">Comments:</td>
                <td>${hotel.attributes.comment}</td>
              </tr>
            </tbody>
          </table>
          <a href="/room-details.html?hotel_id=${hotel.id}" class="primary-btn">More Details</a>
        </div>
      </div>
    </div>
    `
  
  // Thêm HTML vừa tạo vào div
  hotelList.innerHTML += hotelHTML
}
