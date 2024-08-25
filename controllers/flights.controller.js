const { getDistanceBetweenAirports } = require("../utils");
const axios = require("axios");

const flightsDataUrl = // Improvement Todo: move it to env file
  "https://gist.githubusercontent.com/bgdavidx/132a9e3b9c70897bc07cfa5ca25747be/raw/8dbbe1db38087fad4a8c8ade48e741d6fad8c872/gistfile1.txt";

exports.getFilghts = async (req, res, next) => {
  try {
    const {
      minAcceptableDepartureTime,
      maxAcceptableDepartureTime,
      prefferedCarrier,
      maxAcceptableDuration,
    } = req.query; // Improvement Todo : Handle proper req params validation using class validator to ensure params are comming in correct format

    if (
      !minAcceptableDepartureTime ||
      !maxAcceptableDepartureTime ||
      !prefferedCarrier ||
      !maxAcceptableDuration
    ) {
      return res.status(400).send("Incomplete params provided");
    }

    const { data } = await axios.get(flightsDataUrl);

    const filteredFlights = data.filter((flight) => {
      const durationInMilliSeconds =
        new Date(flight.arrivalTime).getTime() -
        new Date(flight.departureTime).getTime();

      const durationInHours = durationInMilliSeconds / (60 * 60 * 1000);
      flight.calculatedDuration = durationInHours;

      return (
        new Date(flight.departureTime) >=
          new Date(minAcceptableDepartureTime) &&
        new Date(flight.departureTime) <=
          new Date(maxAcceptableDepartureTime) &&
        new Date(flight.calculatedDuration) <= new Date(maxAcceptableDuration)
      );
    });

    const scoredFlights = [];

    for (const item of filteredFlights) {
      const carrierPreferenceScore =
        item.carrier === String(prefferedCarrier).toUpperCase() ? 0.9 : 1.0;

      const airportDistance = await getDistanceBetweenAirports(
        String(item.origin).toUpperCase(),
        String(item.destination).toUpperCase()
      );

      const score =
        item.calculatedDuration * carrierPreferenceScore + airportDistance;

      item.score = score;
      scoredFlights.push(item);
    }

    scoredFlights.sort((a, b) => a.score - b.score);

    return res.send(scoredFlights);
  } catch (error) {
    console.log("Error log", error);

    return res.status(500).send(error);
  }
};
