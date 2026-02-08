import Link from "next/link";

type PostCardProps = {
  id: number;
  name: string;
  body: string;
  createdAt: Date | string;
  replyCount: number;
  href?: string;
};

export default function PostCard({
  id,
  name,
  body,
  createdAt,
  replyCount,
  href,
}: PostCardProps) {
  const linkHref = href ?? `/notes/${id}`;
  const displayDate =
    typeof createdAt === "string"
      ? new Date(createdAt).toLocaleString("ja-JP")
      : createdAt.toLocaleString("ja-JP");

  return (
    <Link
      href={linkHref}
      className="block rounded border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium text-gray-900">{name}</span>
        <span className="text-xs text-gray-500">{displayDate}</span>
      </div>
      <p className="line-clamp-3 whitespace-pre-wrap text-sm text-gray-700">
        {body}
      </p>
      <div className="mt-2 text-xs text-gray-500">
        返信 {replyCount} 件
      </div>
    </Link>
  );
}
