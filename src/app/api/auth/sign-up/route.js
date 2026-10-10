import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try { 
    console.log('sign up func reached')
    const body = await req.json();
    const { username, email, password, userType } = body;

    // Basic server-side validation
    if (!username || !email || !password || !userType) {
      return NextResponse.json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const collectionName = `${process.env.NEXT_PUBLIC_PROJECT_NAME}_users`;
    const usersRef = adminDb.collection(collectionName);

    // Check if user already exists with the same email
    const existingUserQuery = await usersRef.where("email", "==", email.toLowerCase()).get();

    if (!existingUserQuery.empty) {
      return NextResponse.json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document in Firestore
    const newUserRef = await usersRef.add({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      userType,
      createdAt: new Date().toISOString(),
    });

    // Create JWT payload
    const payload = {
      userId: newUserRef.id,
      email: email.toLowerCase(),
      username,
      userType,
    };

    const secret = process.env.JWT_SECRET || "default_fallback_secret";
    const token = jwt.sign(payload, secret, { expiresIn: "1y" });

    // Set HTTP-only cookie named 'token'
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully!",
      userId: newUserRef.id,
    });
  } catch (error) {
    console.error("Signup Route Error:", error);
    return NextResponse.json({
      success: false,
      message: error?.message || "An error occurred during registration.",
    });
  } 
}