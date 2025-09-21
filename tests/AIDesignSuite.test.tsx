import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIDesignSuite from '../src/components/AIDesignSuite';

// Mock fetch
global.fetch = jest.fn();

describe('AIDesignSuite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', () => {
    render(<AIDesignSuite />);
    expect(screen.getByText('gTek AI Design Suite')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Design a dashboard for Web3 portfolio visualization...')).toBeInTheDocument();
  });

  it('updates prompt on input change', () => {
    render(<AIDesignSuite />);
    const textarea = screen.getByPlaceholderText('e.g. Design a dashboard for Web3 portfolio visualization...');
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    expect(textarea).toHaveValue('Test prompt');
  });

  it('disables button when prompt is empty', () => {
    render(<AIDesignSuite />);
    const button = screen.getByText('Generate Design');
    expect(button).toBeDisabled();
  });

  it('enables button when prompt is not empty', () => {
    render(<AIDesignSuite />);
    const textarea = screen.getByPlaceholderText('e.g. Design a dashboard for Web3 portfolio visualization...');
    const button = screen.getByText('Generate Design');
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    expect(button).not.toBeDisabled();
  });

  it('shows loading state during generation', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ output: 'Generated design' }),
    });

    render(<AIDesignSuite />);
    const textarea = screen.getByPlaceholderText('e.g. Design a dashboard for Web3 portfolio visualization...');
    const button = screen.getByText('Generate Design');

    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    fireEvent.click(button);

    expect(screen.getByText('Generating...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Generate Design')).toBeInTheDocument();
    });
  });

  it('displays result after successful generation', async () => {
    const mockResponse = { output: 'Generated design content' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    render(<AIDesignSuite />);
    const textarea = screen.getByPlaceholderText('e.g. Design a dashboard for Web3 portfolio visualization...');
    const button = screen.getByText('Generate Design');

    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('AI Output')).toBeInTheDocument();
      expect(screen.getByText(JSON.stringify(mockResponse, null, 2))).toBeInTheDocument();
    });
  });

  it('displays error message on failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<AIDesignSuite />);
    const textarea = screen.getByPlaceholderText('e.g. Design a dashboard for Web3 portfolio visualization...');
    const button = screen.getByText('Generate Design');

    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('AI Output')).toBeInTheDocument();
      expect(screen.getByText(JSON.stringify({ output: '⚠️ Error generating design.' }, null, 2))).toBeInTheDocument();
    });
  });
});