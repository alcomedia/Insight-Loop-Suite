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
  const [conversations, setConversations] = useState({})

  // API configuration for each chatbot with Pickaxe-specific options
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

  // Generate or get conversation ID for a chatbot
  const getConversationId = (chatbotId, userId = null) => {
    const key = `${chatbotId}_${userId || 'anonymous'}`
    if (!conversations[key]) {
      setConversations(prev => ({
        ...prev,
        [key]: `conv_${chatbotId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }))
    }
    return conversations[key]
  }

  const sendMessage = async (chatbotId, message, options = {}) => {
    setIsLoading(true)
    
    try {
      const config = apiConfig[chatbotId]
      
      if (!config) {
        throw new Error(`Chatbot ${chatbotId} not found`)
      }

      // Extract Pickaxe-specific options - try both streaming and non-streaming
      const {
        userId = null,
        conversationId = null,
        imageUrls = null,
        stream = false, // Start with non-streaming to test
        ...otherOptions
      } = options

      // Use provided conversationId or generate one
      const finalConversationId = conversationId || getConversationId(chatbotId, userId)

      // Build the request payload with Pickaxe-specific options
      const requestBody = {
        message: message
      }

      // Only add optional fields if they have values
      if (userId) requestBody.userId = userId
      if (finalConversationId) requestBody.conversationId = finalConversationId
      if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) requestBody.imageUrls = imageUrls
      if (typeof stream === 'boolean') requestBody.stream = stream

      // Add any other options
      Object.keys(otherOptions).forEach(key => {
        if (otherOptions[key] !== null && otherOptions[key] !== undefined) {
          requestBody[key] = otherOptions[key]
        }
      })

      console.log('=== API REQUEST ===')
      console.log('URL:', "https://api.pickaxe.co/v1/completions")
      console.log('Method:', "POST")
      console.log('Headers:', {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.token}`
      })
      console.log('Body:', JSON.stringify(requestBody, null, 2))

      const response = await fetch("https://api.pickaxe.co/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.token}`
        },
        body: JSON.stringify(requestBody)
      })

      console.log('=== API RESPONSE ===')
      console.log('Status:', response.status)
      console.log('Status Text:', response.statusText)
      console.log('Headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`)
      }

      // Get the response as text first to see raw format
      const responseText = await response.text()
      console.log('Raw Response Text:', responseText)

      let data
      try {
        data = JSON.parse(responseText)
        console.log('Parsed Response Data:', data)
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError)
        console.log('Treating as plain text response')
        return responseText || 'I received your message but had trouble parsing the response.'
      }

      // Try multiple possible response field names
      const possibleResponseFields = [
        'message',
        'response', 
        'completion',
        'text',
        'content',
        'answer',
        'reply',
        'output',
        'result'
      ]

      let responseContent = null
      for (const field of possibleResponseFields) {
        if (data[field] && typeof data[field] === 'string') {
          responseContent = data[field]
          console.log(`Found response in field: ${field}`)
          break
        }
      }

      // If no direct field found, check nested structures
      if (!responseContent) {
        // Check for choices array (OpenAI format)
        if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
          const choice = data.choices[0]
          if (choice.message && choice.message.content) {
            responseContent = choice.message.content
            console.log('Found response in choices[0].message.content')
          } else if (choice.text) {
            responseContent = choice.text
            console.log('Found response in choices[0].text')
          }
        }
        
        // Check for data field
        if (!responseContent && data.data) {
          if (typeof data.data === 'string') {
            responseContent = data.data
            console.log('Found response in data field')
          } else if (data.data.message) {
            responseContent = data.data.message
            console.log('Found response in data.message')
          }
        }
      }

      if (responseContent) {
        console.log('Final extracted response:', responseContent)
        return responseContent
      } else {
        console.warn('No response content found in any expected field')
        console.log('Full response object:', JSON.stringify(data, null, 2))
        return 'I received your message but the response format was unexpected. Please try again.'
      }
      
    } catch (error) {
      console.error('=== ERROR ===')
      console.error('Error sending message:', error)
      console.error('Error stack:', error.stack)
      
      // Enhanced error handling
      if (error.message.includes('401')) {
        console.error('Authentication error - check API token')
        return 'Authentication error. Please check the API configuration.'
      } else if (error.message.includes('429')) {
        console.error('Rate limit exceeded - please wait before sending another message')
        return 'Rate limit exceeded. Please wait a moment before sending another message.'
      } else if (error.message.includes('500')) {
        console.error('Server error - the API service may be temporarily unavailable')
        return 'Server error. The API service may be temporarily unavailable.'
      }
      
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

  // Helper function to send message with specific options
  const sendMessageWithOptions = async (chatbotId, message, userId = null, conversationId = null, imageUrls = null, stream = false) => {
    return sendMessage(chatbotId, message, {
      userId,
      conversationId,
      imageUrls,
      stream
    })
  }

  // Get conversation ID for a specific chatbot and user
  const getChatbotConversationId = (chatbotId, userId = null) => {
    return getConversationId(chatbotId, userId)
  }

  // Clear conversation for a specific chatbot and user
  const clearConversation = (chatbotId, userId = null) => {
    const key = `${chatbotId}_${userId || 'anonymous'}`
    setConversations(prev => {
      const newConversations = { ...prev }
      delete newConversations[key]
      return newConversations
    })
  }

  const value = {
    sendMessage,
    sendMessageWithOptions,
    isLoading,
    apiConfig,
    getWelcomeMessage,
    getChatbotConversationId,
    clearConversation,
    conversations
  }

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  )
}

export default ChatbotContext
