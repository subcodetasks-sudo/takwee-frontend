export { useAuth, AUTH_SESSION_QUERY_KEY, type UseAuthReturn } from "./hooks/useAuth";
export * from "./components/AuthShell";
export * from "./components/AuthCenteredShell";
export * from "./components/LoginView";
export * from "./components/LoginForm";
export * from "./components/RegisterView";
export * from "./components/RegisterForm";
export * from "./components/VerifyView";
export * from "./components/VerifyOtpForm";
export * from "./components/ForgotPasswordView";
export * from "./components/ForgotPasswordForm";
export * from "./components/ResetPasswordView";
export * from "./components/ResetPasswordForm";
export * from "./types";
export * from "./schemas";
export * from "./utils/session-cookie";

// Server session helpers live in `./api/session` — import that path from
// Server Components / Server Actions to avoid client/server boundary issues.
