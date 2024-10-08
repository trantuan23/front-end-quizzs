export async function deleteClass(classId: string): Promise<{ status: number; data: { message: string } }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/${classId}`, {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      return {
        status: response.status,
        data: await response.json(),
      };
    } catch (error) {
      console.error("Error deleting class:", error);
      throw new Error("Could not delete class");
    }
  }
  