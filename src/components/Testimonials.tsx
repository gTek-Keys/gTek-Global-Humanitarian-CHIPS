export default function Testimonials() {
  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "AI Research Director",
      company: "Future Institute",
      content: "The Polymath Vizier transformed our research vision into a comprehensive AI platform. The attention to detail and architectural precision was legendary.",
      avatar: "👩‍🔬",
      project: "AI Research Platform"
    },
    {
      name: "Marcus Rodriguez",
      role: "CEO",
      company: "Sustainable Ventures",
      content: "From Djoser to Imhotep—the blueprint process took our environmental vision and built it into a global movement. The Rhodium collateral gave us complete confidence.",
      avatar: "👨‍💼",
      project: "Sustainability Platform"
    },
    {
      name: "Dr. Aisha Patel",
      role: "Education Innovator",
      company: "Global Learning Network",
      content: "The digital monument created for our educational platform stands eternal. Every detail reflects the ancient wisdom of architectural perfection.",
      avatar: "👩‍🏫",
      project: "Educational Technology"
    },
    {
      name: "David Thompson",
      role: "Tech Entrepreneur",
      company: "Innovation Labs",
      content: "Working with the Polymath Vizier was like having Imhotep himself interpret my vision. The result exceeded every expectation and continues to scale beautifully.",
      avatar: "👨‍💻",
      project: "FinTech Innovation"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-yellow-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🌟 Visionary Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how Djoser visionaries have been transformed into eternal digital monuments
            through the Saqqara-Giza blueprint process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
              <div className="flex items-start mb-4">
                <div className="text-4xl mr-4">{testimonial.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      {testimonial.project}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{testimonial.role}</p>
                  <p className="text-sm text-amber-600 font-medium">{testimonial.company}</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">⭐</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto border border-amber-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              💎 Rhodium-Backed Guarantee
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold mb-2">Vision Realization</h4>
                <p className="text-sm text-gray-600">Every architectural vision transformed into tangible digital reality</p>
              </div>
              <div>
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-semibold mb-2">Legendary Precision</h4>
                <p className="text-sm text-gray-600">One commission at a time, with master architect-level attention to detail</p>
              </div>
              <div>
                <div className="text-3xl mb-2">💰</div>
                <h4 className="font-semibold mb-2">Rhodium Collateral</h4>
                <p className="text-sm text-gray-600">Precious metal-backed stability for all commission agreements</p>
              </div>
            </div>
            <div className="mt-6">
              <button className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition">
                Join the Visionary Circle
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}