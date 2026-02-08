export type ValidationError = {
  field: string;
  message: string;
};

export function validatePostInput(data: unknown): {
  valid: boolean;
  errors: ValidationError[];
  parsed?: { name: string; body: string };
} {
  const errors: ValidationError[] = [];

  if (typeof data !== "object" || data === null) {
    return { valid: false, errors: [{ field: "body", message: "不正なリクエストです" }] };
  }

  const { name, body } = data as { name?: unknown; body?: unknown };

  if (typeof name !== "string" || name.trim().length === 0) {
    errors.push({ field: "name", message: "名前を入力してください" });
  } else if (name.trim().length > 100) {
    errors.push({ field: "name", message: "名前は100文字以内で入力してください" });
  }

  if (typeof body !== "string" || body.trim().length === 0) {
    errors.push({ field: "body", message: "本文を入力してください" });
  } else if (body.trim().length > 5000) {
    errors.push({ field: "body", message: "本文は5000文字以内で入力してください" });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    parsed: {
      name: (name as string).trim(),
      body: (body as string).trim(),
    },
  };
}
