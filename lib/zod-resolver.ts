import { z } from "zod";
import type {
  FieldError,
  FieldErrors,
  FieldValues,
  Resolver,
} from "react-hook-form";

/** Lightweight Zod ↔ react-hook-form bridge (no @hookform/resolvers dependency). */
export function zodResolver<T extends FieldValues>(
  schema: z.ZodType<T>
): Resolver<T> {
  return (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors = {} as FieldErrors<T>;

    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key !== "string") continue;
      if (errors[key as keyof T & string]) continue;

      (errors as Record<string, FieldError>)[key] = {
        type: issue.code,
        message: issue.message,
      };
    }

    return { values: {}, errors };
  };
}
