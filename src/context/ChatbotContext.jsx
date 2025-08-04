import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'

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
  const [apiEndpoints, setApiEndpoints] = useState({
    1: '', // Persona Forge API endpoint
    2: '', // MessageCraft API endpoint
    3: '', // Predyktable API endpoint
    4: '', // Market Scanner API endpoint
    5: '', // Strategy Synthesis API endpoint
    6: '', // Launch Architect API endpoint
  })

  const sendMessage = async (chatbotId, message) => {
    setIsLoading(true)
    
    try {
      // Check if API endpoint is configured
      const endpoint = apiEndpoints[chatbotId]
      
      if (!endpoint) {
        // Simulate API response for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
        
        const responses = {
          1: "I've analyzed your target market and created detailed personas based on psychographic data. Here are 3 key personas: The Ambitious Professional (35-45, values efficiency and status), The Conscious Consumer (28-40, prioritizes sustainability and authenticity), and The Tech-Forward Early Adopter (25-35, seeks innovation and cutting-edge solutions).",
          2: "Your messaging needs to resonate emotionally while driving action. I've crafted three message variations: 1) Problem-focused: 'Tired of solutions that don't deliver?' 2) Aspiration-driven: 'Transform your results in 30 days' 3) Social proof-powered: 'Join 10,000+ professionals who've already made the switch.' Each targets different psychological triggers.",
          3: "Market simulation complete. Based on current trends and competitor analysis, I predict: 67% positive reception for premium positioning, 23% price sensitivity concerns, and 45% likelihood of viral social sharing. Key risk factors: economic uncertainty (moderate impact) and seasonal demand fluctuations (low impact).",
          4: "Market shift detected! Three emerging trends: 1) 34% increase in mobile-first purchasing behavior, 2) Rising demand for personalized experiences (+28% YoY), 3) Sustainability becoming a key differentiator (mentioned in 67% of customer feedback). Competitor X just launched a similar feature - recommend accelerating your timeline.",
          5: "Strategic synthesis complete. Based on your personas, messaging, and market data, here's your action plan: 1) Lead with the Conscious Consumer persona (highest conversion potential), 2) Use aspiration-driven messaging in premium channels, 3) Launch during Q2 for optimal market conditions, 4) Focus on mobile-first experience with sustainability messaging.",
          6: "Launch architecture ready! Your execution roadmap: Week 1-2: Content creation and asset development, Week 3: Influencer partnerships and PR outreach, Week 4: Paid media launch with A/B testing, Week 5-6: Community building and engagement optimization, Week 7-8: Performance analysis and scaling. Budget allocation: 40% paid media, 30% content, 20% partnerships, 10% tools/analytics."
        }
        
        return responses[chatbotId] || "Thank you for your message. I'm processing your request and will provide insights based on my specialized knowledge."
      }
      
      // Make actual API call when endpoint is configured
      const response = await axios.post(endpoint, {
        message,
        chatbotId,
        timestamp: new Date().toISOString()
      })
      
      return response.data.message || response.data.response || 'I received your message and am processing it.'
      
    } catch (error) {
      console.error('Error sending message:', error)
      throw new Error('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateApiEndpoint = (chatbotId, endpoint) => {
    setApiEndpoints(prev => ({
      ...prev,
      [chatbotId]: endpoint
    }))
  }

  const value = {
    sendMessage,
    isLoading,
    apiEndpoints,
    updateApiEndpoint
  }

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  )
}

export default ChatbotContext
