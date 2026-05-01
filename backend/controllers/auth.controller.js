const Owner = require("../models/owner");
const Restaurant = require("../models/restaurant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const resend = require("../services/resend");

const dotenv = require("dotenv");
dotenv.config();

const frontendUrls = [
  ...(process.env.FRONTEND_URLS || "").split(","),
  process.env.FRONTEND_URL
]
  .filter(Boolean)
  .map((url) => url.trim().replace(/\/$/, ""));

const primaryFrontendUrl = frontendUrls[0];

const issueToken = (owner) => {
  return jwt.sign(
    { ownerId: owner._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const setAuthCookie = (res, token) => {
  const useCrossSiteCookie = process.env.CROSS_SITE_COOKIE === "true" || process.env.NODE_ENV === "production";
  const cookieSecure = process.env.COOKIE_SECURE === "true" || useCrossSiteCookie;
  const cookieDomain = process.env.COOKIE_DOMAIN;

  const cookieOptions = {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: useCrossSiteCookie ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };

  if (cookieDomain) {
    cookieOptions.domain = cookieDomain;
  }

  res.cookie("token", token, cookieOptions);
};

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
      provider: "local",
      phone_no,
      emailToken,
      isEmailVerified: false
    });
    await owner.save();


    const verifyURL = `${process.env.BACKEND_URL}/swaad/owner/verify-email/${emailToken}`;


await resend.emails.send({
  from: "SwaadQR <noreply@contact.swaadqr.online>",
  to: email,
  subject: "Welcome to SwaadQR - Verify your email",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your email</title>
      <style>
        body { font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fb; color: #1e293b; margin: 0; padding: 0; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f7f9fb; padding-bottom: 60px; }
        .main { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); margin-top: 40px; border: 1px solid #f1f5f9; }
        .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 40px 40px 30px; text-align: center; }
        .content h2 { color: #0f172a; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 16px; }
        .content p { color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
        .btn-container { text-align: center; margin: 35px 0; }
        .btn { display: inline-block; background-color: #f97316; color: #ffffff !important; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase; box-shadow: 0 4px 14px 0 rgba(249, 115, 22, 0.39); }
        .divider { height: 1px; background-color: #e2e8f0; margin: 30px 0; }
        .alt-link { font-size: 13px; color: #64748b; word-break: break-all; text-align: left; background-color: #f8fafc; padding: 12px; border-radius: 8px; border: 1px dashed #cbd5e1; }
        .footer { padding: 0 40px 30px; text-align: center; font-size: 13px; color: #94a3b8; }
        .footer p { margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="main">
          <div class="header">
            <h1>SwaadQR</h1>
          </div>
          <div class="content">
            <h2>Let's get started</h2>
            <p>Welcome to SwaadQR! We're thrilled to have you on board. You're just one step away from creating beautiful, interactive digital menus for your restaurant.</p>
            <p>Please confirm your email address by clicking the button below:</p>
            <div class="btn-container">
              <a href="${verifyURL}" class="btn">Verify Email Address</a>
            </div>
            <div class="divider"></div>
            <p style="font-size: 14px; text-align: left; margin-bottom: 8px;">If the button above doesn't work, copy and paste this link into your browser:</p>
            <div class="alt-link">${verifyURL}</div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} SwaadQR. All rights reserved.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
          </div>
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

    if (!owner.password) {
      return res.status(400).json({
        message: "This account uses Google sign-in. Please continue with Google."
      });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = issueToken(owner);
    setAuthCookie(res, token);
    res.status(200).json({
      message: "Login successful",
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        phone_no: owner.phone_no,
        provider: owner.provider
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
}

exports.completeGoogleAuth = async (req, res) => {
  try {
    const owner = req.user;

    if (!owner) {
      return res.redirect(`${primaryFrontendUrl}/login?error=google`);
    }

    const token = issueToken(owner);
    setAuthCookie(res, token);

    return res.redirect(`${primaryFrontendUrl}/restaurants`);
  } catch (err) {
    return res.redirect(`${primaryFrontendUrl}/login?error=google`);
  }
};

exports.logout = (req, res) => {
  const useCrossSiteCookie = process.env.CROSS_SITE_COOKIE === "true" || process.env.NODE_ENV === "production";
  const cookieSecure = process.env.COOKIE_SECURE === "true" || useCrossSiteCookie;
  const cookieDomain = process.env.COOKIE_DOMAIN;

  const clearOptions = {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: useCrossSiteCookie ? "none" : "lax",
    path: "/"
  };

  if (cookieDomain) {
    clearOptions.domain = cookieDomain;
  }

  res.clearCookie("token", clearOptions);
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

exports.updateProfile = async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const { name, phone_no } = req.body;

    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    if (typeof name === "string") {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      owner.name = trimmedName;
    }

    if (typeof phone_no === "string") {
      const trimmedPhone = phone_no.trim();

      if (trimmedPhone) {
        const existingOwner = await Owner.findOne({
          phone_no: trimmedPhone,
          _id: { $ne: ownerId }
        });

        if (existingOwner) {
          return res.status(400).json({ message: "Phone number already in use" });
        }

        owner.phone_no = trimmedPhone;
      } else if (owner.provider === "local") {
        return res.status(400).json({ message: "Phone number is required for local accounts" });
      } else {
        owner.phone_no = undefined;
      }
    }

    await owner.save();

    const updatedOwner = await Owner.findById(ownerId).select("-password");

    return res.json({
      message: "Profile updated successfully",
      owner: updatedOwner
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile" });
  }
};
