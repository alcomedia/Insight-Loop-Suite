import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, MessageSquare, BarChart3, Brain, Target, Lightbulb, TrendingUp } from 'lucide-react'
import { chatbots } from '../data/chatbots'

const iconMap = {
  'market-research': BarChart3,
  'customer-insights': Brain,
  'competitive-analysis': Target,
  'product-strategy': Lightbulb,
  'sales-optimization': TrendingUp,
  'business-intelligence': MessageSquare
}

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Insight Loop</h2>
            <p className="text-xs text-gray-500">Suite</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6">
        <div 
          className={`sidebar-item ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <Home size={20} className="mr-3" />
          <span>Dashboard</span>
        </div>

        <div className="px-4 py-2 mt-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            AI Chatbots
          </h3>
        </div>

        {chatbots.map((chatbot) => {
          const Icon = iconMap[chatbot.id] || MessageSquare
          const isActiveBot = isActive(`/chatbot/${chatbot.id}`)
          
          return (
            <div
              key={chatbot.id}
              className={`sidebar-item ${isActiveBot ? 'active' : ''}`}
              onClick={() => navigate(`/chatbot/${chatbot.id}`)}
            >
              <Icon size={20} className="mr-3" />
              <span className="text-sm">{chatbot.name}</span>
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-primary-50 rounded-lg p-3">
          <p className="text-xs text-primary-700 font-medium">
            Pro Tip
          </p>
          <p className="text-xs text-primary-600 mt-1">
            Switch between chatbots to get comprehensive insights across all business areas.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
