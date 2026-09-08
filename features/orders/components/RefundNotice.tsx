"use client";

import { useTranslations } from "next-intl";
import { ProductPrice } from "@/features/product";

export function RefundNotice({ totalTRY }: { totalTRY: number }) {
  const t = useTranslations("ProfilePage.orders");

  return (
    <p className="text-[10px] text-muted-foreground sm:text-xs">
      {t.rich("refundNotice", {
        amount: (_chunks) => (
          <ProductPrice
            amountTRY={totalTRY}
            className="inline-flex font-medium text-foreground"
            iconClassName="size-3"
          />
        ),
      })}
    </p>
  );
}
