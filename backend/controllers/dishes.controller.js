const Dish = require("../models/dishes");
const Restaurant = require("../models/restaurant");
const mongoose = require("mongoose");
const QRCode = require("qrcode");



exports.addDish = async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const { restaurantId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurantId" });
    }

    const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId });
    if (!restaurant) {
      return res.status(403).json({ message: "You can only add dishes to your own restaurant" });
    }

    const dish = new Dish(req.body);
    const savedDish = await dish.save();

    res.status(201).json(savedDish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getDishesByRestaurant = async (req, res) => {
  try {
    const dishes = await Dish.find({
      restaurantId: req.params.restaurantId
    });

    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.generateRestaurantDishesQR = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurantId" });
    }

    const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId: req.ownerId });
    if (!restaurant) {
      return res.status(403).json({ message: "Not authorized for this restaurant" });
    }

    const menuBaseUrl = (process.env.MENU_BASE_URL || "http://localhost:4000/menu").replace(/\/$/, "");
    const menuUrl = `${menuBaseUrl}/${restaurantId}`;

    const qrBuffer = await QRCode.toBuffer(menuUrl, {
      type: "png",
      width: 400,
      margin: 2,
      errorCorrectionLevel: "H"
    });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", `inline; filename="menu-${restaurantId}.png"`);
    return res.send(qrBuffer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



exports.updateDish = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid dish id" });
    }

    if (req.body.restaurantId) {
      return res.status(400).json({ message: "restaurantId cannot be updated" });
    }

    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    const restaurant = await Restaurant.findOne({ _id: dish.restaurantId, ownerId: req.ownerId });
    if (!restaurant) {
      return res.status(403).json({ message: "Not authorized to update this dish" });
    }

    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedDish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.deleteDish = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid dish id" });
    }

    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    const restaurant = await Restaurant.findOne({ _id: dish.restaurantId, ownerId: req.ownerId });
    if (!restaurant) {
      return res.status(403).json({ message: "Not authorized to delete this dish" });
    }

    await Dish.findByIdAndDelete(req.params.id);

    res.json({ message: "Dish deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};