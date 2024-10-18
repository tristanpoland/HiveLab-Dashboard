import { SidebarDemo } from "./components/SidebarLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
        <head>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
            <div className="min-h-screen bg-background">
              <SidebarDemo>
                <main>{children}</main>
              </SidebarDemo>
            </div>
        </body>
    </html>
  );
}