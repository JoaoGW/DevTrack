import { AuthRoute } from "@/routes/auth.route";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRoute>{children}</AuthRoute>;
}
