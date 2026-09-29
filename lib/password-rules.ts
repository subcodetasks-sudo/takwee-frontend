/**
 * Mirrors the API password rule (Laravel `Password::min(8)->mixedCase()->letters()->numbers()->symbols()`).
 * Symbol matching uses the same Unicode classes as Laravel: separator, symbol, or punctuation.
 */

const HAS_LETTER = /\p{L}/u;
const HAS_LOWER = /\p{Ll}/u;
const HAS_UPPER = /\p{Lu}/u;
const HAS_NUMBER = /\p{N}/u;
const HAS_SYMBOL = /[\p{Z}\p{S}\p{P}]/u;

type IssueCtx = {
  addIssue: (issue: {
    code: "custom";
    path: (string | number)[];
    message: string;
  }) => void;
};

export function passwordMeetsStrengthRules(password: string): boolean {
  return (
    password.length >= 8 &&
    HAS_UPPER.test(password) &&
    HAS_LOWER.test(password) &&
    HAS_LETTER.test(password) &&
    HAS_NUMBER.test(password) &&
    HAS_SYMBOL.test(password)
  );
}

export function addPasswordStrengthIssues(
  password: string,
  ctx: IssueCtx,
  message: string,
  path: (string | number)[],
) {
  if (passwordMeetsStrengthRules(password)) return;

  ctx.addIssue({
    code: "custom",
    path,
    message,
  });
}
