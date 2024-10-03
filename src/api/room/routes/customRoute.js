module.exports = {
  routes: [
    {
      method: "GET",
      path: "/rooms/min-max-price/:hotelId",
      handler: "room.getMinMaxPrice",
      config: {
        auth: false,
      },
    },
  ],
};
