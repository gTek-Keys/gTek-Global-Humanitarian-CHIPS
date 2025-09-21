'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import BlueprintSection from '@/components/BlueprintSection';
import VideoEmbed from '@/components/VideoEmbed';
import ContactForm from '@/components/ContactForm';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      {activeSection === 'home' && (
        <>
          <Hero />
          <BlueprintSection />
          <VideoEmbed />
          <Testimonials />
          <ContactForm />
        </>
      )}

      {activeSection === 'blueprint' && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-12 text-amber-900">
            🏛️ The Complete Saqqara-Giza 10-Point Blueprint
          </h1>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-lg text-gray-700 mb-6">
              Download the complete blueprint and transform your vision into digital reality.
            </p>
            <button className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition">
              Download Full Blueprint (PDF)
            </button>
          </div>
        </div>
      )}

      {activeSection === 'multimedia' && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-12 text-amber-900">
            🎬 Multimedia Marketing & Branding
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">AI-Generated Assets</h3>
              <p className="text-gray-600">Professional logos, banners, and graphics created with cutting-edge AI tools.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Video Production</h3>
              <p className="text-gray-600">Cinematic content that brings your vision to life with professional editing and effects.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Social Media Campaigns</h3>
              <p className="text-gray-600">Strategic content distribution across all major platforms for maximum reach.</p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'distribution' && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-12 text-amber-900">
            🌍 Global Distribution Network
          </h1>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Worldwide Reach</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Multi-language localization</li>
                  <li>• CDN-optimized delivery</li>
                  <li>• Regional compliance</li>
                  <li>• Cultural adaptation</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Platform Integration</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Major streaming services</li>
                  <li>• Social media networks</li>
                  <li>• E-commerce platforms</li>
                  <li>• Educational institutions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'commissions' && <ContactForm />}

      {activeSection === 'legal' && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-12 text-amber-900">
            ⚖️ Iron Rule & Legal Framework
          </h1>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              <div className="border-l-4 border-amber-500 pl-6">
                <h3 className="text-xl font-semibold mb-2">Iron Rule #1</h3>
                <p className="text-gray-600">We are not for hire. All services delivered by commission or charitable donation only.</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-6">
                <h3 className="text-xl font-semibold mb-2">Iron Rule #2</h3>
                <p className="text-gray-600">Operations rooted in Sovereign Economic System with Humanitarian Commissions.</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-6">
                <h3 className="text-xl font-semibold mb-2">Iron Rule #3</h3>
                <p className="text-gray-600">Rhodium-backed collateralization for all commission arrangements.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
