// app/api/test-event/route.js
import { inngest } from "@/config/inngest";

export async function POST(req) {
  const body = await req.json();

  await inngest.send({
    name: "clerk/user.created",
    data: body,
  });

  return Response.json({ status: "Event sent to Inngest!" });
}
