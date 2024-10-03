const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::room.room", ({ strapi }) => ({
  async getMinMaxPrice(ctx) {
    const { hotelId } = ctx.params;

    // Kiểm tra nếu hotelId không được cung cấp
    if (!hotelId) {
      return ctx.badRequest("hotelId is required");
    }

    try {
      // Query để lấy min và max price theo hotelId
      const rooms = await strapi.db.query("api::room.room").findMany({
        where: { hotel_id: hotelId }, // assuming 'hotel' is a relation field
        select: ["price"],
      });

      // Nếu không có phòng nào
      if (rooms === 0) {
        return ctx.send({ minPrice: 0, maxPrice: 0 });
      }

      // Tính toán min và max giá
      const prices = rooms.map((room) => room.price.value);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      // Trả về kết quả
      return ctx.send({ minPrice, maxPrice });
    } catch (error) {
      // Xử lý lỗi
      ctx.internalServerError("An error occurred while fetching room prices");
    }
  },
}));
