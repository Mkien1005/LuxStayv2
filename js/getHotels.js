//get pagination in url
const url = new URL(window.location.href)
let pagination = url.searchParams.get('page')
var page = parseInt(pagination)
if (isNaN(page)) {
  page = 1
}
const itemsPerPage = 6
fetch('https://luxstayv2.onrender.com/api/hotels')
  .then((response) => response.json())
  .then((data) => {
    if (page) {
      const hotelList = document.getElementById('hotel-list')
      hotelList.innerHTML = ''
      // Tính toán vị trí bắt đầu và kết thúc
      const start = (page - 1) * itemsPerPage
      const end = start + itemsPerPage

      // Lấy danh sách khách sạn theo trang
      const paginatedHotels = data.data.slice(start, end)
      paginatedHotels.forEach(async (hotel) => await renderHotel(hotel))
      if (hotelList.innerHTML === '') {
        hotelList.innerHTML = '<p>Không tìm thấy khách sạn nào!</p>'
      }
      const col = document.createElement('div')
      col.className = 'col-lg-12'
      const pagination = document.createElement('div')
      pagination.className = 'room-pagination'
      if (page == 1) {
        pagination.innerHTML = `
          <a href="/hotels.html?page=1">${page}</a>
          <a href="/hotels.html?page=${page + 1}">Next</a>
      `
      } else if (page == data.meta.total_pages) {
        pagination.innerHTML = `
          <a href="/hotels.html?page=${page - 1}">Previous</a>
          <a href="/hotels.html?page=${page}">${page}</a>
        `
      } else {
        pagination.innerHTML = `
          <a href="/hotels.html?page=${page - 1}">Previous</a>
          <a href="/hotels.html?page=${page}">${page}</a>
          <a href="/hotels.html?page=${page + 1}">Next</a>
        `
      }
      col.appendChild(pagination)
      hotelList.appendChild(col)
    }
  })
  .catch((error) => {
    const hotelList = document.getElementById('hotel-list')
    hotelList.innerHTML = '<p>Không tìm thấy khách sạn nào!</p>'
  })
async function renderHotel(hotel) {
  const hotelList = document.getElementById('hotel-list')
  // Tạo HTML cho từng khách sạn
  const hotelHTML = `
    <div class="col-lg-4 col-md-6">
        <div class="room-item">
          <img src="${hotel.attributes.images[0].url}" alt="${hotel.attributes.name}" />
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
                  <td class="r-o">Convenient:</td>
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
