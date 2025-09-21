import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Mock AI response - replace with actual AI integration
    const mockResponse = {
      output: `Generated design for: "${prompt}"\n\nLayout: Hero section with gradient background, navigation bar, and call-to-action button.\n\nComponents: Card grid for features, testimonial carousel, footer with links.\n\nColors: Primary cyan (#06b6d4), secondary slate (#64748b), accent sky (#0ea5e9).\n\nFonts: Inter for headings, system font for body.`,
      layout: {
        type: 'page',
        sections: [
          { type: 'hero', content: 'Welcome message' },
          { type: 'features', items: ['Feature 1', 'Feature 2', 'Feature 3'] },
          { type: 'cta', text: 'Get Started' }
        ]
      }
    };

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error generating design:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}