"use server";
import { ClassType } from "../../types/class.type";

export async function fetchClasses(): Promise<ClassType[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch classes");
    }

    const result = await response.json(); // Lấy toàn bộ dữ liệu trả về
    return result.data; // Chỉ trả về phần data
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw new Error("Could not fetch classes");
  }
}
