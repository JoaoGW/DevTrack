import { notFound } from "next/navigation";

import { PortfolioData } from "@/components/ProfileTemplates/types";

import { MinimalistTemplate } from "@/components/ProfileTemplates/MinimalistTemplate";
import { ModernTemplate } from "@/components/ProfileTemplates/ModernTemplate";
import { TechTemplate } from "@/components/ProfileTemplates/TechTemplate";
import { TechTwoTemplate } from "@/components/ProfileTemplates/TechTwoTemplate";

type PortfolioPageURLParams = {
  userId: string;
};

async function fetchPortfolio(userId: string): Promise<PortfolioData | null> {
  let response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio?userId=${userId}`,
  );
  if (!response.ok) {
    response = await fetch(
      `http://localhost:3000/api/portfolio?userId=${userId}`,
    );
    if (!response.ok) {
      return null;
    }
  }
  const data = await response.json();
  return data.success ? data.data : null;
}

export default async function PortfolioPage({
  params,
}: {
  params: PortfolioPageURLParams;
}) {
  const { userId } = await params;
  const portfolio = await fetchPortfolio(userId);

  if (!portfolio) {
    notFound();
  }

  switch (portfolio.template) {
    case "minimalist":
      return <MinimalistTemplate portfolio={portfolio} />;
    case "modern":
      return <ModernTemplate portfolio={portfolio} />;
    case "tech":
      return <TechTemplate portfolio={portfolio} />;
    case "tech2":
      return <TechTwoTemplate portfolio={portfolio} />;
  }
}
