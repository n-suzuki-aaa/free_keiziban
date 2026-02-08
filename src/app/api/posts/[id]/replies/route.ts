import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validatePostInput } from "@/lib/validation";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = parseInt(id, 10);

  if (isNaN(postId)) {
    return NextResponse.json(
      { errors: [{ field: "id", message: "不正なIDです" }] },
      { status: 400 }
    );
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return NextResponse.json(
      { errors: [{ field: "id", message: "投稿が見つかりません" }] },
      { status: 404 }
    );
  }

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

  const reply = await prisma.reply.create({
    data: {
      postId,
      name: result.parsed!.name,
      body: result.parsed!.body,
      ipAddress,
      userAgent: userAgent.slice(0, 512),
    },
  });

  return NextResponse.json({ id: reply.id }, { status: 201 });
}
