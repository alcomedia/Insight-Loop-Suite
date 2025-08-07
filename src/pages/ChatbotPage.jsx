import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, ArrowLeft, Bot, User, Loader2, Plus, MessageSquare } from 'lucide-react'
import { useChatbot } from '../context/ChatbotContext'

const ChatbotPage = () => {
  const { id } = useParams()
  const { 
    sendMessage, 
    isLoading, 
    getWelcomeMessage, 
    getChatHistory, 
    saveChatHistory, 
    startNewChat,
    getWelcomeMessageForChatbot 
  } = useChatbot()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentChatbotId, setCurrentChatbotId] = useState(null)
  const messagesEndRef = useRef(null)

  const chatbotNames = {
    1: 'Persona Forge',
    2: 'MessageCraft',
    3: 'Predyktable',
    4: 'Market Scanner',
    5: 'Strategy Synthesis',
    6: 'Launch Architect'
  }

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Save chat history whenever messages change
  useEffect(() => {
    if (currentChatbotId && messages.length > 0) {
      saveChatHistory(currentChatbotId, messages)
    }
  }, [messages, currentChatbotId, saveChatHistory])

  // Load or reset when chatbot ID changes
  useEffect(() => {
    const newChatbotId = parseInt(id)
    
    if (currentChatbotId !== newChatbotId) {
      console.log('=== CHATBOT CHANGED ===')
      console.log('Previous chatbot ID:', currentChatbotId)
      console.log('New chatbot ID:', newChatbotId)
      
      // Save current chat history before switching
      if (currentChatbotId && messages.length > 0) {
        saveChatHistory(currentChatbotId, messages)
      }
      
      // Load chat history for new chatbot
      const existingHistory = getChatHistory(newChatbotId)
      console.log('Existing history for chatbot', newChatbotId, ':', existingHistory.length, 'messages')
      
      if (existingHistory.length > 0) {
        // Restore existing chat history
        setMessages(existingHistory)
        setIsInitialized(true)
      } else {
        // Start fresh
        setMessages([])
        setIsInitialized(false)
      }
      
      setInput('')
      setCurrentChatbotId(newChatbotId)
    }
  }, [id, currentChatbotId, messages, saveChatHistory, getChatHistory])

  // Initialize welcome message only for new chats
  useEffect(() => {
    if (!isInitialized && currentChatbotId && chatbotNames[currentChatbotId]) {
      const existingHistory = getChatHistory(currentChatbotId)
      
      if (existingHistory.length === 0) {
        console.log('=== INITIALIZING WELCOME MESSAGE ===')
        console.log('Chatbot ID:', currentChatbotId)
        
        const welcomeMessage = {
          id: `welcome-${currentChatbotId}-${Date.now()}`,
          type: 'bot',
          content: `Hello! I'm ${chatbotNames[currentChatbotId]}. ${getWelcomeMessage(currentChatbotId)}`,
          timestamp: new Date()
        }
        
        console.log('Setting welcome message:', welcomeMessage)
        setMessages([welcomeMessage])
      }
      
      setIsInitialized(true)
    }
  }, [currentChatbotId, isInitialized, chatbotNames, getWelcomeMessage, getChatHistory])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !currentChatbotId) return

    const userMessageContent = input.trim()
    const userMessageId = `user-${Date.now()}-${Math.random()}`
    const userMessage = {
      id: userMessageId,
      type: 'user',
      content: userMessageContent,
      timestamp: new Date()
    }

    console.log('=== SUBMITTING MESSAGE ===')
    console.log('User input:', userMessageContent)
    console.log('Current Chatbot ID:', currentChatbotId)

    // Clear input immediately
    setInput('')

    // Add user message
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, userMessage]
      console.log('Adding user message. New count:', newMessages.length)
      return newMessages
    })

    try {
      console.log('Calling sendMessage...')
      const response = await sendMessage(currentChatbotId, userMessageContent, {})
      
      console.log('=== RECEIVED RESPONSE ===')
      console.log('Response:', response)

      if (response && response.trim()) {
        const botMessageId = `bot-${Date.now()}-${Math.random()}`
        const botMessage = {
          id: botMessageId,
          type: 'bot',
          content: response.trim(),
          timestamp: new Date()
        }

        setMessages(prevMessages => {
          const newMessages = [...prevMessages, botMessage]
          console.log('New messages after bot response:', newMessages.length)
          return newMessages
        })
      } else {
        console.error('No valid response received from API')
        const errorMessage = {
          id: `error-${Date.now()}-${Math.random()}`,
          type: 'bot',
          content: 'I received your message but didn\'t get a proper response. Please try again.',
          timestamp: new Date()
        }
        setMessages(prevMessages => [...prevMessages, errorMessage])
      }

    } catch (error) {
      console.error('=== ERROR IN HANDLESUBMIT ===')
      console.error('Error:', error)
      
      const errorMessage = {
        id: `error-${Date.now()}-${Math.random()}`,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prevMessages => [...prevMessages, errorMessage])
    }
  }

  const handleNewChat = () => {
    console.log('=== NEW CHAT REQUESTED ===')
    console.log('Current chatbot ID:', currentChatbotId)
    
    // Start new chat in context
    startNewChat(currentChatbotId)
    
    // Reset local state
    setMessages([])
    setInput('')
    setIsInitialized(false)
    
    // This will trigger the welcome message useEffect
  }

  if (!currentChatbotId || !chatbotNames[currentChatbotId]) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading chatbot...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.header 
        key={`header-${currentChatbotId}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect border-b border-white/20 p-4 flex-shrink-0"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/"
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                {chatbotNames[currentChatbotId]}
              </h1>
              <p className="text-sm text-gray-500">Chatbot {currentChatbotId} • {messages.length} messages</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleNewChat}
              className="flex items-center space-x-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
              title="Start New Chat"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
        <div className="space-y-3 max-w-4xl mx-auto">
          {messages.length === 0 && isInitialized && (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No messages yet. Start a conversation!</p>
            </div>
          )}
          
          {!isInitialized && (
            <div className="text-center text-gray-500 py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Loading conversation...</p>
            </div>
          )}
          
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-2xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-primary-500' 
                    : 'bg-gradient-to-br from-purple-500 to-violet-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div className={`chat-bubble ${
                  message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="chat-bubble chat-bubble-bot">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white shadow-sm flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex space-x-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </motion.button>
        </form>
      </div>
    </div>
  )
}

export default ChatbotPage
