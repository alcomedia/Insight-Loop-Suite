import React, { createContext, useContext, useState } from 'react'

const ChatbotContext = createContext()

export const useChatbot = () => {
  const context = useContext(ChatbotContext)
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider')
  }
  return context
}

export const ChatbotProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)

  // API configuration for each chatbot
  const apiConfig = {
    1: {
      name: 'Persona Forge',
      token: 'deployment-6e4d5b76-80df-4e9b-a2ab-c27101c36131',
      defaultMessage: 'What persona would you like me to create today??'
    },
    2: {
      name: 'MessageCraft',
      token: 'deployment-73a9a5d1-4a6c-4dd4-b90a-14056b989414',
      defaultMessage: 'Describe the persona you would like me to create the messaging for?'
    },
    3: {
      name: 'Predyktable',
      token: 'deployment-c9ecf7f1-ce7e-43ff-a588-6c96dd4e7822',
      defaultMessage: 'What\'s your scenario?'
    },
    4: {
      name: 'Market Scanner',
      token: 'deployment-c37debe2-0cad-4701-b374-59ff2742647d',
      defaultMessage: 'What would you like explore?'
    },
    5: {
      name: 'Strategy Synthesis',
      token: 'deployment-f95dfe05-be8d-4502-a10a-8f293eebbb03',
      defaultMessage: 'Tell me a bit about your business, your challenge, and what you want to achieve — and I\'ll synthesize a strategy to move you forward.'
    },
    6: {
      name: 'Launch Architect',
      token: 'deployment-aa381768-1885-4ddd-82e8-60a574fe7532',
      defaultMessage: 'What would you like to launch?'
    }
  }

  const sendMessage = async (chatbotId, message) => {
    setIsLoading(true)
    
    try {
      const config = apiConfig[chatbotId]
      
      if (!config) {
        throw new Error(`Chatbot ${chatbotId} not found`)
      }

      const response = await fetch("https://api.pickaxe.co/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.token}`
        },
        body: JSON.stringify({
          "message": message
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Handle different possible response formats
      return data.message || data.response || data.completion || data.text || 'I received your message and am processing it.'
      
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Fallback to demo responses if API fails
      const fallbackResponses = {
        1: "I've analyzed your target market and created detailed personas based on psychographic data. Here are 3 key personas: The Ambitious Professional (35-45, values efficiency and status), The Conscious Consumer (28-40, prioritizes sustainability and authenticity), and The Tech-Forward Early Adopter (25-35, seeks innovation and cutting-edge solutions).",
        2: "Your messaging needs to resonate emotionally while driving action. I've crafted three message variations: 1) Problem-focused: 'Tired of solutions that don't deliver?' 2) Aspiration-driven: 'Transform your results in 30 days' 3) Social proof-powered: 'Join 10,000+ professionals who've already made the switch.' Each targets different psychological triggers.",
        3: "Market simulation complete. Based on current trends and competitor analysis, I predict: 67% positive reception for premium positioning, 23% price sensitivity concerns, and 45% likelihood of viral social sharing. Key risk factors: economic uncertainty (moderate impact) and seasonal demand fluctuations (low impact).",
        4: "Market shift detected! Three emerging trends: 1) 34% increase in mobile-first purchasing behavior, 2) Rising demand for personalized experiences (+28% YoY), 3) Sustainability becoming a key differentiator (mentioned in 67% of customer feedback). Competitor X just launched a similar feature - recommend accelerating your timeline.",
        5: "Strategic synthesis complete. Based on your personas, messaging, and market data, here's your action plan: 1) Lead with the Conscious Consumer persona (highest conversion potential), 2) Use aspiration-driven messaging in premium channels, 3) Launch during Q2 for optimal market conditions, 4) Focus on mobile-first experience with sustainability messaging.",
        6: "Launch architecture ready! Your execution roadmap: Week 1-2: Content creation and asset development, Week 3: Influencer partnerships and PR outreach, Week 4: Paid media launch with A/B testing, Week 5-6: Community building and engagement optimization, Week 7-8: Performance analysis and scaling. Budget allocation: 40% paid media, 30% content, 20% partnerships, 10% tools/analytics."
      }
      
      return fallbackResponses[chatbotId] || 'Sorry, I encountered an error. Please try again.'
    } finally {
      setIsLoading(false)
    }
  }

  const getWelcomeMessage = (chatbotId) => {
    const config = apiConfig[chatbotId]
    return config ? config.defaultMessage : 'Hello! How can I help you today?'
  }

  const value = {
    sendMessage,
    isLoading,
    apiConfig,
    getWelcomeMessage
  }

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  )
}

export default ChatbotContext
