import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { auth } from "@/services/firebase";
import { signOut } from "firebase/auth";

import { useAuthUserFirebase } from "@/store/authUser.store";

import { Bell, GitBranch, Github, LogOut } from "lucide-react";

type NavbarPropsType = {
  photoURL: string | null | undefined;
  displayName: string;
  handle: string;
  username: string | undefined;
};

export function Navbar({
  photoURL,
  displayName,
  handle,
  username,
}: NavbarPropsType) {
  // Sistema de rotas geral da aplicação com e sem autenticação ativa
  const router = useRouter();
  const pathname = usePathname();

  // Variáveis do módulo de auth do Firebase
  const { setUser, setToken, setCredential } = useAuthUserFirebase();

  // Logoff da aplicação
  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setToken(undefined);
    setCredential(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/6 bg-[#080810]/80 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between px-10 py-5">
        {/* Logo clicável */}
        <a
          href="/dashboard"
          className="flex cursor-pointer items-center gap-2.5"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600">
            <GitBranch className="size-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">DevTrack</span>
        </a>

        {/* Nav links */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-1 md:flex">
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Portfólio", href: "/tools/portfoliogen" },
            { label: "Currículos", href: "#" },
            { label: "Score", href: "#" },
            { label: "Entrevistas", href: "#" },
            { label: "Premium", href: "/premium/gopremium" },
          ].map((item) => {
            const isActive = pathname === item.href;

            return (
              <a
                key={item.label}
                href={item.href}
                className={`cursor-pointer rounded-md px-5 py-2.5 text-base font-medium transition-colors ${
                  isActive
                    ? "bg-white/8 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="relative flex size-10 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-blue-500" />
          </button>

          {/* Divider */}
          <div className="h-7 w-px bg-white/10" />

          {/* User info */}
          <div className="flex items-center gap-3">
            {photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoURL}
                alt={displayName}
                className="size-9 rounded-full object-cover ring-1 ring-white/10"
              />
            ) : (
              <div className="flex size-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {displayName[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-base font-medium leading-none text-white">
                {displayName}
              </p>
              <p className="mt-0.5 text-sm text-zinc-500">@{handle}</p>
            </div>
          </div>

          {/* GitHub link */}
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden size-10 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white sm:flex"
          >
            <Github className="size-5" />
          </a>

          {/* Sign out */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden cursor-pointer gap-1.5 text-sm text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400 sm:flex"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
