"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import PostCard from "@/components/PostCard";

type Post = {
  id: number;
  name: string;
  body: string;
  createdAt: string;
  _count: { replies: number };
};

type PostsResponse = {
  posts: Post[];
  nextCursor: number | null;
};

type NoteListProps = {
  initialPosts: Post[];
  initialNextCursor: number | null;
};

export default function NoteList({ initialPosts, initialNextCursor }: NoteListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [nextCursor, setNextCursor] = useState<number | null>(initialNextCursor);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || nextCursor === null) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/posts?cursor=${nextCursor}&limit=20`);
      if (!res.ok) return;

      const data: PostsResponse = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setNextCursor(data.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [loading, nextCursor]);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="space-y-3">
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
      {nextCursor !== null && (
        <div ref={observerTarget} className="py-4 text-center">
          {loading && (
            <p className="text-sm text-gray-500">読み込み中...</p>
          )}
        </div>
      )}
    </div>
  );
}
