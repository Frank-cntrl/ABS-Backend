const express = require("express");
const router = express.Router();
const testDbRouter = require("./test-db");
const usersRouter = require("./users");
const eventsRouter = require("./events");

router.use("/test-db", testDbRouter);
router.use("/users", usersRouter);
router.use("/events", eventsRouter);

module.exports = router;
