import { useState } from "react";
import { AdminLogin } from "./AdminLogin";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "1");

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return <>{children}</>;
}
