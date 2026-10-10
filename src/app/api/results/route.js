import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { adminDb } from "@/lib/firebase"; // Adjust to your firebaseAdmin config path

// Helper to authenticate user and extract role
async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_fallback_secret"
    );
    const { payload } = await jwtVerify(token, secretKey);
    return payload; // { userId, email, username, userType }
  } catch (error) {
    return null;
  }
}

const COLLECTION_NAME = "uni_results";

// 1. READ / FETCH RESULTS (GET)
export async function GET(req) {
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({
      success: false,
      message: "Unauthorized: Please log in.",
      data: null,
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const rollNumber = searchParams.get("rollNumber");

    let query = adminDb.collection(COLLECTION_NAME);

    // Optional query parameter filtering by roll number
    if (rollNumber) {
      const snapshot = await query.where("rollNumber", "==", rollNumber).get();
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return NextResponse.json({
        success: true,
        message: "Results fetched successfully!",
        data: results,
      });
    }

    // Fetch all results if no filter provided
    const snapshot = await query.get();
    const results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      message: "Results fetched successfully!",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to fetch results.",
      data: null,
    });
  }
}

// 2. CREATE RESULT (POST)
export async function POST(req) {
  const user = await getAuthUser();

  if (!user || (user.userType !== "admin" && user.userType !== "teacher")) {
    return NextResponse.json({
      success: false,
      message: "Forbidden: Only admins and teachers can add results.",
      data: null,
    });
  }

  try {
    const body = await req.json();
    const { rollNumber, subject, examSession, marks, totalMarks } = body;

    // Validation
    if (!rollNumber || !subject || !examSession || marks === undefined || !totalMarks) {
      return NextResponse.json({
        success: false,
        message: "All fields are required: rollNumber, subject, examSession, marks, totalMarks.",
        data: null,
      });
    }

    const newResult = {
      rollNumber: String(rollNumber).trim(),
      subject,
      examSession, // e.g. "1st term", "half yearly", "year final"
      marks: Number(marks),
      totalMarks: Number(totalMarks),
      createdBy: user.userId,
      createdAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection(COLLECTION_NAME).add(newResult);

    return NextResponse.json({
      success: true,
      message: "Result created successfully!",
      data: { id: docRef.id, ...newResult },
    });
  } catch (error) {
    console.error("Error creating result:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to create result.",
      data: null,
    });
  }
}

// 3. UPDATE RESULT (PUT)
export async function PUT(req) {
  const user = await getAuthUser();

  if (!user || (user.userType !== "admin" && user.userType !== "teacher")) {
    return NextResponse.json({
      success: false,
      message: "Forbidden: Only admins and teachers can update results.",
      data: null,
    });
  }

  try {
    const body = await req.json();
    const { resultId, rollNumber, subject, examSession, marks, totalMarks } = body;

    if (!resultId) {
      return NextResponse.json({
        success: false,
        message: "resultId is required for updating.",
        data: null,
      });
    }

    const docRef = adminDb.collection(COLLECTION_NAME).doc(resultId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({
        success: false,
        message: "Result record not found.",
        data: null,
      });
    }

    const updateData = {
      ...(rollNumber && { rollNumber: String(rollNumber).trim() }),
      ...(subject && { subject }),
      ...(examSession && { examSession }),
      ...(marks !== undefined && { marks: Number(marks) }),
      ...(totalMarks && { totalMarks: Number(totalMarks) }),
      updatedAt: new Date().toISOString(),
    };

    await docRef.update(updateData);

    return NextResponse.json({
      success: true,
      message: "Result updated successfully!",
      data: { id: resultId, ...updateData },
    });
  } catch (error) {
    console.error("Error updating result:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to update result.",
      data: null,
    });
  }
}

// 4. DELETE RESULT (DELETE)
export async function DELETE(req) {
  const user = await getAuthUser();

  if (!user || (user.userType !== "admin" && user.userType !== "teacher")) {
    return NextResponse.json({
      success: false,
      message: "Forbidden: Only admins and teachers can delete results.",
      data: null,
    });
  }

  try {
    const body = await req.json();
    const { resultId } = body;

    if (!resultId) {
      return NextResponse.json({
        success: false,
        message: "resultId is required for deletion.",
        data: null,
      });
    }

    const docRef = adminDb.collection(COLLECTION_NAME).doc(resultId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({
        success: false,
        message: "Result record not found.",
        data: null,
      });
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Result deleted successfully!",
      data: { resultId },
    });
  } catch (error) {
    console.error("Error deleting result:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to delete result.",
      data: null,
    });
  }
}