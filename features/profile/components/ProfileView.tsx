import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/animations";
import { getMockProfileUser } from "../utils/mock-profile";
import { ProfileHero } from "./ProfileHero";
import { ProfilePreferences } from "./ProfilePreferences";
import { ProfileQuickLinks } from "./ProfileQuickLinks";

export async function ProfileView() {
  const t = await getTranslations("ProfilePage");
  const user = getMockProfileUser();

  return (
    <section className="w-full flex-1 py-8 md:py-12">
      <div className="mx-auto space-y-8 md:space-y-10">
        <ProfileHero user={user} />

        <div className="space-y-3">
          <FadeIn direction="up" delay={0.04}>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              {t("sections.account")}
            </h2>
          </FadeIn>
          <ProfileQuickLinks />
        </div>

        <FadeIn direction="up" delay={0.12}>
          <ProfilePreferences />
        </FadeIn>
      </div>
    </section>
  );
}
