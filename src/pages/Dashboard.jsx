import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Brain, ArrowRight, Zap, Target, BarChart3, Users, MessageSquare, TrendingUp, Search, Lightbulb, Rocket } from 'lucide-react'

const Dashboard = () => {
  const chatbots = [
    { id: 1, name: 'Persona Forge', description: 'Craft deeply human personas from real psychographics and market signals', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { id: 2, name: 'MessageCraft', description: 'Language that lands. Messaging that moves', icon: MessageSquare, color: 'from-green-500 to-emerald-500' },
    { id: 3, name: 'Predyktable', description: 'Simulate Market Reactions to Any Scenario', icon: TrendingUp, color: 'from-purple-500 to-violet-500' },
    { id: 4, name: 'Market Scanner', description: 'Stay ahead. See what\'s shifting', icon: Search, color: 'from-red-500 to-pink-500' },
    { id: 5, name: 'Strategy Synthesis', description: 'From insights to impact — instantly', icon: Lightbulb, color: 'from-orange-500 to-amber-500' },
    { id: 6, name: 'Launch Architect', description: 'Your all-in-one marketing execution engine', icon: Rocket, color: 'from-indigo-500 to-blue-500' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold gradient-text mb-4">
          Insight Loop Suite
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Transform your marketing intelligence with our suite of 6 specialized AI chatbots. 
          Use them individually or follow our guided process for comprehensive market insights.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/guided-flow"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            <Play className="w-6 h-6" />
            <span>Start Guided Flow</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Chatbots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatbots.map((chatbot, index) => (
          <motion.div
            key={chatbot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass-effect rounded-2xl p-6 hover:shadow-2xl transition-all cursor-pointer group"
          >
            <Link to={`/chatbot/${chatbot.id}`}>
              <div className={`w-12 h-12 bg-gradient-to-br ${chatbot.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <chatbot.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {chatbot.name}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {chatbot.description}
              </p>
              
              <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                <span>Launch Chatbot</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 glass-effect rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
          Why Choose Insight Loop Suite?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Specialized AI</h3>
            <p className="text-gray-600">Each chatbot is fine-tuned for specific marketing intelligence tasks</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Guided Process</h3>
            <p className="text-gray-600">Follow our structured approach for comprehensive marketing insights</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Flexible Usage</h3>
            <p className="text-gray-600">Use individual chatbots or the complete suite based on your needs</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
