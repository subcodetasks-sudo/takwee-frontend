import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { FloatingWhatsAppButton } from "@/components/common/FloatingWhatsAppButton";

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  );
}

