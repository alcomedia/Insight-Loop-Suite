import React, { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, ArrowLeft, Bot, User, Loader2 } from 'lucide-react'
import { useChatbot } from '../context/ChatbotContext'

const ChatbotPage = () => {
  const { id } = useParams()
  const { sendMessage, isLoading, getWelcomeMessage } = useChatbot()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streamingMessageId, setStreamingMessageId] = useState(null)
  const messagesEndRef = useRef(null)

  const chatbotNames = {
    1: 'Persona Forge',
    2: 'MessageCraft',
    3: 'Predyktable',
    4: 'Market Scanner',
    5: 'Strategy Synthesis',
    6: 'Launch Architect'
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Welcome message using the actual chatbot's default message
    setMessages([{
      id: Date.now(),
      type: 'bot',
      content: `Hello! I'm ${chatbotNames[id]}. ${getWelcomeMessage(id)}`,
      timestamp: new Date(),
      isComplete: true
    }])
  }, [id, getWelcomeMessage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date(),
      isComplete: true
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Create initial bot message for streaming
    const botMessageId = Date.now() + 1
    const initialBotMessage = {
      id: botMessageId,
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isComplete: false,
      isStreaming: true
    }

    setMessages(prev => [...prev, initialBotMessage])
    setStreamingMessageId(botMessageId)

    try {
      const response = await sendMessage(
        id, 
        input, 
        {}, // options
        (chunk, fullResponse) => {
          // Stream chunk callback
          setMessages(prev => prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, content: fullResponse, isStreaming: true }
              : msg
          ))
        }
      )

      // Mark message as complete
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
          ? { ...msg, content: response, isComplete: true, isStreaming: false }
          : msg
      ))

    } catch (error) {
      const errorMessage = 'Sorry, I encountered an error. Please try again.'
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
          ? { ...msg, content: errorMessage, isComplete: true, isStreaming: false }
          : msg
      ))
    } finally {
      setStreamingMessageId(null)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.header 
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
                {chatbotNames[id]}
              </h1>
              <p className="text-sm text-gray-500">Chatbot {id}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
      </motion.header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
        <div className="space-y-3 max-w-4xl mx-auto">
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
                } ${message.isStreaming ? 'streaming' : ''}`}>
                  <div className="flex items-start">
                    <p className="whitespace-pre-wrap flex-1">{message.content}</p>
                    {message.isStreaming && (
                      <div className="ml-2 flex-shrink-0">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                    {message.isStreaming && (
                      <span className="ml-2 text-green-500">● Streaming</span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && !streamingMessageId && (
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
                    <span>Connecting...</span>
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
