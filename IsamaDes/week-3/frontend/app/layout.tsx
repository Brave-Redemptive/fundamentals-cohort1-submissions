import './globals.css';
import { Toaster } from "react-hot-toast";


export const metadata = {
  title: "To-Do App",
  description: "A simple todo application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <Toaster position="top-right" />
        {children}</body>
    </html>
  );
}
