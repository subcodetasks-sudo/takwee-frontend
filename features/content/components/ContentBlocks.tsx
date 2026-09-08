"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SIZE_CHART_ROWS } from "@/features/product/components/SizeGuideDialog";

export function ContentFaqBlock({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <Accordion className="w-full border-y border-border/70">
      {items.map((item, index) => (
        <AccordionItem key={index} value={`faq-${index}`}>
          <AccordionTrigger className="py-4 text-start text-sm font-semibold text-foreground sm:text-base">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function ContentSizeChartBlock() {
  const t = useTranslations("ProductDetails.sizeGuide");

  return (
    <div className="overflow-x-auto rounded-xl border border-border/80 bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold text-foreground">
              {t("size")}
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              {t("length")}
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              {t("bust")}
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              {t("height")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SIZE_CHART_ROWS.map((row) => (
            <TableRow key={row.size}>
              <TableCell className="font-medium">{row.size}</TableCell>
              <TableCell>{t("cm", { value: row.lengthCm })}</TableCell>
              <TableCell>{t("cm", { value: row.bustCm })}</TableCell>
              <TableCell>{row.heightCm} cm</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="border-t border-border/70 px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-5">
        {t("note")}
      </p>
    </div>
  );
}
