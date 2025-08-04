# Insight Loop Suite

A professional wrapper for 6 chained GPT chatbots that provides both individual access and guided flow experience.

## Features

- **Individual Chatbot Access**: Use any of the 6 specialized chatbots independently
- **Guided Flow**: Step-by-step walkthrough of all chatbots in sequence
- **Professional UI**: Modern, responsive design with smooth animations
- **Real-time Chat**: Interactive chat interface with typing indicators
- **Progress Tracking**: Visual progress indicators for guided flow
- **API Integration**: Ready for your chatbot API endpoints

## Chatbots

1. **Persona Forge** - Craft deeply human personas from real psychographics and market signals
2. **MessageCraft** - Language that lands. Messaging that moves
3. **Predyktable** - Simulate Market Reactions to Any Scenario
4. **Market Scanner** - Stay ahead. See what's shifting
5. **Strategy Synthesis** - From insights to impact — instantly
6. **Launch Architect** - Your all-in-one marketing execution engine

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your chatbot API endpoints:
   ```
   VITE_CHATBOT_1_API=https://your-api-domain.com/persona-forge
   VITE_CHATBOT_2_API=https://your-api-domain.com/messagecraft
   # ... etc
   ```

4. Start development server:
   ```bash
   pnpm run dev
   ```

## API Integration

The application expects your chatbot APIs to:

- Accept POST requests with JSON body: `{ message, chatbotId, timestamp }`
- Return JSON response with: `{ message }` or `{ response }`
- Handle CORS for browser requests

Example API endpoint structure:
```javascript
POST /persona-forge
{
  "message": "User's message here",
  "chatbotId": 1,
  "timestamp": "2024-01-01T00:00:00.000Z"
}

Response:
{
  "message": "Chatbot's response here"
}
```

## Usage

### Individual Access
- Navigate to any chatbot from the dashboard
- Chat directly with the specialized AI
- Each chatbot maintains its own conversation context

### Guided Flow
- Click "Start Guided Flow" from dashboard
- Follow the structured 6-step process
- Complete each step before moving to the next
- Track progress with visual indicators

## Customization

- Update chatbot names and descriptions in component files
- Modify API integration in `src/context/ChatbotContext.jsx`
- Customize styling in `tailwind.config.js` and component files
- Add authentication or user management as needed

## Technologies

- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Axios for API requests
- Lucide React for icons
