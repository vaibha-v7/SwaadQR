const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");

const {
  addDish,
  getDishesByRestaurant,
  generateRestaurantDishesQR,
  updateDish,
  deleteDish
} = require("../controllers/dishes.controller");



router.post("/adddish", authenticate, addDish);

router.get("/restaurant/:restaurantId", getDishesByRestaurant);

router.get("/restaurant/:restaurantId/qr", authenticate, generateRestaurantDishesQR);

router.put("/update/:id", authenticate, updateDish);

router.delete("/delete/:id", authenticate, deleteDish);

module.exports = router;