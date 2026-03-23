import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export const prerender = true;

export async function GET(context: APIContext) {
  const now = new Date();
  const posts = await getCollection("blog", (post) => {
    return !post.data.draft && post.data.date <= now;
  });
  return rss({
    title: "Manuel Tumiati's Blog",
    description:
      "Thoughts, insights, and updates on Web3, blockchain engineering, and digital identity.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.slug}`,
    })),
  });
}
