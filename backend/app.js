require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const ownerroutes = require("./routes/auth.routes");
const restroutes = require("./routes/rest.routes");
const dishesroutes = require("./routes/dishes.routes");
const cookieParser = require("cookie-parser");

const app = express();
connectDB();

app.use(cors({
  origin:"http://localhost:4000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/swaad/owner", ownerroutes);
app.use("/swaad/restaurant", restroutes);
app.use("/swaad/dishes", dishesroutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
