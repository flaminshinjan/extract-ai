# Extract AI - Content Summarizer

Extract AI is an application that allows users to input any public URL and extract content using AI to generate summaries and key points. The application leverages Claude Sonnet 3.7 for intelligent content extraction and summarization.

## Features

- Input any public URL to extract and summarize content
- Generate concise summaries and key points
- View content in a Notion-like table view
- Search and filter extracted content
- Store extraction history in the browser

## Technology Stack

- [Next.js](https://nextjs.org) - React framework
- [React](https://react.dev) - UI library
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Anthropic Claude API](https://anthropic.com/claude) - AI model
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Vercel](https://vercel.com) - Deployment

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Anthropic API key ([Get one here](https://www.anthropic.com/api))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/extract-ai.git
cd extract-ai
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

The application can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add your `ANTHROPIC_API_KEY` as an environment variable in the Vercel dashboard
4. Deploy!

## License

MIT
