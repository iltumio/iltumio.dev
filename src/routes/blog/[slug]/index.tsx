import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { getPostBySlug, getAllSlugs } from "~/lib/blog";
import { notFound } from "@builder.io/qwik-city";
import CompactHeader from "~/components/compact-header/compact-header";

export const usePost = routeLoader$(async ({ params, status }) => {
  try {
    const post = await getPostBySlug(params.slug);
    return post;
  } catch (error) {
    status(404);
    throw notFound();
  }
});

export const usePostSlugs = routeLoader$(async () => {
  return await getAllSlugs();
});

export default component$(() => {
  const post = usePost();

  return (
    <main class="bg-gray-50 dark:bg-gray-950 min-h-screen flex flex-col items-center transition-colors duration-300">
      <div class="w-full max-w-5xl px-6 lg:px-8 py-8 lg:py-16">
        <CompactHeader showBlogLink={true} />
        
        <section class="w-full">
          <article class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12 transition-all duration-300">
            <header class="mb-10 border-b border-gray-100 dark:border-gray-800 pb-10">
              <nav class="mb-6">
                <a
                  href="/blog"
                  class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold transition-colors inline-flex items-center gap-2 text-sm"
                >
                  &larr; Back to Blog
                </a>
              </nav>
              <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
                {post.value.title}
              </h1>
              <div class="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                <time dateTime={post.value.date}>
                  {new Date(post.value.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </header>

            <div
              class="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white 
                prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline 
                prose-strong:text-gray-900 dark:prose-strong:text-white 
                prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-code:bg-purple-50 dark:prose-code:bg-purple-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:shadow-lg
                prose-img:rounded-xl prose-img:shadow-md"
              dangerouslySetInnerHTML={post.value.htmlContent}
            />
          </article>
        </section>
      </div>
    </main>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const post = resolveValue(usePost);
  if (!post) {
    return {
      title: "Post Not Found | Manuel Tumiati's Blog",
    };
  }
  return {
    title: `${post.title} | Manuel Tumiati's Blog`,
    meta: [
      {
        name: "description",
        content: post.description || post.title,
      },
    ],
  };
};
