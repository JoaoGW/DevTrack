import { AuthRoute } from "@/routes/auth.route";

export default function AnalyzerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRoute>{children}</AuthRoute>;
}
