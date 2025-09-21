export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-amber-50 to-yellow-100 py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="mb-8">
          <span className="text-6xl mb-4 block">🏛️</span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Architect Your Digital Pyramid with the
            <span className="text-amber-600 block mt-2">Saqqara-Giza Blueprint</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform visionary concepts into eternal digital monuments. From Djoser to Imhotep—manifest
            architectural dreams in the modern world with legendary precision and Rhodium-backed commissions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button className="bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-700 transition shadow-lg">
            Download Complete Blueprint
          </button>
          <button className="border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-50 transition">
            Commission Your Vision
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Visionary as Djoser</h3>
            <p className="text-gray-600">You bring the architectural vision, we provide the master craftsmanship</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Polymath as Imhotep</h3>
            <p className="text-gray-600">Legendary precision in interpreting and manifesting your digital monuments</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
            <div className="text-3xl mb-4">💎</div>
            <h3 className="text-xl font-semibold mb-2">Rhodium Collateral</h3>
            <p className="text-gray-600">Every commission backed by precious metal stability and Iron Rule guarantees</p>
          </div>
        </div>
      </div>
    </section>
  );
}