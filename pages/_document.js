import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Urbanist from Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      <body className="font-urbanist">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
