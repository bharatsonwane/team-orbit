import { Request, Response, NextFunction } from "express";
import User from "../services/user.service";
import { getHashPassword, validatePassword, createJwtToken } from "../utils/authHelper";
import Lookup from "../services/lookup.service";

export const postUserLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = new User({ email, password, firstName: "", lastName: "", dob: "", phone: "" });
    const userData = await user.getUserByEmailOrPhone();

    if (!userData) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const isValidPassword = await validatePassword(password, userData.password || "");
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const token = createJwtToken({
      userId: userData.id,
      email: userData.email,
      userRole: userData.user_role,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const postUserSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, phone, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = new User({ email, password, firstName, lastName, dob: "", phone });
    const userExists = await existingUser.getUserByEmailOrPhone();

    if (userExists) {
      res.status(400).json({
        success: false,
        message: "User already exists with this email or phone",
      });
      return;
    }

    // Get default user status and role IDs
    const userStatusId = await Lookup.getUserStatusPendingId();
    const userRoleId = await Lookup.getUserRoleUserId();

    // Hash password
    const hashPassword = await getHashPassword(password);

    // Create user
    const newUser = new User({
      email,
      password,
      phone,
      firstName,
      lastName,
      dob: new Date().toISOString().split('T')[0], // Default DOB
      hashPassword,
      userStatusLookupId: userStatusId,
      userRoleLookupId: userRoleId,
    });

    const createdUser = await newUser.signupUser();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userData = req.body;
    const user = new User(userData);
    const createdUser = await user.createUserInfo();

    res.status(201).json({
      success: true,
      message: "User profile created successfully",
      data: createdUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.getUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = new User({ id: parseInt(id), firstName: "", lastName: "", dob: "", phone: "", email: "" });
    const userData = await user.getUserById();

    if (!userData) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, id: parseInt(id) };
    const user = new User(updateData);
    const updatedUser = await user.updateUserInfo();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateUserPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const hashPassword = await getHashPassword(password);
    const user = new User({ id: parseInt(id), hashPassword, firstName: "", lastName: "", dob: "", phone: "", email: "" });
    const updatedUser = await user.updateUserPassword();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating password",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const signoutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // In a real application, you might want to invalidate the token
    // For now, just return a success message
    res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during signout",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
