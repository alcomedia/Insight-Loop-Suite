// API Configuration
// Update these endpoints with your actual chatbot API URLs

export const API_CONFIG = {
  chatbots: {
    1: {
      name: 'Persona Forge',
      endpoint: process.env.VITE_CHATBOT_1_API || '',
      description: 'Craft deeply human personas from real psychographics and market signals'
    },
    2: {
      name: 'MessageCraft',
      endpoint: process.env.VITE_CHATBOT_2_API || '',
      description: 'Language that lands. Messaging that moves'
    },
    3: {
      name: 'Predyktable',
      endpoint: process.env.VITE_CHATBOT_3_API || '',
      description: 'Simulate Market Reactions to Any Scenario'
    },
    4: {
      name: 'Market Scanner',
      endpoint: process.env.VITE_CHATBOT_4_API || '',
      description: 'Stay ahead. See what\'s shifting'
    },
    5: {
      name: 'Strategy Synthesis',
      endpoint: process.env.VITE_CHATBOT_5_API || '',
      description: 'From insights to impact — instantly'
    },
    6: {
      name: 'Launch Architect',
      endpoint: process.env.VITE_CHATBOT_6_API || '',
      description: 'Your all-in-one marketing execution engine'
    }
  }
}

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000
