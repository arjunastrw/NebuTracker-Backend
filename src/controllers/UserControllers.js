import UserModel from "../models/UserModel.js";
import argon2 from "argon2";
import HTTP_STATUS from "../utils/Status/httpStatus.js";
import path from "path";
import fs from "fs";

// path to file log register
const logFilePath = path.join(__dirname, "../app/logs/userController.logs");

// Validasi untuk format email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// validasi untuk format nomor hp
const isValidPhoneNumber = (phone_number) => {
  const phoneRegex = /^\d+$/;
  return phoneRegex.test(phone_number);
};

export const Register = async (req, res) => {
  const {
    surname,
    nickname,
    username,
    email,
    phone_number,
    birth_day,
    gender,
    password,
    confirmPassword,
  } = req.body;

  // validasi untuk memeriksa apakah email valid
  if (!isValidEmail(email)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Email format is invalid",
    });
  }

  // validasi untuk memeriksa apakah nomor hp valid
  if (!isValidPhoneNumber(phone_number)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Phone Number must be number!",
    });
  }

  // validasi untuk memastikan password sesuai dengan confirmasi password
  if (password !== confirmPassword)
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "Password must match!" });

  // hash password menggunakan argon2
  const hashPassword = await argon2.hash(password);

  // main function register
  try {
    // validasi username sudah digunakan
    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return res.status(HTTP_STATUS.CONLIFCT).json({
        message: "Username already in use!",
      });
    }
    // validasi email sudah digunakan
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(HTTP_STATUS.CONLIFCT)
        .json({ message: "Email already in use!" });
    }

    // Register
    await UserModel.create({
      surname: surname,
      nickname: nickname,
      username: username,
      email: email,
      phone_number: phone_number,
      birth_day: birth_day,
      gender: gender,
      password: hashPassword,
    });

    // menulis ke log
    const logMessage = `User registered successfully: Surname: ${surname}, username: ${username}, Email: ${email}, Phone Number: ${phone_number}\n`;
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error("Failed write to log:", err.message);
      }
    });
    console.log("User Successfully Register!", username, email);
    res.status(HTTP_STATUS.CREATED).json({ message: "Register Successfully!" });
  } catch (error) {
    // menulis ke log error
    const errorMessage = `User register failed: ${error.message}\n`;
    fs.appendFile(logFilePath, errorMessage, (err) => {
      if (err) {
        console.error("Failed write to log:", err.message);
      }
    });
    console.error("User Register Failed!", error.message);
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "Register Failed, please try again!" });
  }
};
