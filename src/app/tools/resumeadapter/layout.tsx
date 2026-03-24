import { AuthRoute } from '@/routes/auth.route';

export default function ResumeAdapterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRoute>{children}</AuthRoute>;
}
