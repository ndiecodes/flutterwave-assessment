var express = require("express");
var router = express.Router();

const controllers = require("../controllers");
const validation = require("../middleware/request");

router.get("/", controllers.index);

router.post(
  "/validate-rule",
  validation.validateRequest,
  controllers.validation
);

module.exports = router;
