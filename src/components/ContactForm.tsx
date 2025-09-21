'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    vision: '',
    timeline: '',
    budget: '',
    rhodiumCollateral: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Commission request submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ⚡ Commission Your Vision
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to transform your architectural vision into a digital monument?
            Submit your commission request and let&apos;s begin the legendary journey.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-lg p-8 border border-amber-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="vision" className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your Vision *
              </label>
              <textarea
                id="vision"
                name="vision"
                required
                rows={6}
                value={formData.vision}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Tell us about your architectural vision. What digital monument do you want to build? What problem are you solving? What impact do you want to create?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Timeline
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Select timeline</option>
                  <option value="1-3-months">1-3 months</option>
                  <option value="3-6-months">3-6 months</option>
                  <option value="6-12-months">6-12 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Select budget range</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="100k-plus">$100,000+</option>
                  <option value="discuss">Let&apos;s discuss</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rhodiumCollateral"
                name="rhodiumCollateral"
                checked={formData.rhodiumCollateral}
                onChange={handleChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="rhodiumCollateral" className="ml-2 block text-sm text-gray-700">
                I agree to Rhodium-backed collateralization for this commission (Iron Rule requirement)
              </label>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 mb-2">⚖️ Iron Rule Agreement</h4>
              <p className="text-sm text-amber-800">
                By submitting this commission request, you acknowledge that all services are delivered by commission
                or charitable donation only. No hire agreements accepted. All commissions are collateralized in Rhodium
                and handled one vision at a time with legendary precision.
              </p>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-700 transition shadow-lg"
              >
                Submit Commission Request
              </button>
              <p className="text-sm text-gray-500 mt-4">
                We&apos;ll respond within 24 hours with a detailed proposal and Rhodium collateralization terms.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}