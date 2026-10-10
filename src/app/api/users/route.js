import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { adminDb } from "@/lib/firebase"; // Adjust import path to your firebase config

async function getAuthenticatedUserRole() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_fallback_secret"
    );
    const { payload } = await jwtVerify(token, secretKey);
    return payload.userType;
  } catch (error) {
    return null;
  }
}

// GET: Fetch users based on requester's role
export async function GET() {
  const userRole = await getAuthenticatedUserRole();
    console.log("user role", userRole)
  if (!userRole) {
    return NextResponse.json({
      success: false,
      message: "Unauthorized",
      data: null,
    });
  }

  if (userRole !== "admin" && userRole !== "teacher") {
    return NextResponse.json({
      success: false,
      message: "Forbidden access",
      data: null,
    });
  }

  try {
    const usersRef = adminDb.collection("uni_users");
    let query;

    if (userRole === "admin") {
      // Admins see both teachers and students
      query = usersRef.where("userType", "in", ["teacher", "student"]);
    } else if (userRole === "teacher") {
      // Teachers see only students
      query = usersRef.where("userType", "==", "student");
    }

    const snapshot = await query.get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("users", users)

    return NextResponse.json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch users",
      data: null,
    });
  }
}

// DELETE: Admin-only delete action
export async function DELETE(request) {
  const userRole = await getAuthenticatedUserRole();

  if (userRole !== "admin" && userRole !== "teacher") {
    return NextResponse.json({
      success: false,
      message: "Forbidden: Admin access required",
      data: null,
    });
  }

  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    await adminDb.collection("uni_users").doc(userId).delete();

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      data: { userId },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to delete user",
      data: null,
    });
  }
}