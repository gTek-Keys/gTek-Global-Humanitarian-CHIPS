export default function VideoEmbed() {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-yellow-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🎬 Experience the Blueprint in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how visionary concepts are transformed into digital monuments through
            the Saqqara-Giza framework. From Djoser to Imhotep—see the process unfold.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-amber-900 to-yellow-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🎥</div>
                <h3 className="text-2xl font-bold mb-2">Blueprint Overview</h3>
                <p className="text-lg opacity-90">15-minute comprehensive walkthrough</p>
                <button className="mt-4 bg-white text-amber-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Watch Now
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">What You&apos;ll Learn</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  How to capture and crystallize visionary concepts
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  Technical foundations for eternal digital monuments
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  Multimedia integration and global distribution
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  Analytics, scaling, and legacy preservation
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Video Chapters</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium">Introduction to Saqqara-Giza</span>
                  <span className="text-sm text-gray-500">0:00-2:30</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium">The 10-Point Framework</span>
                  <span className="text-sm text-gray-500">2:30-8:45</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium">Live Implementation Demo</span>
                  <span className="text-sm text-gray-500">8:45-12:15</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Commission Your Vision</span>
                  <span className="text-sm text-gray-500">12:15-15:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              📚 Complete Resource Library
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Access the full blueprint documentation, templates, checklists, and implementation guides.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition">
                Download Blueprint PDF
              </button>
              <button className="border-2 border-amber-600 text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition">
                Access Resource Library
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}