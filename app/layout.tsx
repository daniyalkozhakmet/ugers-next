import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ImportBsJS from "./components/ImportBsJS";
import Navbar from "./components/Navbar";
import Provider from "./context/Provider";
import StoreProvider from "./StoreProvider";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "АЖК   | ASFALT_NEW",
  description: "АЖК   | ASFALT_NEW",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StoreProvider>
        <Provider>
          <ImportBsJS />
          <Navbar />
          <body className="custom-container">{children}</body>
        </Provider>
      </StoreProvider>
    </html>
  );
}
