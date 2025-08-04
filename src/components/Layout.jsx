import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Home, Play, Users, MessageSquare, TrendingUp, Search, Lightbulb, Rocket } from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()

  const chatbots = [
    { id: 1, name: 'Persona Forge', icon: Users },
    { id: 2, name: 'MessageCraft', icon: MessageSquare },
    { id: 3, name: 'Predyktable', icon: TrendingUp },
    { id: 4, name: 'Market Scanner', icon: Search },
    { id: 5, name: 'Strategy Synthesis', icon: Lightbulb },
    { id: 6, name: 'Launch Architect', icon: Rocket },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 glass-effect border-r border-white/20 p-6"
      >
        <div className="mb-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Insight Loop</h1>
              <p className="text-sm text-gray-500">Suite</p>
            </div>
          </Link>
        </div>

        <nav className="space-y-2">
          <NavLink to="/" icon={Home} label="Dashboard" active={location.pathname === '/'} />
          <NavLink to="/guided-flow" icon={Play} label="Guided Flow" active={location.pathname === '/guided-flow'} />
          
          <div className="pt-4 pb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Individual Chatbots</p>
          </div>
          
          {chatbots.map(chatbot => (
            <NavLink 
              key={chatbot.id}
              to={`/chatbot/${chatbot.id}`} 
              icon={chatbot.icon} 
              label={chatbot.name} 
              active={location.pathname === `/chatbot/${chatbot.id}`}
            />
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}

const NavLink = ({ to, icon: Icon, label, active }) => (
  <Link to={to}>
    <motion.div 
      whileHover={{ x: 4 }}
      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-primary-500 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </motion.div>
  </Link>
)

export default Layout
