import { useState } from "react";

import { useAuthUserFirebase } from "@/store/authUser.store";

import { Share2, TriangleAlert } from "lucide-react";

export function PreviewInfo() {
  const { user } = useAuthUserFirebase();

  const [isCopied, setIsCopied] = useState(false);

  const copyTextToClipboard = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const urlBase =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_DEV_URL;

  return (
    <section className="w-full h-24 flex flex-row items-center justify-between bg-red-800 px-20">
      <div className="flex flex-row items-center">
        <TriangleAlert color="white" size={50} />
        <span className="ml-5 font-bold text-2xl">Atenção!</span>
      </div>
      <span>Esta página é somente uma prévia</span>
      <div className="gap-5">
        <button
          className="flex flex-row justify-center cursor-pointer"
          onClick={() =>
            copyTextToClipboard(`${urlBase}/portfolio/${user?.uid}`)
          }
        >
          <Share2 className="mr-3" />
          {isCopied
            ? "Copiado para a área de transferência!"
            : "Link de compartilhamento"}
        </button>
      </div>
    </section>
  );
}
