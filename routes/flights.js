var express = require("express");
const { getFilghts } = require("../controllers/flights.controller");
var router = express.Router();

/* GET users listing. */
router.get("/", getFilghts);

module.exports = router;
