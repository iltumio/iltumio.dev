import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { getAllPosts, type BlogPost } from "~/lib/blog";
import CompactHeader from "~/components/compact-header/compact-header";

export const useBlogPosts = routeLoader$(async () => {
  return await getAllPosts();
});

export default component$(() => {
  const posts = useBlogPosts();
  
  const gridCols = posts.value.length >= 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
    : posts.value.length === 2 ? "grid-cols-1 md:grid-cols-2" 
    : "grid-cols-1";

  return (
    <main class="bg-gray-50 dark:bg-gray-950 min-h-screen flex flex-col items-center transition-colors duration-300">
      <div class="w-full max-w-5xl px-6 lg:px-8 py-8 lg:py-16">
        <CompactHeader showBlogLink={true} />
        
        <section class="w-full">
          <div class="mb-12 text-center md:text-left">
            <h1 class="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Blog</h1>
            <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
              Thoughts, insights, and updates from my journey in Web3 and blockchain engineering.
            </p>
          </div>

          {posts.value.length === 0 ? (
            <div class="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <p class="text-gray-500 dark:text-gray-400 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div class={`grid ${gridCols} gap-8`}>
              {posts.value.map((post: BlogPost) => (
                <article
                  key={post.slug}
                  class="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-purple-100 dark:hover:border-purple-900/30 transition-all duration-300 overflow-hidden"
                >
                  <a href={`/blog/${post.slug}`} class="flex flex-col h-full p-6">
                    <div class="flex-1">
                      <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {post.description && (
                        <p class="text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                          {post.description}
                        </p>
                      )}
                    </div>
                    <div class="mt-6 flex items-center text-purple-600 dark:text-purple-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                      Read more &rarr;
                    </div>
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Blog | Manuel Tumiati",
  meta: [
    {
      name: "description",
      content: "Blog posts about Web3, blockchain engineering, and digital identity.",
    },
  ],
};
