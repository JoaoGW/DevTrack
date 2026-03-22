import { useRouter } from "next/navigation";

import { PenLine } from "lucide-react";

export function EditProfile() {
  const router = useRouter();

  return (
    <button
      className="fixed bottom-10 right-10 rounded-full border-2 border-red-300 p-3 cursor-pointer"
      onClick={() => router.push("/tools/portfoliogen")}
    >
      <PenLine color="#c66c6c" />
    </button>
  );
}
