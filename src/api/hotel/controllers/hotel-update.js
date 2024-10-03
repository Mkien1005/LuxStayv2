module.exports = {
  async updateRoomCount(ctx) {
    const { hotelId, event } = ctx.request.body;
    console.log(hotelId, event);
    if (event === "room-added") {
      if (!hotelId) {
        return ctx.badRequest("Hotel ID is required");
      }

      // Lấy thông tin khách sạn và cập nhật số lượng phòng
      const hotel = await strapi.db.query("api::hotel.hotel").findOne({
        where: { id: hotelId },
      });

      if (!hotel) {
        return ctx.notFound("Hotel not found");
      }

      // Tăng số lượng phòng của khách sạn
      const updatedHotel = await strapi.db.query("api::hotel.hotel").update({
        where: { id: hotelId },
        data: { rooms: parseInt(hotel.rooms) + 1 },
      });

      return ctx.send(updatedHotel);
    }
    if (event === "room-removed") {
      if (!hotelId) {
        return ctx.badRequest("Hotel ID is required");
      }
      const hotel = await strapi.db.query("api::hotel.hotel").findOne({
        where: { id: hotelId },
      });

      if (!hotel) {
        return ctx.notFound("Hotel not found");
      }

      const updatedHotel = await strapi.db.query("api::hotel.hotel").update({
        where: { id: hotelId },
        data: { rooms: parseInt(hotel.rooms) - 1 },
      });

      return ctx.send(updatedHotel);
    }
    return ctx.badRequest("Invalid event");
  },
};
