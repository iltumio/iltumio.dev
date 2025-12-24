import { marked } from "marked";
import matter from "gray-matter";
import { readFile, readdir } from "fs/promises";
import { join } from "path";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  content: string;
  htmlContent: string;
}

const blogDir = join(process.cwd(), "src/content/blog");

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = await readdir(blogDir);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const slug = file.replace(/\.md$/, "");
        return await getPostBySlug(slug);
      }),
  );

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const filePath = join(blogDir, `${slug}.md`);
  const fileContents = await readFile(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const htmlContent = await marked.parse(content);

  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    description: data.description,
    content,
    htmlContent,
  };
}

export async function getAllSlugs(): Promise<string[]> {
  const files = await readdir(blogDir);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}
