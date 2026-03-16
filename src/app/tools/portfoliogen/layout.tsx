import { AuthRoute } from "@/routes/auth.route";

export default function PortfolioGenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRoute>{children}</AuthRoute>;
}
