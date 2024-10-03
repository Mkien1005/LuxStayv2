module.exports = {
  routes: [
    {
      method: "GET",
      path: "/rooms/min-max-price/:hotelId",
      handler: "room2.getMinMaxPrice",
      config: {
        auth: false,
      },
    },
  ],
};
