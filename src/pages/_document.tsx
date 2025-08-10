// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <title>
          Baila Kids
        </title>
      <Head>
        
        {/* Browser tab icon */}
        <link rel="icon" href="/bailakids/logo.png" type="image/png" />
        {/* Optional: If you want high-res Apple touch icon */}
        <link rel="apple-touch-icon" href="/bailakids/logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
