import React from "react";

const ArticleWithSidebar = () => {
  // Sample YouTube videos data
  const youtubeVideos = [
    {
      id: "JGwWNGJdvx8",
      title: "Young Football Talent in Rwanda"
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Top Academy Prospects 2024"
    },
    {
      id: "9bZkp7q19f0",
      title: "Skills Training Techniques"
    },
    {
      id: "kJQP7kiw5Fk",
      title: "Scouting Combine Highlights"
    }
  ];

  // Sample advertisements
  const ads = [
    {
      id: 1,
      title: "Elite Talent Scout",
      description: "Discover Rwanda's next football stars with our verified youth player database and academy placement assistance.",
      highlights: [
        "500+ young players profiled",
        "Direct links to APR FC, Rayon Sports academies",
        "Free scouting reports"
      ],
      cta: "Join Our Network"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* Main Content - Video Card */}
      <main className="lg:w-2/3 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Football Talent Videos</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {youtubeVideos.map((video) => (
            <div key={video.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
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
                <h3 className="font-medium text-lg">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Sidebar with Advertisements */}
      <aside className="lg:w-1/3">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6 space-y-6">
          <h2 className="text-xl font-semibold mb-4">Talent Development</h2>
          {ads.map((ad) => (
            <div key={ad.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">{ad.title}</h3>
              <p className="text-gray-600 mb-3">{ad.description}</p>
              
              <ul className="text-sm text-gray-500 mb-4 space-y-2">
                {ad.highlights.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors w-full">
                {ad.cta}
              </button>
            </div>
          ))}

          {/* Newsletter Signup */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold mb-2">Get Scout Updates</h3>
            <p className="text-sm text-gray-600 mb-3">Receive weekly talent spotlights directly to your inbox</p>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md mb-2"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded w-full">
              Subscribe
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ArticleWithSidebar;