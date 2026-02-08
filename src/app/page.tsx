import Link from "next/link";
import prisma from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import PostForm from "@/components/PostForm";

export const dynamic = "force-dynamic";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "掲示板";
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { _count: { select: { replies: true } } },
  });

  return (
    <div className="space-y-8">
      <section className="rounded border border-gray-200 bg-white p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{siteName}</h1>
        {siteDescription && (
          <p className="mt-2 text-sm text-gray-600">{siteDescription}</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">新着スレッド</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-gray-500">まだ投稿がありません。</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              name={post.name}
              body={post.body}
              createdAt={post.createdAt}
              replyCount={post._count.replies}
            />
          ))
        )}
        <div className="pt-2">
          <Link
            href="/notes"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            書き込み一覧へ →
          </Link>
        </div>
      </section>

      <section className="rounded border border-gray-200 bg-white p-6">
        <PostForm />
      </section>
    </div>
  );
}
