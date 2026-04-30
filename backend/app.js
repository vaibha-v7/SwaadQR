require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const passport = require("passport");
const connectDB = require("./config/db");
const ownerroutes = require("./routes/auth.routes");
const googleRoutes = require("./routes/google.routes");
const restroutes = require("./routes/rest.routes");
const dishesroutes = require("./routes/dishes.routes");
const cookieParser = require("cookie-parser");

require("./config/passport");

const app = express();
connectDB();

const allowedOrigins = [
  ...(process.env.FRONTEND_URLS || "").split(","),
  process.env.FRONTEND_URL,
  "http://localhost:4000"
]
  .filter(Boolean)
  .map((origin) => origin.trim())
  .map((origin) => origin.replace(/\/$/, ""));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());


app.use("/auth", googleRoutes);
app.use("/swaad/owner", ownerroutes);
app.use("/swaad/restaurant", restroutes);
app.use("/swaad/dishes", dishesroutes);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "Image size must be less than or equal to 5 MB" });
  }

  if (err && err.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message });
  }

  return next(err);
});

app.use((err, req, res, next) => {
  return res.status(500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
