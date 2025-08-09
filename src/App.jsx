import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ChatbotPage from './pages/ChatbotPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chatbot/:id" element={<ChatbotPage />} />
      </Routes>
    </Layout>
  )
}

export default App
