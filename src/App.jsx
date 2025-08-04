import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ChatbotPage from './pages/ChatbotPage'
import GuidedFlow from './pages/GuidedFlow'
import { ChatbotProvider } from './context/ChatbotContext'

function App() {
  return (
    <ChatbotProvider>
      <div className="min-h-screen">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chatbot/:id" element={<ChatbotPage />} />
            <Route path="/guided-flow" element={<GuidedFlow />} />
          </Routes>
        </Layout>
      </div>
    </ChatbotProvider>
  )
}

export default App
