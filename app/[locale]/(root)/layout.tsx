import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

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
    </>
  );
}
