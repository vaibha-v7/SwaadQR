const Restaurant = require("../models/restaurant");
const Dish = require("../models/dishes");

exports.registerRestaurant = async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const { name, address, phone, description } = req.body;

    const restaurant = await Restaurant.create({
      ownerId,
      name,
      address,
      phone,
      description
    });

    res.status(201).json({
      message: "Restaurant registered successfully",
      restaurant
    });

  } catch (error) {
    console.error("Restaurant registration error:", error.message);
    res.status(500).json({ message: error.message || "Restaurant registration failed" });
  }
};

exports.getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ ownerId: req.ownerId });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ _id: req.params.id, ownerId: req.ownerId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    await Dish.deleteMany({ restaurantId: restaurant._id });
    await Restaurant.findByIdAndDelete(restaurant._id);

    res.json({ message: "Restaurant and its dishes deleted successfully" });
  } catch (error) {
    console.error("Delete restaurant error:", error.message);
    res.status(500).json({ message: error.message || "Failed to delete restaurant" });
  }
}

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).select("name address phone description");
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurant" });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ _id: req.params.id, ownerId: req.ownerId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const { name, address, phone, description } = req.body;
    restaurant.name = name ?? restaurant.name;
    restaurant.address = address ?? restaurant.address;
    restaurant.phone = phone ?? restaurant.phone;
    restaurant.description = description ?? restaurant.description;
    await restaurant.save();

    res.json({ message: "Restaurant updated successfully", restaurant });
  } catch (error) {
    console.error("Update restaurant error:", error.message);
    res.status(500).json({ message: error.message || "Failed to update restaurant" });
  }
}
