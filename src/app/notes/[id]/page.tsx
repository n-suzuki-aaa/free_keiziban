import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ReplyForm from "@/components/ReplyForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailPage({ params }: Props) {
  const { id } = await params;
  const postId = parseInt(id, 10);

  if (isNaN(postId)) {
    notFound();
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      replies: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <article className="rounded border border-gray-200 bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{post.name}</span>
          <span className="text-xs text-gray-500">
            {post.createdAt.toLocaleString("ja-JP")}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-sm text-gray-700">{post.body}</p>
      </article>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">返信 ({post.replies.length} 件)</h2>
        {post.replies.length === 0 ? (
          <p className="text-sm text-gray-500">まだ返信がありません。</p>
        ) : (
          post.replies.map((reply, index) => (
            <div
              key={reply.id}
              className="rounded border border-gray-200 bg-white p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  <span className="mr-2 text-gray-400">{index + 1}.</span>
                  {reply.name}
                </span>
                <span className="text-xs text-gray-500">
                  {reply.createdAt.toLocaleString("ja-JP")}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {reply.body}
              </p>
            </div>
          ))
        )}
      </section>

      <section className="rounded border border-gray-200 bg-white p-6">
        <ReplyForm postId={post.id} />
      </section>
    </div>
  );
}
