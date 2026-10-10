import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try { 
    const body = await req.json();
    const { email, password } = body;

    console.log("reached")

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const collectionName = `${process.env.NEXT_PUBLIC_PROJECT_NAME || "car"}_users`;
    const usersRef = adminDb.collection(collectionName);

    // Fetch user by email
    const querySnapshot = await usersRef.where("email", "==", email.toLowerCase()).get();

    if (querySnapshot.empty) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Get the first matching document
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    

    // Verify password match
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      console.log('wrong pass')
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Create JWT token payload
    const payload = {
      userId: userDoc.id,
      email: userData.email,
      username: userData.username,
      userType: userData.userType,
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
      message: "Signed in successfully!",
      user: {
        id: userDoc.id,
        username: userData.username,
        email: userData.email,
        userType: userData.userType,
      },
    });
  } catch (error) {
    console.error("Sign-in Route Error:", error);
    return NextResponse.json({
      success: false,
      message: error?.message || "An error occurred during sign in.",
    });
  }
}