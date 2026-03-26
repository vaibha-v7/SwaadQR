const express = require("express");
const router = express.Router();
const { registerRestaurant, getMyRestaurants, deleteRestaurant, updateRestaurant, getRestaurantById } = require("../controllers/rest.controller");
const  authenticate  = require("../middleware/auth.middleware");

router.post("/register", authenticate, registerRestaurant);
router.get("/list", authenticate, getMyRestaurants);
router.get("/:id", getRestaurantById);
router.put("/update/:id", authenticate, updateRestaurant);
router.delete("/delete/:id", authenticate, deleteRestaurant);

module.exports = router;
