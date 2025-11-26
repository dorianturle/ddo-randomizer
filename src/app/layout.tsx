import { DarkThemeToggle, ThemeModeScript } from "flowbite-react";
import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
      <html lang="en" suppressHydrationWarning>
        <head>
            <title>DDO Class Randomizer</title>
            <ThemeModeScript/>
        </head>
        <body className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white min-w-fit">
            <div className={"flex justify-end"}>
                <DarkThemeToggle/>
            </div>
            { children }
        </body>
      </html>
  );
}
