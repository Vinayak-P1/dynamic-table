// app/layout.tsx
import "./globals.css";
import { Providers } from "@/redux/Providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dynamic Data Table Manager",
  description: "Next.js + Redux + MUI | Import/Export, Search, Sort, Pagination",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
