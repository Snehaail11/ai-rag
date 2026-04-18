# AI RAG Template

A Next.js-based template for building AI-powered Retrieval-Augmented Generation (RAG) applications. This project provides a foundation for creating chatbots or query systems that combine document retrieval with large language models to generate contextually relevant responses.

## Features

- **Query Interface**: Interactive forms for submitting queries and viewing responses
- **Document Retrieval**: Integration with Supabase for storing and retrieving documents
- **Embeddings**: Support for generating and using embeddings for semantic search
- **LLM Integration**: Configurable support for OpenAI and Hugging Face models
- **Logging**: API endpoint for logging interactions
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase
- **AI Services**: OpenAI, Hugging Face
- **Development**: ESLint, PostCSS

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-rag-template
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
   HF_API_KEY=your_hugging_face_api_key
   ```
   Note: OpenAI API key can be added if using OpenAI models.

4. Configure your Supabase database with appropriate tables for documents and logs.

## Usage

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

3. Use the query form to submit questions. The system will retrieve relevant documents from Supabase and generate responses using the configured LLM.

## Project Structure

- `app/`: Next.js app directory with pages and API routes
  - `api/logs/`: Endpoint for logging interactions
  - `api/query/`: Endpoint for processing queries
- `components/`: React components (LogForm, QueryForm, ResponseBox)
- `lib/`: Utility functions for embeddings, LLM, prompts, retrieval, and Supabase integration
- `public/`: Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
