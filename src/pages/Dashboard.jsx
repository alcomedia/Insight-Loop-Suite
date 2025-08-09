import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Users, TrendingUp, Target, Zap } from 'lucide-react'
import { chatbots } from '../data/chatbots'

const Dashboard = () => {
  const navigate = useNavigate()

  const stats = [
    { label: 'Active Chatbots', value: '6', icon: Users, color: 'text-blue-600' },
    { label: 'Insights Generated', value: '1,247', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Business Areas', value: '6', icon: Target, color: 'text-purple-600' },
    { label: 'AI Interactions', value: '8,932', icon: Zap, color: 'text-orange-600' }
  ]

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-8 mb-8 text-white">
        <h2 className="text-3xl font-bold mb-4">Welcome to Insight Loop Suite</h2>
        <p className="text-primary-100 text-lg mb-6">
          Your comprehensive AI-powered business intelligence platform. Access specialized chatbots 
          for market research, customer insights, competitive analysis, and more.
        </p>
        <div className="flex flex-wrap gap-4">
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Market Research</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Customer Analytics</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Competitive Intelligence</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Strategic Planning</span>
        </div>
      </div>

      {/* Chatbots Grid */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Available AI Chatbots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((chatbot) => (
            <div 
              key={chatbot.id}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/chatbot/${chatbot.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${chatbot.color} rounded-lg flex items-center justify-center`}>
                  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                </div>
                <ArrowRight size={20} className="text-gray-400" />
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{chatbot.name}</h4>
              <p className="text-gray-600 text-sm mb-4">{chatbot.description}</p>
              
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Key Features</p>
                <div className="flex flex-wrap gap-2">
                  {chatbot.features.slice(0, 2).map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {feature}
                    </span>
                  ))}
                  {chatbot.features.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                      +{chatbot.features.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900">Generate Report</h4>
            <p className="text-sm text-gray-600 mt-1">Create comprehensive business insights report</p>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900">Schedule Analysis</h4>
            <p className="text-sm text-gray-600 mt-1">Set up automated data analysis workflows</p>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900">Export Data</h4>
            <p className="text-sm text-gray-600 mt-1">Download insights and analytics data</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
