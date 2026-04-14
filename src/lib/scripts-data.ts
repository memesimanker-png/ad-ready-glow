export type Script = {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  game: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  trending: boolean;
  verified: boolean;
  code: string;
  faqs: { question: string; answer: string }[];
};

export const CATEGORIES = [
  "All",
  "Auto Farm",
  "ESP",
  "Aimbot",
  "Speed Hack",
  "Infinite Jump",
  "Kill Aura",
  "Admin",
  "Trolling",
  "Utility",
];
