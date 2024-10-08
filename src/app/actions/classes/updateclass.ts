import { ClassType } from "@/app/types/class.type";

export async function updateClass(classId: string, classData: Omit<ClassType, "class_id">): Promise<{ status: number; data: { message: string } }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/${classId}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classData),
    });
    

    return {
      status: response.status,
      data: await response.json(),
    };
  } catch (error) {
    console.error("Error updating class:", error);
    throw new Error("Could not update class");
  }
}
