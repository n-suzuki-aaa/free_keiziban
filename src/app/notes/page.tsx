import prisma from "@/lib/prisma";
import PostForm from "@/components/PostForm";
import NoteList from "@/components/NoteList";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const limit = 20;

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    include: { _count: { select: { replies: true } } },
  });

  const hasMore = posts.length > limit;
  const initialPosts = hasMore ? posts.slice(0, limit) : posts;
  const nextCursor = hasMore ? initialPosts[initialPosts.length - 1].id : null;

  const serializedPosts = initialPosts.map((post) => ({
    id: post.id,
    name: post.name,
    body: post.body,
    createdAt: post.createdAt.toISOString(),
    _count: post._count,
  }));

  return (
    <div className="space-y-8">
      <section className="rounded border border-gray-200 bg-white p-6">
        <PostForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">書き込み一覧</h2>
        <NoteList initialPosts={serializedPosts} initialNextCursor={nextCursor} />
      </section>
    </div>
  );
}
