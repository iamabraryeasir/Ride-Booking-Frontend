import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface IProps {
  children: ReactNode;
}

export default function CommonPublicLayout({ children }: IProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
      </main>
      <Footer />
    </>
  );
}
