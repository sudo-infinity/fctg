const { response } = require("../app");
const getDistanceBetweenAirports = require("../utils");
const axios = require("axios");

const flightsDataUrl =
  "https://gist.githubusercontent.com/bgdavidx/132a9e3b9c70897bc07cfa5ca25747be/raw/8dbbe1db38087fad4a8c8ade48e741d6fad8c872/gistfile1.txt";

exports.getFilghts = async (req, res, next) => {
  const { flightMinTime, flightMaxTime, carrier, acceptableDuration } =
    req.query;

  const { data } = await axios.get(flightsDataUrl);

  const distance = await getDistanceBetweenAirports();

  const filteredFlights = data.filter(
    (flight) =>
      flight.departureTime >= flightMinTIme &&
      flight.arrivalTime <= flightMaxTIme &&
      acceptableDuration <= distance
  );

  /**
   * Todo
   *
   *  1. Iterate again to calculate the score according the formula
   *  2. Sort the records on score in ascending order
   */

  console.log(response.data);

  // res.json({ flightMinTIme, flightMinTIme, carrier, acceptableDuration });
  res.send("send a json here");
};
