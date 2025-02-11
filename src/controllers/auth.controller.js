import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (username.length < 4 || password.length < 6) {
      return res.status(400).json({ message: "Username (min: 3 chars) and password (min: 6 chars)" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // Create a token
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({ message: "New user registered successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a token
    generateToken(user._id, res);

    res.status(200).json({ message: "Logged in successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong in login" });
  }
}

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}