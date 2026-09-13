import { cookies } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { hasAuthToken } from "@/features/auth/utils/session-cookie";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function MeLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  if (!hasAuthToken(cookieStore)) {
    redirect({
      href: { pathname: "/login", query: { redirect: "/me" } },
      locale,
    });
  }

  return <>{children}</>;
}
