import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import OTP from '../model/OTP.js';
import { deleteFile } from '../utilities.js';
import { sendOTPEmail } from '../utils/sendEmail.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '8h',
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false
    });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    await OTP.create({
      email,
      otp,
      expiresAt
    });

    await sendOTPEmail(email, otp);

    res.status(201).json({
      error: false,
      message: "User registered successfully. Please check your email for verification OTP.",
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    res.status(500).json({ error: true, message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ 
      email, 
      otp,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({
        error: true,
        message: "Invalid or expired OTP"
      });
    }

    await User.findOneAndUpdate({ email }, { isVerified: true });
    
    await OTP.deleteOne({ _id: otpRecord._id });

    const user = await User.findOne({ email });
    const token = generateToken(user._id);

    res.status(200).json({
      error: false,
      message: "Email verified successfully",
      user,
      token
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        error: true,
        message: "Email is already verified"
      });
    }

    await OTP.deleteMany({ email });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    await OTP.create({
      email,
      otp,
      expiresAt
    });

    await sendOTPEmail(email, otp);

    res.status(200).json({
      error: false,
      message: "OTP sent successfully"
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const userId = req.user?.id;
  if (userId !== req.params.id) {
    return res.status(403).json({ error: true, message: "You can only update your own profile" });
  }

  if (!userId) return res.status(401).json({ error: true, message: "Unauthorized" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: true, message: "User not found" });

    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.linkedin) user.linkedin = req.body.linkedin;
    if (req.body.twitter) user.twitter = req.body.twitter;

    if (req.file) {
      if (user.profile_pic) {
        deleteFile(user.profile_pic);
      }
      user.profile_pic = req.file.filename;
    }

    user.updated_at = Date.now();
    const updatedUser = await user.save();

    const userToReturn = updatedUser.toObject();
    delete userToReturn.password;

    res.status(200).json({
      error: false,
      message: "User profile updated successfully",
      user: userToReturn,
    });
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    res.status(500).json({ error: true, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ 
        error: true, 
        message: "Email or password is incorrect" 
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: true,
        message: "Please verify your email before logging in"
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({ 
      error: false, 
      message: "Logged in successfully", 
      token 
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ error: true, message: "User not found" });

    res.status(200).json({ error: false, message: "User retrieved successfully", user });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const gettingUser = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(400).json({ error: true, message: "Invalid token" });

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: true, message: "User not found" });

    return res.json({ error: false, user });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error", error: error.message });
  }
};