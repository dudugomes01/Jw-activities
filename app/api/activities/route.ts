
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { activities } from "@/lib/schema";
import { authOptions } from "../auth/[...nextauth]/route";
import { insertActivitySchema } from "@/lib/validations";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userActivities = await db.query.activities.findMany({
    where: eq(activities.userId, parseInt(session.user.id)),
  });

  return NextResponse.json(userActivities);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = insertActivitySchema.parse(body);

    const newActivity = await db.insert(activities).values({
      ...validatedData,
      userId: parseInt(session.user.id),
    }).returning();

    return NextResponse.json(newActivity[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
