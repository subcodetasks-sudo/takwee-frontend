"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Camera, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@/lib/zod-resolver";
import { useProfile } from "../hooks/useProfile";
import {
  createProfileDetailsSchema,
  type ProfileDetailsFormValues,
} from "../schemas";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function ProfileDetailsForm() {
  const t = useTranslations("ProfilePage.settings.profile");
  const { user, updateDetails, isUpdatingDetails } = useProfile();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoError, setPhotoError] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);

  const schema = useMemo(
    () =>
      createProfileDetailsSchema({
        nameRequired: t("errors.nameRequired"),
        nameLettersOnly: t("errors.nameLettersOnly"),
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileDetailsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
  });

  const avatarUrl = useWatch({ control, name: "avatarUrl" });
  const nameRegister = register("name");

  useEffect(() => {
    reset({
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    });
  }, [user.name, user.email, user.avatarUrl, reset]);

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 3200);
    return () => window.clearTimeout(timer);
  }, [saved]);

  const handlePhotoChange = (file: File | undefined) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.has(file.type)) {
      setPhotoError(t("errors.photoInvalidType"));
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError(t("errors.photoTooLarge"));
      return;
    }

    setPhotoError(undefined);
    const objectUrl = URL.createObjectURL(file);
    const previous = avatarUrl;
    if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
    setValue("avatarUrl", objectUrl, { shouldDirty: true });
  };

  const handleRemovePhoto = () => {
    const previous = avatarUrl;
    if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
    setValue("avatarUrl", undefined, { shouldDirty: true });
    setPhotoError(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onValidSubmit = async (values: ProfileDetailsFormValues) => {
    if (isUpdatingDetails) return;

    await updateDetails({
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      avatarUrl: values.avatarUrl,
    });
    setSaved(true);
  };

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      className="flex h-full flex-col rounded-xl border border-border bg-card"
      noValidate
    >
      <div className="flex flex-1 flex-col gap-5 p-4 sm:gap-6 sm:p-5 md:p-6">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
            {t("title")}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-start">
          <div
            className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary-50 text-lg font-semibold tracking-wide text-primary-800 dark:bg-primary-950/60 dark:text-primary-200 sm:size-24 sm:text-xl"
            aria-hidden
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- local blob/data preview
              <img src={avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              user.initials
            )}
          </div>

          <div className="min-w-0 w-full space-y-2 sm:flex-1">
            <p className="text-xs font-medium text-foreground sm:text-sm">
              {t("photo")}
            </p>
            <p className="text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
              {t("photoHint")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5 sm:justify-start">
              <input
                ref={fileInputRef}
                id={fileInputId}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => handlePhotoChange(e.target.files?.[0])}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="size-3.5" aria-hidden />
                {t("changePhoto")}
              </Button>

              {avatarUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive"
                  onClick={handleRemovePhoto}
                >
                  <Trash2 className="size-3.5" aria-hidden />
                  {t("removePhoto")}
                </Button>
              )}
            </div>
            {photoError && (
              <p className="text-xs text-destructive">{photoError}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="profile-name" className="text-xs font-medium">
              {t("name")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="profile-name"
              {...nameRegister}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^\p{L}\s'.-]/gu, "");
                void nameRegister.onChange(e);
              }}
              placeholder={t("namePlaceholder")}
              className={cn(
                "h-9 text-sm md:h-10",
                errors.name && "border-destructive ring-1 ring-destructive/30"
              )}
              autoComplete="name"
              aria-invalid={!!errors.name}
            />
            {errors.name?.message && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-email" className="text-xs font-medium">
              {t("email")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="profile-email"
              type="email"
              dir="ltr"
              {...register("email")}
              placeholder={t("emailPlaceholder")}
              className={cn(
                "h-9 text-sm md:h-10",
                errors.email && "border-destructive ring-1 ring-destructive/30"
              )}
              autoComplete="email"
              aria-invalid={!!errors.email}
            />
            {errors.email?.message && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col-reverse gap-3 border-t border-border/80 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-5 sm:py-3.5 md:px-6">
        {saved && (
          <p className="inline-flex items-center gap-1.5 text-xs text-success sm:me-auto">
            <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
            {t("saved")}
          </p>
        )}
        <Button
          type="submit"
          disabled={isUpdatingDetails}
          className="h-9 w-full text-xs font-medium shadow-2xs sm:w-auto"
        >
          {isUpdatingDetails ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
