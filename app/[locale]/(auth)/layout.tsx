import { setRequestLocale } from "next-intl/server";
import { AuthShell } from "@/features/auth";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AuthShell>{children}</AuthShell>;
}
