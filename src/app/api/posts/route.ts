import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validatePostInput } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cursorParam = searchParams.get("cursor");
  const limitParam = searchParams.get("limit");

  const limit = Math.min(Math.max(parseInt(limitParam ?? "20", 10) || 20, 1), 100);
  const cursor = cursorParam ? parseInt(cursorParam, 10) : undefined;

  const posts = await prisma.post.findMany({
    take: limit + 1,
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1,
        }
      : {}),
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { replies: true } } },
  });

  const hasMore = posts.length > limit;
  const results = hasMore ? posts.slice(0, limit) : posts;
  const nextCursor = hasMore ? results[results.length - 1].id : null;

  return NextResponse.json({
    posts: results,
    nextCursor,
  });
}

export async function POST(request: NextRequest) {
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { errors: [{ field: "body", message: "不正なリクエストです" }] },
      { status: 400 }
    );
  }

  const result = validatePostInput(data);
  if (!result.valid) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  const post = await prisma.post.create({
    data: {
      name: result.parsed!.name,
      body: result.parsed!.body,
      ipAddress,
      userAgent: userAgent.slice(0, 512),
    },
  });

  return NextResponse.json({ id: post.id }, { status: 201 });
}
