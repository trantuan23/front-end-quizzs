"use server";
import { ClassType } from "../../types/class.type";

export async function fetchClasses(page: number = 1, limit: number = 10): Promise<{ data: ClassType[]; total: number }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/classes?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  const result = await response.json();
  return { data: result.data || [], total: result.total || 0 };

}

export const getClasses = async (): Promise<{ class_id: string; class_name: string }[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/all`); 

  if (!response.ok) {
      throw new Error('Failed to fetch classes');
  }

  return response.json();
};


