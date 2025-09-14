const express = require("express");
const router = express.Router();
const testDbRouter = require("./test-db");
const usersRouter = require("./users");

router.use("/test-db", testDbRouter);
router.use("/users", usersRouter);

module.exports = router;
