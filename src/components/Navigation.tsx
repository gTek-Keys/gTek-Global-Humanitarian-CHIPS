export default function Navigation({
  activeSection,
  setActiveSection
}: {
  activeSection: string;
  setActiveSection: (section: string) => void;
}) {
  return (
    <nav className="bg-gradient-to-r from-amber-900 to-yellow-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl">
              <span className="text-2xl">🏛️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Saqqara-Giza Blueprint</h1>
              <p className="text-sm opacity-90">Polymath Vizier Services</p>
            </div>
          </div>
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => setActiveSection('home')}
              className={`hover:text-amber-200 transition ${activeSection === 'home' ? 'text-amber-200 font-semibold' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveSection('blueprint')}
              className={`hover:text-amber-200 transition ${activeSection === 'blueprint' ? 'text-amber-200 font-semibold' : ''}`}
            >
              Blueprint
            </button>
            <button
              onClick={() => setActiveSection('multimedia')}
              className={`hover:text-amber-200 transition ${activeSection === 'multimedia' ? 'text-amber-200 font-semibold' : ''}`}
            >
              Multimedia
            </button>
            <button
              onClick={() => setActiveSection('distribution')}
              className={`hover:text-amber-200 transition ${activeSection === 'distribution' ? 'text-amber-200 font-semibold' : ''}`}
            >
              Distribution
            </button>
            <button
              onClick={() => setActiveSection('commissions')}
              className={`hover:text-amber-200 transition ${activeSection === 'commissions' ? 'text-amber-200 font-semibold' : ''}`}
            >
              Commissions
            </button>
            <button
              onClick={() => setActiveSection('legal')}
              className={`hover:text-amber-200 transition ${activeSection === 'legal' ? 'text-amber-200 font-semibold' : ''}`}
            >
              Legal
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}