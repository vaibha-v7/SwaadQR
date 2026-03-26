const Owner = require("../models/owner");
const Restaurant = require("../models/restaurant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const resend = require("../services/resend");

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone_no } = req.body;

    const ownerExists = await Owner.findOne({ email });
    if (ownerExists) {
      return res.status(400).json({ message: "Owner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const emailToken = crypto.randomBytes(32).toString("hex");

    const owner = await Owner.create({
      name,
      email,
      password: hashedPassword,
      phone_no,
      emailToken,
      isEmailVerified: false
    });
    await owner.save();


    const verifyURL = `${process.env.BACKEND_URL}/swaad/owner/verify-email/${emailToken}`;


await resend.emails.send({
  from: "SwaadQR <onboarding@resend.dev>",
  to: email,
  subject: "Verify your email",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; color: #1a1a1a; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; border: 1px solid #f0f0f0; border-radius: 8px; margin-top: 50px; }
        .logo { font-size: 24px; font-weight: bold; color: #000000; margin-bottom: 20px; text-align: center; }
        .content { line-height: 1.6; color: #444444; text-align: center; }
        .button { display: inline-block; padding: 14px 30px; background-color: #000000; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: 600; margin-top: 25px; }
        .footer { margin-top: 30px; font-size: 12px; color: #999999; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">SwaadQR</div>
        <div class="content">
          <h2 style="color: #1a1a1a; margin-bottom: 10px;">Verify your email</h2>
          <p>Thank you for joining SwaadQR. To finish setting up your account and start creating your digital menus, please verify your email address below.</p>
          <a href="${verifyURL}" class="button">Verify Email Address</a>
          <p style="margin-top: 25px; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #007bff; word-break: break-all;">${verifyURL}</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SwaadQR. All rights reserved. <br>
          If you didn't request this email, you can safely ignore it.
        </div>
      </div>
    </body>
    </html>
  `
});

    res.status(201).json({
      message: "Registered. Please verify your email",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!owner.isEmailVerified) {
      return res.status(401).json({
        message: "Please verify your email first"
      });
    }
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { ownerId: owner._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({
      message: "Login successful",
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        phone_no: owner.phone_no
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
}

exports.logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
  });
  res.status(200).json({ message: "Logout successful" });
}

exports.profile = async (req, res) => {
  try {
    const ownerId = req.ownerId;

    const owner = await Owner.findById(ownerId).select("-password");
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const restaurants = await Restaurant.find({ ownerId });

    res.json({
      owner,
      restaurants
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
