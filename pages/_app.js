// pages/_app.js
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
