const Owner = require("../models/owner");

const getFrontendUrl = () => {
  const frontendUrls = [
    ...(process.env.FRONTEND_URLS || "").split(","),
    process.env.FRONTEND_URL
  ]
    .filter(Boolean)
    .map((url) => url.trim().replace(/\/$/, ""));
  return frontendUrls[0] || "http://localhost:5173";
};

exports.verifyEmail = async (req, res) => {
  const frontendUrl = getFrontendUrl();
  try {
    const { token } = req.params;

    const owner = await Owner.findOne({ emailToken: token });

    if (!owner) {
      return res.redirect(`${frontendUrl}/login?error=invalid_token`);
    }

    owner.isEmailVerified = true;
    owner.emailToken = undefined;
    await owner.save();

    return res.redirect(`${frontendUrl}/login?verified=true`);

  } catch (err) {
    return res.redirect(`${frontendUrl}/login?error=verification_failed`);
  }
};
