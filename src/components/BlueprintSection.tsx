export default function BlueprintSection() {
  const blueprintPoints = [
    {
      number: 1,
      title: "Vision Capture & Analysis",
      description: "Extract and crystallize your architectural vision into actionable blueprints",
      icon: "🎯"
    },
    {
      number: 2,
      title: "Conceptual Architecture",
      description: "Design the foundational structure that will support your digital monument",
      icon: "🏗️"
    },
    {
      number: 3,
      title: "Technical Foundation",
      description: "Establish the technological bedrock for scalable, eternal construction",
      icon: "⚙️"
    },
    {
      number: 4,
      title: "Content Creation Pipeline",
      description: "Build automated systems for consistent, high-quality content production",
      icon: "🎨"
    },
    {
      number: 5,
      title: "Branding & Identity",
      description: "Forge an eternal brand identity that transcends time and trends",
      icon: "✨"
    },
    {
      number: 6,
      title: "Multimedia Integration",
      description: "Seamlessly weave video, audio, and interactive elements into your monument",
      icon: "🎬"
    },
    {
      number: 7,
      title: "Distribution Strategy",
      description: "Deploy your creation across global networks for maximum eternal reach",
      icon: "🌍"
    },
    {
      number: 8,
      title: "Analytics & Optimization",
      description: "Monitor, measure, and refine your monument's performance through eternity",
      icon: "📊"
    },
    {
      number: 9,
      title: "Scaling & Automation",
      description: "Implement systems that grow and maintain themselves through time",
      icon: "🚀"
    },
    {
      number: 10,
      title: "Legacy Preservation",
      description: "Ensure your digital pyramid stands eternal against the sands of time",
      icon: "💎"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            The 10-Point Saqqara-Giza Blueprint
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A legendary framework for transforming visionary concepts into eternal digital monuments,
            built upon the wisdom of ancient architects and modern innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blueprintPoints.map((point) => (
            <div key={point.number} className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{point.icon}</span>
                <div className="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  {point.number}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {point.title}
              </h3>
              <p className="text-gray-600">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Build Your Digital Pyramid?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join the exclusive circle of visionaries who commission their dreams into reality.
              Each project handled with legendary precision, one commission at a time.
            </p>
            <button className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Start Your Commission
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}