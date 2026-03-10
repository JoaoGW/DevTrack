import { AuthRoute } from "@/routes/auth.route";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRoute>{children}</AuthRoute>;
}
