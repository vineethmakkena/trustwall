const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Space = require("../models/Space");
const Testimonial = require("../models/Testimonial");
const generateToken = require("../utils/generateToken");

const AUTH_COOKIE = "trustwall_token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const getTrimmedString = (value) => (typeof value === "string" ? value.trim() : "");

const getSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar || null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const validateRegistrationInput = ({ name, email, password }) => {
  const trimmedName = getTrimmedString(name);
  const trimmedEmail = getTrimmedString(email);

  if (!trimmedName || !trimmedEmail || typeof password !== "string" || !password.trim()) {
    return "Name, email, and password are required";
  }

  if (!emailPattern.test(trimmedEmail)) {
    return "Please provide a valid email address";
  }

  if (!passwordPattern.test(password)) {
    return "Password must be at least 8 characters and include uppercase, lowercase, and a number";
  }

  return {
    name: trimmedName,
    email: trimmedEmail,
    password,
  };
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const validatedInput = validateRegistrationInput({ name, email, password });

  if (!validatedInput || typeof validatedInput === "string") {
    return res.status(400).json({ success: false, message: validatedInput || "Name, email, and password are required" });
  }

  const normalizedEmail = validatedInput.email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await User.create({
      name: validatedInput.name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Owner account created successfully",
      user: getSafeUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    throw error;
  }
};

const login = async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!email || !password.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const user = await User.findOne({ email }).select("+password");
  const isPasswordValid = user && (await bcrypt.compare(password, user.password));

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = generateToken(user);
  res.cookie(AUTH_COOKIE, token, COOKIE_OPTIONS);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: getSafeUser(user),
  });
};

const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    user: getSafeUser(req.user),
  });
};

const logout = (req, res) => {
  res.clearCookie(AUTH_COOKIE, {
    httpOnly: COOKIE_OPTIONS.httpOnly,
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
    path: COOKIE_OPTIONS.path,
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

const updateProfile = async (req, res) => {
  const name = getTrimmedString(req.body?.name);
  const avatar = typeof req.body?.avatar === "string" ? req.body.avatar.trim() : "";

  if (!name) {
    return res.status(400).json({ success: false, message: "Name is required" });
  }

  if (name.length > 120) {
    return res.status(400).json({ success: false, message: "Name cannot exceed 120 characters" });
  }

  if (avatar && !/^https?:\/\//i.test(avatar)) {
    return res.status(400).json({ success: false, message: "Avatar must be a valid URL" });
  }

  req.user.name = name;
  req.user.avatar = avatar || undefined;
  await req.user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: getSafeUser(req.user),
  });
};

const changePassword = async (req, res) => {
  const currentPassword = typeof req.body?.currentPassword === "string" ? req.body.currentPassword : "";
  const newPassword = typeof req.body?.newPassword === "string" ? req.body.newPassword : "";

  if (!currentPassword.trim() || !newPassword.trim()) {
    return res.status(400).json({ success: false, message: "Current and new passwords are required" });
  }

  if (!passwordPattern.test(newPassword)) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 8 characters and include uppercase, lowercase, and a number",
    });
  }

  const user = await User.findById(req.user._id).select("+password");
  const validPassword = await bcrypt.compare(currentPassword, user.password);
  if (!validPassword) {
    return res.status(401).json({ success: false, message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  return res.status(200).json({ success: true, message: "Password changed successfully" });
};

const deleteAccount = async (req, res) => {
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!password.trim()) {
    return res.status(400).json({ success: false, message: "Password is required to delete your account" });
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, message: "Password is incorrect" });
  }

  const spaces = await Space.find({ owner: user._id }).select("_id").lean();
  const spaceIds = spaces.map((space) => space._id);
  await Testimonial.deleteMany({ space: { $in: spaceIds } });
  await Space.deleteMany({ owner: user._id });
  await User.deleteOne({ _id: user._id });

  res.clearCookie(AUTH_COOKIE, {
    httpOnly: COOKIE_OPTIONS.httpOnly,
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
    path: COOKIE_OPTIONS.path,
  });

  return res.status(200).json({ success: true, message: "Account deleted successfully" });
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  changePassword,
  deleteAccount,
};
