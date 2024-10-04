const axios = require("axios");
module.exports = {
  async afterUpdate(event) {
    let status = event.result.status;
    if (status === "Đã thanh toán") {
      let roomId = event.result.room_id;
      let checkIn = event.result.check_in;
      let checkOut = event.result.check_out;

      let room = await axios.request({
        method: "GET",
        url: `https://room-service-q9pa.onrender.com/api/rooms/${roomId}`,
      });
      let check_in_date = room.data.attributes.check_in_date;
      check_in_date = [
        ...check_in_date,
        {
          check_in: checkIn,
          check_out: checkOut,
        },
      ];

      await axios.request({
        method: "PUT",
        url: `https://room-service-q9pa.onrender.com/api/rooms/${roomId}`,
        data: {
          data: {
            check_in_date: check_in_date,
          },
        },
      });
      console.log("Đã cập nhật trạng thái phòng thành công");
    }
  },
};
