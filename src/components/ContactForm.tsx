"use client";

import { useState } from "react";

type FormErrors = {
  email?: string;
  name?: string;
  content?: string;
};

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "正しいメールアドレスの形式で入力してください";
    }

    if (!name.trim()) {
      newErrors.name = "名前を入力してください";
    } else if (name.trim().length > 100) {
      newErrors.name = "名前は100文字以内で入力してください";
    }

    if (!content.trim()) {
      newErrors.content = "問い合わせ内容を入力してください";
    } else if (content.trim().length > 5000) {
      newErrors.content = "問い合わせ内容は5000文字以内で入力してください";
    }

    return newErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-bold text-green-800">送信しました</p>
        <p className="mt-2 text-sm text-green-700">
          お問い合わせいただきありがとうございます。
        </p>
        <button
          type="button"
          onClick={() => {
            setEmail("");
            setName("");
            setContent("");
            setSubmitted(false);
          }}
          className="mt-4 rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          新しいお問い合わせ
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="example@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">
          名前 <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="お名前"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>
      <div>
        <label htmlFor="contact-content" className="block text-sm font-medium text-gray-700">
          問い合わせ内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={5000}
          rows={6}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="お問い合わせ内容を入力してください"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        送信する
      </button>
    </form>
  );
}
