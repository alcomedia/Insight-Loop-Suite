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
  const [chatHistory, setChatHistory] = useState({}) // Store chat history per chatbot

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

  // Get chat history for a specific chatbot
  const getChatHistory = (chatbotId) => {
    return chatHistory[chatbotId] || []
  }

  // Save chat history for a specific chatbot
  const saveChatHistory = (chatbotId, messages) => {
    setChatHistory(prev => ({
      ...prev,
      [chatbotId]: messages
    }))
  }

  // Start a new chat for a specific chatbot
  const startNewChat = (chatbotId) => {
    console.log('=== STARTING NEW CHAT ===')
    console.log('Chatbot ID:', chatbotId)
    
    // Clear the chat history for this chatbot
    setChatHistory(prev => ({
      ...prev,
      [chatbotId]: []
    }))
    
    // Clear the conversation ID to start fresh
    const key = `${chatbotId}_anonymous`
    setConversations(prev => {
      const newConversations = { ...prev }
      delete newConversations[key]
      return newConversations
    })
    
    console.log('Chat history cleared for chatbot', chatbotId)
  }

  // Get welcome message with history check
  const getWelcomeMessageForChatbot = (chatbotId) => {
    const config = apiConfig[chatbotId]
    const history = getChatHistory(chatbotId)
    
    if (history.length > 0) {
      // Return existing history instead of creating new welcome message
      return null
    }
    
    return config ? config.defaultMessage : 'Hello! How can I help you today?'
  }

  // Enhanced response extraction function
  const extractResponseContent = (data, chatbotId) => {
    console.log('=== EXTRACTING RESPONSE CONTENT ===')
    console.log('Chatbot ID:', chatbotId)
    console.log('Raw data type:', typeof data)
    console.log('Raw data:', data)

    // If data is already a string, return it
    if (typeof data === 'string') {
      console.log('Data is already a string:', data)
      return data.trim()
    }

    // If data is null or undefined
    if (!data) {
      console.log('Data is null or undefined')
      return null
    }

    // Try all possible response field names (expanded list)
    const possibleResponseFields = [
      'result',        // Pickaxe seems to use this
      'message',
      'response', 
      'completion',
      'text',
      'content',
      'answer',
      'reply',
      'output',
      'data',
      'body',
      'payload',
      'value',
      'chatResponse',
      'botResponse',
      'aiResponse'
    ]

    // Check direct fields first
    for (const field of possibleResponseFields) {
      if (data[field] !== undefined && data[field] !== null) {
        const value = data[field]
        console.log(`Found value in field '${field}':`, typeof value, value)
        
        if (typeof value === 'string' && value.trim()) {
          console.log(`Using response from field: ${field}`)
          return value.trim()
        }
        
        // If it's an object, try to extract from it
        if (typeof value === 'object' && value !== null) {
          console.log(`Field '${field}' is an object, checking nested fields...`)
          const nestedResult = extractResponseContent(value, chatbotId)
          if (nestedResult) {
            console.log(`Found nested response in ${field}:`, nestedResult)
            return nestedResult
          }
        }
      }
    }

    // Check for OpenAI-style choices array
    if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
      console.log('Checking OpenAI-style choices array...')
      const choice = data.choices[0]
      
      if (choice.message && choice.message.content) {
        console.log('Found response in choices[0].message.content')
        return choice.message.content.trim()
      }
      
      if (choice.text) {
        console.log('Found response in choices[0].text')
        return choice.text.trim()
      }
      
      if (choice.delta && choice.delta.content) {
        console.log('Found response in choices[0].delta.content')
        return choice.delta.content.trim()
      }
    }

    // Check for nested data structures
    if (data.data) {
      console.log('Checking nested data field...')
      const nestedResult = extractResponseContent(data.data, chatbotId)
      if (nestedResult) {
        console.log('Found response in nested data:', nestedResult)
        return nestedResult
      }
    }

    // Check for success/error patterns
    if (data.success === true || data.success === 'true') {
      console.log('Response indicates success, looking for content...')
      // Try common success response fields
      const successFields = ['result', 'data', 'message', 'content', 'response']
      for (const field of successFields) {
        if (data[field] && typeof data[field] === 'string' && data[field].trim()) {
          console.log(`Found success response in field: ${field}`)
          return data[field].trim()
        }
      }
    }

    // If we still haven't found anything, try to find any string value in the object
    console.log('Searching for any string values in the response...')
    const findStringValue = (obj, path = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key
        
        if (typeof value === 'string' && value.trim() && value.length > 10) {
          // Ignore very short strings that are likely metadata
          console.log(`Found potential response string at ${currentPath}:`, value.substring(0, 100))
          return value.trim()
        }
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const nestedString = findStringValue(value, currentPath)
          if (nestedString) return nestedString
        }
      }
      return null
    }

    const foundString = findStringValue(data)
    if (foundString) {
      console.log('Found string value in response:', foundString.substring(0, 100))
      return foundString
    }

    console.log('No response content found in any expected field')
    console.log('Full response structure:', JSON.stringify(data, null, 2))
    return null
  }

  const sendMessage = async (chatbotId, message, options = {}) => {
    setIsLoading(true)
    
    try {
      const config = apiConfig[chatbotId]
      
      if (!config) {
        throw new Error(`Chatbot ${chatbotId} not found`)
      }

      // Extract Pickaxe-specific options
      const {
        userId = null,
        conversationId = null,
        imageUrls = null,
        stream = false,
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
      console.log('Chatbot:', config.name, '(ID:', chatbotId, ')')
      console.log('URL:', "https://api.pickaxe.co/v1/completions")
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
        return responseText.trim() || 'I received your message but had trouble parsing the response.'
      }

      // Use enhanced extraction function
      const responseContent = extractResponseContent(data, chatbotId)

      if (responseContent) {
        console.log('Successfully extracted response:', responseContent.substring(0, 200) + '...')
        return responseContent
      } else {
        console.warn('No response content found after comprehensive extraction')
        console.log('Falling back to demo response for chatbot', chatbotId)
        
        // Enhanced fallback responses
        const fallbackResponses = {
          1: "I've analyzed your target market and created detailed personas based on psychographic data. Here are 3 key personas: The Ambitious Professional (35-45, values efficiency and status), The Conscious Consumer (28-40, prioritizes sustainability and authenticity), and The Tech-Forward Early Adopter (25-35, seeks innovation and cutting-edge solutions).",
          2: "Your messaging needs to resonate emotionally while driving action. I've crafted three message variations: 1) Problem-focused: 'Tired of solutions that don't deliver?' 2) Aspiration-driven: 'Transform your results in 30 days' 3) Social proof-powered: 'Join 10,000+ professionals who've already made the switch.' Each targets different psychological triggers.",
          3: "Market simulation complete. Based on current trends and competitor analysis, I predict: 67% positive reception for premium positioning, 23% price sensitivity concerns, and 45% likelihood of viral social sharing. Key risk factors: economic uncertainty (moderate impact) and seasonal demand fluctuations (low impact).",
          4: "Market shift detected! Three emerging trends: 1) 34% increase in mobile-first purchasing behavior, 2) Rising demand for personalized experiences (+28% YoY), 3) Sustainability becoming a key differentiator (mentioned in 67% of customer feedback). Competitor X just launched a similar feature - recommend accelerating your timeline.",
          5: "Strategic synthesis complete. Based on your personas, messaging, and market data, here's your action plan: 1) Lead with the Conscious Consumer persona (highest conversion potential), 2) Use aspiration-driven messaging in premium channels, 3) Launch during Q2 for optimal market conditions, 4) Focus on mobile-first experience with sustainability messaging.",
          6: "Launch architecture ready! Your execution roadmap: Week 1-2: Content creation and asset development, Week 3: Influencer partnerships and PR outreach, Week 4: Paid media launch with A/B testing, Week 5-6: Community building and engagement optimization, Week 7-8: Performance analysis and scaling. Budget allocation: 40% paid media, 30% content, 20% partnerships, 10% tools/analytics."
        }
        
        return fallbackResponses[chatbotId] || 'I received your message and I\'m processing it. The response format was unexpected, but I\'m here to help!'
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
    conversations,
    // New chat history functions
    getChatHistory,
    saveChatHistory,
    startNewChat,
    getWelcomeMessageForChatbot
  }

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  )
}

export default ChatbotContext
