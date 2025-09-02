const express = require("express");
const router = express.Router();

router.get("/orders", (req, res) => {
  res.send("order route working");
});

module.exports = router;
