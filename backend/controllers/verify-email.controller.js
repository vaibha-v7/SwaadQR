const Owner = require("../models/owner");

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const owner = await Owner.findOne({ emailToken: token });

    if (!owner) {
      return res.status(400).json({ message: "Invalid token" });
    }

    owner.isEmailVerified = true;
    owner.emailToken = null;
    await owner.save();

    res.json({ message: "Email verified successfully" });

  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};
