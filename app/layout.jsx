import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";

export default function MainLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta charSet="UTF-8" />
          <title>Job Goblin</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
          <meta name="description" content="Interview prep and coaching tool" />
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </head>
        <body className="h-full bg-white dark:bg-secondary-800">
          <ThemeProvider attribute="class" enableSystem={false}>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
