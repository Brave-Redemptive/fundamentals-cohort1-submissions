import type React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="min-h-[50dvh]">{children}</div>
    </>
  );
};

export default Layout;
