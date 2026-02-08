"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, body }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors(
          data.errors?.map((err: { message: string }) => err.message) ?? [
            "投稿に失敗しました",
          ]
        );
        return;
      }

      setName("");
      setBody("");
      router.refresh();
    } catch {
      setErrors(["投稿に失敗しました"]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">新規スレッド作成</h2>
      {errors.length > 0 && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-700">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}
      <div>
        <label htmlFor="post-name" className="block text-sm font-medium text-gray-700">
          名前
        </label>
        <input
          id="post-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="名無しさん"
        />
      </div>
      <div>
        <label htmlFor="post-body" className="block text-sm font-medium text-gray-700">
          本文
        </label>
        <textarea
          id="post-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={5000}
          rows={4}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="本文を入力..."
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "投稿中..." : "投稿する"}
      </button>
    </form>
  );
}
