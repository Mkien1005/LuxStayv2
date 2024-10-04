const axios = require("axios");

module.exports = {
  async afterCreate(event) {
    console.log("afterCreate lifecycle triggered for Room ID:", event);

    try {
      await axios.post("https://hotel-service-ac92.onrender.com/api/events", {
        event: "room-added",
        roomId: event.result.id,
        hotelId: event.result.hotel_id,
      });
      console.log("Room added event sent to Hotel Service");
    } catch (error) {
      console.error("Error sending room-added event to Hotel Service:", error);
    }
  },

  async afterDelete(event) {
    console.log(
      "afterDelete lifecycle triggered for Room ID:",
      event.result.id
    );

    try {
      await axios.post("https://hotel-service-ac92.onrender.com/api/events", {
        event: "room-removed",
        roomId: event.result.id,
        hotelId: event.result.hotel_id,
      });
      console.log("Room removed event sent to Hotel Service");
    } catch (error) {
      console.error(
        "Error sending room-removed event to Hotel Service:",
        error
      );
    }
  },
};
