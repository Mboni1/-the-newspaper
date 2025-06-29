import React from "react";

const ArticleWithSidebar = () => {
  // Sample YouTube videos data
  const youtubeVideos = [
    {
      id: "JGwWNGJdvx8",
      title: "young talent"
    },
    {
      id: "JGwWNGJdvx8",
      title: "new talent"
    },
    {
      id: "JGwWNGJdvx8",
      title: "new talent"
    },
    {
      id: "JGwWNGJdvx8",
      title: "talent"
    }
  ];

  // Sample advertisements
  const ads = [
    {
      id: 1,
      title: "Serivisi yihariye",
      description: "Soma Amakuru witonze utabangamiwe na matangazo",
      cta: "Iyandikishe Nonaha"
    },
    {
      id: 2,
      title: "Amakuru ya buri munsi",
      description: "Komeza umenye amakuru yacu ya buri munsi",
      cta: "Iyandikishe ku buntu"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* Main Article Content */}
      <main className="lg:w-2/3">
        <article className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">Ufite Igitekerezo cg Inyunganizi ?</h1>
          <div className="prose max-w-none">
            <p>Twandikire hano </p>
            {/* Article content would be here */}
          </div>
        </article>

        {/* YouTube Videos Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Reba  Videos </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {youtubeVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-64"
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Sidebar with Advertisements */}
      <aside className="lg:w-1/3 space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <h2 className="text-xl font-semibold mb-4">Watugana  Tukakwamamariza</h2>
          {ads.map((ad) => (
            <div key={ad.id} className="mb-6 last:mb-0 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">{ad.title}</h3>
              <p className="text-gray-600 mb-3">{ad.description}</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
                {ad.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Guma Umenye Amakuru</h2>
          <p className="text-gray-600 mb-4">Iyandikishe kugirango uhore ubona 
            amakuru ya buri munsi.</p>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Iyandikishe
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
};

export default ArticleWithSidebar;