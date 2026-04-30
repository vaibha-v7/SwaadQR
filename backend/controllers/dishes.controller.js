const Dish = require("../models/dishes");
const Restaurant = require("../models/restaurant");
const mongoose = require("mongoose");
const QRCode = require("qrcode");
const { uploadImageToImageKit } = require("../services/imagekit");
const { generateDishDescription } = require("../services/dish-description");


const toBoolean = (value, fallback = true) => {
  if (value === undefined) return fallback;
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
};


const toOptionalNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};


exports.addDish = async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const { restaurantId, dishName, description, price, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurantId" });
    }

    if (req.body.image) {
      return res.status(400).json({ message: "Please upload an image file instead of image URL" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Dish image is required" });
    }

    const parsedPrice = toOptionalNumber(price);
    if (parsedPrice === undefined) {
      return res.status(400).json({ message: "price is required and must be a valid number" });
    }

    const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId });
    if (!restaurant) {
      return res.status(403).json({ message: "You can only add dishes to your own restaurant" });
    }

    const imageUrl = await uploadImageToImageKit(req.file.buffer, req.file.originalname, `swaadqr/restaurants/${restaurantId}`);

    const dish = new Dish({
      restaurantId,
      dishName,
      description,
      image: imageUrl,
      price: parsedPrice,
      category,
      isVeg: toBoolean(req.body.isVeg, true)
    });

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

exports.generateDishDescriptionSuggestion = async (req, res) => {
  try {
    const { dishName, category, isVeg } = req.body;

    if (!dishName || !String(dishName).trim()) {
      return res.status(400).json({ message: "dishName is required" });
    }

    const suggestion = await generateDishDescription({
      dishName: String(dishName).trim(),
      category: String(category || "Dish").trim(),
      isVeg: toBoolean(isVeg, true)
    });

    return res.json({ description: suggestion });
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate description" });
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

    const menuBaseUrl = (
      process.env.MENU_BASE_URL ||
      process.env.FRONTEND_URL ||
      (process.env.FRONTEND_URLS || "").split(",")[0]
    )
      ?.trim()
      .replace(/\/$/, "");

    if (!menuBaseUrl) {
      return res.status(500).json({
        message: "Menu base URL is not configured. Set MENU_BASE_URL or FRONTEND_URL."
      });
    }

    const menuUrl = `${menuBaseUrl}/menu/${restaurantId}`;

    const qrBuffer = await QRCode.toBuffer(menuUrl, {
      type: "png",
      width: 400,
      margin: 0,
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

    if (req.body.image) {
      return res.status(400).json({ message: "Please upload an image file instead of image URL" });
    }

    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    const restaurant = await Restaurant.findOne({ _id: dish.restaurantId, ownerId: req.ownerId });
    if (!restaurant) {
      return res.status(403).json({ message: "Not authorized to update this dish" });
    }

    const updatePayload = {
      ...req.body
    };

    if (Object.prototype.hasOwnProperty.call(updatePayload, "price")) {
      const parsedPrice = toOptionalNumber(updatePayload.price);
      if (parsedPrice === undefined) {
        return res.status(400).json({ message: "price must be a valid number" });
      }
      updatePayload.price = parsedPrice;
    }

    if (Object.prototype.hasOwnProperty.call(updatePayload, "isVeg")) {
      updatePayload.isVeg = toBoolean(updatePayload.isVeg, dish.isVeg);
    }

    if (req.file) {
      const imageUrl = await uploadImageToImageKit(req.file.buffer, req.file.originalname, `swaadqr/restaurants/${dish.restaurantId}`);
      updatePayload.image = imageUrl;
    }

    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      updatePayload,
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