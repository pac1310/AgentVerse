# OneAI Platform

OneAI is an AI Agent Discovery Platform that helps users find, register, and understand various AI agents.

## Features

- **Discover AI Agents**: Browse through a categorized collection of AI agents
- **Detailed Agent Information**: View comprehensive details about each agent
- **Agent Registration**: Submit new AI agents to the platform
- **Global Search**: Search for agents across the platform
- **Admin Tools**: Manage and enhance agent descriptions

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/pac1310/AgentVerse.git
   cd AgentVerse
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create an environment file:
   Create a `.env.local` file in the root directory with the following content:
   ```
   VITE_HUGGING_FACE_API_KEY=your_hugging_face_api_key_here
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase
- **AI Integration**: Hugging Face Inference API
- **Bundler**: Vite

## Recent Enhancements

- Added Admin Tools section with ability to generate detailed agent descriptions
- Implemented global search functionality
- Enhanced agent discovery with categorization and filtering
- Made the sidebar collapsible for better user experience

## License

MIT 