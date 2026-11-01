import { siteUrl } from "@/constants/data";
import { MetadataRoute } from "next";

const pages: {
  path: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/ourTeam", changeFrequency: "monthly", priority: 0.7 },
  { path: "/factory", changeFrequency: "monthly", priority: 0.7 },
  { path: "/partner", changeFrequency: "monthly", priority: 0.7 },
  { path: "/projects", changeFrequency: "monthly", priority: 0.6 },
  { path: "/greeting/director", changeFrequency: "monthly", priority: 0.5 },
  { path: "/greeting/engineering", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
