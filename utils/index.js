const axios = require("axios");
const haversine = require("haversine");

const airports = {}; // Temporary cached version of airports data due to api rate limiting and free version and used hash for faster performance

const getAndStoreAirportInfo = async (code) => {
  try {
    const airportApi = "https://airport-info.p.rapidapi.com/airport?iata="; // Improvement Todo: move it to env file

    const { data } = await axios.get(`${airportApi}${code}`, {
      headers: {
        "x-rapidapi-key": "731d2211aemshd492b4dce1d88e1p177457jsnd98099182337", // Improvement Todo: move it to env file
      },
    });

    airports[code] = data;

    return data;
  } catch (error) {
    console.log("Error while fetching airport data");
  }
};

exports.getDistanceBetweenAirports = async (code1, code2) => {
  let airport1 = airports[code1]; // use cached data

  if (!airport1) {
    airport1 = await getAndStoreAirportInfo(code1);
  }

  let airport2 = airports[code2];

  if (!airport2) {
    airport2 = await getAndStoreAirportInfo(code2);
  }

  const start = {
    latitude: airport1.latitude,
    longitude: airport1.longitude,
  };

  const end = {
    latitude: airport2.latitude,
    longitude: airport2.longitude,
  };

  const distance = haversine(start, end, { unit: "mile" });

  return distance;
};

exports.getAndStoreAirportInfo = getAndStoreAirportInfo;
