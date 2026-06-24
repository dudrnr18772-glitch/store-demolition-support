import type { Metadata, Viewport } from "next";
import { CONSULT_FORM_URL, SITE_URL } from "../lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "소상공인 폐업지원금 점포 철거비 상담 | 철거 원상복구",
  description:
    "폐업 예정 또는 폐업한 소상공인을 위한 점포 철거비 지원 가능 여부 확인과 폐업 철거, 임대차 원상복구 상담을 안내합니다.",
  verification: {
    google: "rreeR_wyCoqw2z7nCk7X6Alq5HTTFEgx4gVcrMeJAbw",
    other: {
      "naver-site-verification": "aa358a00ab6c7fcbfab087d807e9c446eb8585a9",
      "msvalidate.01": "7CC2274F4DAA4C8A93EB5F4D8259E6A3",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <a className="site-brand" href="/" aria-label="메인페이지로 이동">
              <span className="site-brand-mark" aria-hidden="true">
                복구
              </span>
              <span>점포 철거 원상복구 상담</span>
            </a>
            <a
              className="site-header-cta"
              href={CONSULT_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              상담 신청
            </a>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
