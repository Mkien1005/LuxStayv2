fetch('https://api-gateway-5p4v.onrender.com/api/hotels',{
    method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
    }
})
  .then((response) => response.json())
  .then((data) => {
    const hotelList = document.getElementById('hotel-list')
    console.log('first', data)
    data.data.forEach((hotel) => renderHotel(hotel))
    if (hotelList.innerHTML === '') {
        hotelList.innerHTML = '<p>Không tìm thấy khách sạn nào!</p>'
    }
  })
  .catch((error) => {
    const hotelList = document.getElementById('hotel-list')
    hotelList.innerHTML = '<p>Không tìm thấy khách sạn nào!</p>'
    
  })
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
  