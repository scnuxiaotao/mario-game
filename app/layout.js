export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <title>马里奥第一关 DEMO</title>
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
