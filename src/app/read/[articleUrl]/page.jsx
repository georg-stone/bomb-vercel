import { extract } from "@extractus/article-extractor";

const ArticlePage = async ({ params }) => {
  const { articleUrl } = params;
  const decodedUrl = atob(decodeURIComponent(articleUrl.replaceAll("-", "/")));

  let content = "";
  let title = "";
  let datePublished = "";
  let author = "";
  let error = "";
  let isLoading = true;
  let ttr = 0;
  let image;

  try {
    const article = await extract(decodedUrl);
    title = article.title;
    datePublished = article.published;
    author = article.author;
    content = article.content;
    isLoading = false;
    ttr = article.ttr;
    image = article.image;
  } catch (err) {
    error = err.message;
    isLoading = false;
  }

  return (
    <div>
      <head>
        <title>{title}</title>
        <meta
          name="description"
          content={`Read article by ${author} on ${datePublished || ""}`}
        />
        <meta name="og:image" content={image || ""} />
      </head>
      <main className="max-w-4xl mx-auto p-4 bg-[#1D1E20] text-white rounded-lg mt-8">
        {isLoading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">An error occurred: {error}</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-gray-400 mb-4">
              <strong>By {author}</strong> |{" "}
              <em>{new Date(datePublished).toLocaleString()}</em>
              {ttr > 60 ? ` | ${(ttr - (ttr % 60)) / 60} min read` : ""}
            </p>
            <article
              className="prose lg:prose-xl"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default ArticlePage;