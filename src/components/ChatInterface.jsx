import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Loader2, CheckCircle } from 'lucide-react'
import { useChatbot } from '../context/ChatbotContext'

const ChatInterface = ({ chatbotId, onComplete, isGuidedMode = false }) => {
  const { sendMessage, isLoading, getWelcomeMessage } = useChatbot()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
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
    const welcomeMessage = isGuidedMode 
      ? `Welcome to ${chatbotNames[chatbotId]}! I'll help you with this step of your guided flow. ${getWelcomeMessage(chatbotId)}`
      : `Hello! I'm ${chatbotNames[chatbotId]}. ${getWelcomeMessage(chatbotId)}`
    
    setMessages([{
      id: Date.now(),
      type: 'bot',
      content: welcomeMessage,
      timestamp: new Date()
    }])
  }, [chatbotId, isGuidedMode, getWelcomeMessage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      const response = await sendMessage(chatbotId, input)
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleComplete = () => {
    setIsCompleted(true)
    if (onComplete) {
      setTimeout(() => {
        onComplete()
      }, 1000)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 pb-2">
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
            <div className="flex justify-start">
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
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {isGuidedMode && !isCompleted && (
        <div className="border-t border-gray-200 p-3 bg-white">
          <button
            onClick={handleComplete}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium flex items-center justify-center space-x-2 max-w-4xl mx-auto hover:scale-105 transition-transform"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Complete This Step</span>
          </button>
        </div>
      )}

      {!isCompleted && (
        <div className="border-t border-gray-200 p-3 bg-white shadow-sm">
          <form onSubmit={handleSubmit} className="flex space-x-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 hover:scale-105 transition-transform"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ChatInterface
