const express = require("express");
const router = express.Router();
const testDbRouter = require("./test-db");
const usersRouter = require("./users");
const eventsRouter = require("./events");
const membersRouter = require("./members");
const uploadRouter = require("./upload");

router.use("/test-db", testDbRouter);
router.use("/users", usersRouter);
router.use("/events", eventsRouter);
router.use("/members", membersRouter);
router.use("/upload", uploadRouter);

module.exports = router;