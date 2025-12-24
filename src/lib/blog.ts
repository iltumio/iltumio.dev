import { marked } from "marked";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  content: string;
  htmlContent: string;
}

// Use Vite's import.meta.glob to load markdown files at build time
// This works in Edge Functions since it's resolved during the build
const blogModules = import.meta.glob("/src/content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parsePost(slug: string, rawContent: string): BlogPost {
  const { data, content } = matter(rawContent);
  const htmlContent = marked.parse(content) as string;

  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    description: data.description,
    content,
    htmlContent,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  for (const [path, rawContent] of Object.entries(blogModules)) {
    const slug = path.replace("/src/content/blog/", "").replace(".md", "");
    posts.push(parsePost(slug, rawContent));
  }

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const path = `/src/content/blog/${slug}.md`;
  const rawContent = blogModules[path];

  if (!rawContent) {
    throw new Error(`Post not found: ${slug}`);
  }

  return parsePost(slug, rawContent);
}

export async function getAllSlugs(): Promise<string[]> {
  return Object.keys(blogModules).map((path) =>
    path.replace("/src/content/blog/", "").replace(".md", ""),
  );
}
