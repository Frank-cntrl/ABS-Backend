const express = require("express");
const router = express.Router();
const { User } = require("../database");
const { authenticateJWT } = require("../auth");

router.get("/", async(req, res) => {
    try{
        const users = await User.findAll()
        res.json(users);
    }catch(error){
        console.error("Error fetching users: ", error);
        res.status(500).send("Error fetching users");
    }
});

router.get("/:id", async (req, res) => {
    try{
        const user = await User.findByPk(req.params.id);
        res.json(user);
    }catch(error){
        console.error("Error finding user by ID", error);
        res.status(500).send("Error fetching user");
    }
})

module.exports = router;