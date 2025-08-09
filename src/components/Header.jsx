import React from 'react'
import { useLocation } from 'react-router-dom'
import { Settings, Bell, User } from 'lucide-react'
import { chatbots } from '../data/chatbots'

const Header = () => {
  const location = useLocation()
  
  const getCurrentPageTitle = () => {
    if (location.pathname === '/') {
      return 'Dashboard'
    }
    
    const chatbotId = location.pathname.split('/')[2]
    const chatbot = chatbots.find(bot => bot.id === chatbotId)
    return chatbot ? chatbot.name : 'Chatbot'
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {getCurrentPageTitle()}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Insight Loop Suite - AI-Powered Business Intelligence
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
