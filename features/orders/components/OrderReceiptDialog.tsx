"use client";

import {
  isValidElement,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Download, Loader2, Printer, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { cn } from "@/lib/utils";
import type { OrderSummary } from "../types";
import { OrderReceipt } from "./OrderReceipt";

interface OrderReceiptDialogProps {
  order: OrderSummary;
  paymentLabel?: string | null;
  /** Custom trigger element (e.g. icon button). Defaults to a hero chip. */
  trigger?: ReactElement;
  triggerClassName?: string;
  triggerLabel?: string;
  children?: ReactNode;
}

export function OrderReceiptDialog({
  order,
  paymentLabel,
  trigger,
  triggerClassName,
  triggerLabel,
  children,
}: OrderReceiptDialogProps) {
  const t = useTranslations("OrderReceipt");
  const receiptRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Linen-Line-Receipt-${order.number}`,
    pageStyle: `
      @page { margin: 12mm; size: auto; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    `,
  });

  const handleDownload = async () => {
    const node = receiptRef.current;
    if (!node || isDownloading) return;

    setIsDownloading(true);
    try {
      const paperBg =
        getComputedStyle(node).backgroundColor || "rgb(249, 247, 246)";

      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: paperBg,
        logging: false,
        onclone: (_doc, cloned) => {
          // Guard against letter-spacing / uppercase breaking Arabic shaping in capture
          cloned.querySelectorAll<HTMLElement>("*").forEach((el) => {
            el.style.letterSpacing = "normal";
            if (/[\u0600-\u06FF]/.test(el.textContent ?? "")) {
              el.style.textTransform = "none";
            }
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidthMm = 80;
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;
      const pdfHeightMm = (imgHeightPx * pdfWidthMm) / imgWidthPx;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidthMm, Math.max(pdfHeightMm, 40)],
      });

      const pageHeightMm = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeightMm;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidthMm, pdfHeightMm);
      heightLeft -= pageHeightMm;

      while (heightLeft > 1) {
        position = heightLeft - pdfHeightMm;
        pdf.addPage([pdfWidthMm, pageHeightMm]);
        pdf.addImage(imgData, "PNG", 0, position, pdfWidthMm, pdfHeightMm);
        heightLeft -= pageHeightMm;
      }

      pdf.save(`Linen-Line-Receipt-${order.number}.pdf`);
    } catch {
      gooeyToast.error(t("downloadError"));
    } finally {
      setIsDownloading(false);
    }
  };

  const customTrigger =
    trigger ?? (isValidElement(children) ? (children as ReactElement) : null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {customTrigger ? (
        <DialogTrigger render={customTrigger} />
      ) : (
        <DialogTrigger
          render={
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background/80 px-4 py-2.5 text-start shadow-2xs backdrop-blur-xs transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                triggerClassName,
              )}
              aria-label={triggerLabel ?? t("view")}
            >
              <Receipt className="size-4 shrink-0 text-primary-700 dark:text-primary-400" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t("view")}
                </span>
                <span className="text-xs font-semibold text-foreground sm:text-sm">
                  {t("viewShort")}
                </span>
              </div>
            </button>
          }
        />
      )}

      <DialogContent
        showCloseButton
        className="flex max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-md flex-col gap-0 overflow-hidden rounded-2xl border-border bg-card p-0 shadow-xl sm:max-w-md"
      >
        <DialogHeader className="print:hidden border-b border-border/60 bg-muted/25 px-4 py-3.5 sm:px-5 sm:py-4">
          <DialogTitle className="pe-8 text-sm font-semibold text-foreground sm:text-base">
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto bg-muted/30 px-4 py-5 sm:px-6">
          <OrderReceipt
            ref={receiptRef}
            order={order}
            paymentLabel={paymentLabel}
          />
        </div>

        <DialogFooter className="print:hidden mx-0 mb-0 flex-row flex-wrap items-center justify-end gap-2 rounded-b-2xl border-t border-border/60 bg-muted/40 p-3 sm:p-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => handlePrint()}
          >
            <Printer className="size-3.5" aria-hidden />
            {t("print")}
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            className="gap-1.5"
            disabled={isDownloading}
            onClick={handleDownload}
          >
            {isDownloading ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
              <Download className="size-3.5" aria-hidden />
            )}
            {isDownloading ? t("downloading") : t("download")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
