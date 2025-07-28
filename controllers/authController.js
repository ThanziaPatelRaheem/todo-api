import express from "express";
import User from "../models/User.js";
import createError from "../utlis/createError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      return next(createError(409, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const { password: _, ...createdUser } = newUser.toObject();

    res
      .status(200)
      .json({ message: "User registered successfully", createdUser });
  } catch (err) {
    next(err);
  }
};

export const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const pwdMatch = await bcrypt.compare(password, user.password);

    if (!pwdMatch) {
      return next(createError(400, "Invalid email or password"));
    }

    const paylaod = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(paylaod, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(200).json({ sucess: true, token: `Bearer ${token}` });
  } catch (err) {
    next(err);
  }
};
