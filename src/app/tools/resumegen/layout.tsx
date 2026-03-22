import { AuthRoute } from "@/routes/auth.route";

export default function ResumeGenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRoute>{children}</AuthRoute>;
}
