"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Ruler, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { AbayaSize, ApiAbayaSizeGuide } from "../types";

export interface SizeChartRow {
  size: AbayaSize;
  lengthCm: number;
  lengthInch: number;
  bustCm: number;
  bustInch: number;
  heightCm: string;
  heightInch: string;
}

export const SIZE_CHART_ROWS: SizeChartRow[] = [
  {
    size: "52",
    lengthCm: 130,
    lengthInch: 51,
    bustCm: 52,
    bustInch: 20.5,
    heightCm: "150 - 155",
    heightInch: "4'11\" - 5'1\"",
  },
  {
    size: "54",
    lengthCm: 135,
    lengthInch: 53,
    bustCm: 54,
    bustInch: 21.2,
    heightCm: "156 - 160",
    heightInch: "5'2\" - 5'3\"",
  },
  {
    size: "56",
    lengthCm: 140,
    lengthInch: 55,
    bustCm: 56,
    bustInch: 22,
    heightCm: "161 - 165",
    heightInch: "5'4\" - 5'5\"",
  },
  {
    size: "58",
    lengthCm: 145,
    lengthInch: 57,
    bustCm: 58,
    bustInch: 22.8,
    heightCm: "166 - 170",
    heightInch: "5'6\" - 5'7\"",
  },
  {
    size: "60",
    lengthCm: 150,
    lengthInch: 59,
    bustCm: 60,
    bustInch: 23.6,
    heightCm: "171 - 176+",
    heightInch: "5'8\"+",
  },
];

interface SizeGuideDialogProps {
  trigger?: React.ReactNode;
  guide?: ApiAbayaSizeGuide | null;
}

function cmToFtIn(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

export function SizeGuideDialog({
  trigger,
  guide,
}: SizeGuideDialogProps) {
  const tGuide = useTranslations("ProductDetails.sizeGuide");
  const [unit, setUnit] = useState<"cm" | "inch">(
    (guide?.default_unit === "inch" ? "inch" : "cm") as "cm" | "inch",
  );
  const [open, setOpen] = useState(false);

  const rows: SizeChartRow[] = useMemo(() => {
    if (guide?.rows && guide.rows.length > 0) {
      return guide.rows.map((r) => {
        const lengthCm = r.abaya_length;
        const lengthInch = Math.round(lengthCm / 2.54);
        const bustCm = r.chest_width;
        const bustInch = Math.round((bustCm / 2.54) * 10) / 10;
        const heightCm = r.height_plus
          ? `${r.height_min} - ${r.height_max}+`
          : `${r.height_min} - ${r.height_max}`;
        const heightInch = r.height_plus
          ? `${cmToFtIn(r.height_max)}+`
          : `${cmToFtIn(r.height_min)} - ${cmToFtIn(r.height_max)}`;

        return {
          size: r.size as AbayaSize,
          lengthCm,
          lengthInch,
          bustCm,
          bustInch,
          heightCm,
          heightInch,
        };
      });
    }
    return SIZE_CHART_ROWS;
  }, [guide]);

  const howToSteps = useMemo(() => {
    if (!guide?.how_to?.trim()) return null;
    const lines = guide.how_to
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);

    return lines.map((line, idx) => {
      // Strip leading digit and dot if present: "1. Measure..." -> "Measure..."
      const cleaned = line.replace(/^\d+\.\s*/, "");
      return {
        number: idx + 1,
        text: cleaned,
      };
    });
  }, [guide?.how_to]);

  const dialogTitle = guide?.title?.trim() || tGuide("title");
  const dialogDescription = guide?.description?.trim() || tGuide("description");
  const footerNote = guide?.footer_note?.trim() || tGuide("note");
  const consultationCta = guide?.consultation_cta?.trim();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ? (
            (trigger as React.ReactElement)
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto gap-1.5 px-1 py-1 text-xs font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              <Ruler className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
              <span className="underline decoration-border/80 underline-offset-4 hover:decoration-foreground">
                {tGuide("view")}
              </span>
            </Button>
          )
        }
      />

      <DialogContent className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden p-0 sm:max-w-xl md:max-w-2xl">
        {/* Header */}
        <div className="border-b border-border/70 bg-muted/25 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-foreground ring-1 ring-primary/20">
              <Ruler className="size-4 text-primary" aria-hidden />
            </div>
            <DialogHeader className="gap-1 text-start">
              <DialogTitle className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {dialogTitle}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                {dialogDescription}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>


        {/* Tab switcher & Unit Toggle */}
        <Tabs defaultValue="chart" className="w-full gap-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 pt-3 pb-2 sm:px-6">
            <TabsList
              variant="line"
              className="h-auto gap-1 border-0 bg-transparent p-0"
            >
              <TabsTrigger
                value="chart"
                className="px-3 py-1.5 text-xs sm:text-sm font-medium data-active:text-foreground"
              >
                {tGuide("tabChart")}
              </TabsTrigger>
              <TabsTrigger
                value="measure"
                className="px-3 py-1.5 text-xs sm:text-sm font-medium data-active:text-foreground"
              >
                {tGuide("tabHowToMeasure")}
              </TabsTrigger>
            </TabsList>

            {/* Segmented Unit Toggle */}
            <div className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setUnit("cm")}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition-colors",
                  unit === "cm"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tGuide("unitCm")}
              </button>
              <button
                type="button"
                onClick={() => setUnit("inch")}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition-colors",
                  unit === "inch"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tGuide("unitInch")}
              </button>
            </div>
          </div>

          {/* Size Chart Content */}
          <TabsContent value="chart" className="p-4 sm:p-6">
            <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow className="border-b border-border/70 hover:bg-transparent">
                    <TableHead className="py-2.5 text-start font-semibold text-foreground">
                      {tGuide("size")}
                    </TableHead>
                    <TableHead className="py-2.5 text-start font-semibold text-foreground">
                      {tGuide("height")}
                    </TableHead>
                    <TableHead className="py-2.5 text-start font-semibold text-foreground">
                      {tGuide("length")}
                    </TableHead>
                    <TableHead className="py-2.5 text-start font-semibold text-foreground">
                      {tGuide("bust")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.size}
                      className="border-b border-border/50 hover:bg-muted/30"
                    >
                      <TableCell className="py-3 font-semibold tabular-nums text-foreground">
                        {row.size}
                      </TableCell>
                      <TableCell className="py-3 tabular-nums text-muted-foreground">
                        {unit === "cm"
                          ? `${row.heightCm} cm`
                          : row.heightInch}
                      </TableCell>
                      <TableCell className="py-3 tabular-nums text-foreground">
                        {unit === "cm"
                          ? tGuide("cm", { value: row.lengthCm })
                          : tGuide("inch", { value: row.lengthInch })}
                      </TableCell>
                      <TableCell className="py-3 tabular-nums text-foreground">
                        {unit === "cm"
                          ? tGuide("cm", { value: row.bustCm })
                          : tGuide("inch", { value: row.bustInch })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <p className="mt-3 text-xs text-muted-foreground/90 leading-relaxed">
              {footerNote}
            </p>
          </TabsContent>

          {/* How to Measure Content */}
          <TabsContent value="measure" className="space-y-3 p-4 sm:p-6">
            <div
              className={cn(
                "grid gap-3",
                howToSteps && howToSteps.length > 0
                  ? howToSteps.length === 2
                    ? "sm:grid-cols-2"
                    : "sm:grid-cols-3"
                  : "sm:grid-cols-3",
              )}
            >
              {howToSteps && howToSteps.length > 0 ? (
                howToSteps.map((step) => (
                  <div
                    key={step.number}
                    className="flex flex-col gap-1.5 rounded-xl border border-border/70 bg-card p-4 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-foreground">
                        {step.number}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex flex-col gap-1.5 rounded-xl border border-border/70 bg-card p-4 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-foreground">
                        1
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                        {tGuide("measureLengthTitle")}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tGuide("measureLengthDesc")}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 rounded-xl border border-border/70 bg-card p-4 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-foreground">
                        2
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                        {tGuide("measureBustTitle")}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tGuide("measureBustDesc")}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 rounded-xl border border-border/70 bg-card p-4 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-foreground">
                        3
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                        {tGuide("measureSleeveTitle")}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tGuide("measureSleeveDesc")}
                    </p>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Boutique Concierge Footer Banner */}
        <div className="border-t border-border/70 bg-muted/30 px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Sparkles className="size-4 shrink-0 text-primary" aria-hidden />
            <div className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">
                {tGuide("conciergeTitle")}
              </span>
              {" — "}
              <span>{consultationCta || tGuide("conciergeDesc")}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
