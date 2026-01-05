import connectDB from "@/config/db";

export async function GET() {
  try {
    const db = await connectDB();
    console.log("✅ MongoDB Connected:", db.connection.name);

    return new Response(
      JSON.stringify({
        success: true,
        message: "MongoDB Connected Successfully!",
        dbName: db.connection.name,
        host: db.connection.host,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "MongoDB Connection Failed",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
