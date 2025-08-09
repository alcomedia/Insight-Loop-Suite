import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ExternalLink, Settings, Maximize2, Minimize2, Code } from 'lucide-react'
import { chatbots } from '../data/chatbots'

const ChatbotPage = () => {
  const { id } = useParams()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showEmbedCode, setShowEmbedCode] = useState(false)
  
  const chatbot = chatbots.find(bot => bot.id === id)
  
  if (!chatbot) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Chatbot Not Found</h2>
          <p className="text-gray-600 mt-2">The requested chatbot could not be found.</p>
        </div>
      </div>
    )
  }

  const embedCode = `<iframe 
  src="${chatbot.embedUrl || 'https://your-chatbot-url.com'}" 
  width="100%" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px;"
  allow="microphone; camera">
</iframe>`

  return (
    <div className="flex flex-col h-full">
      {/* Chatbot Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 ${chatbot.color} rounded-lg flex items-center justify-center`}>
              <div className="w-5 h-5 bg-white rounded opacity-80"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{chatbot.name}</h2>
              <p className="text-sm text-gray-600">{chatbot.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowEmbedCode(!showEmbedCode)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              title="Show Embed Code"
            >
              <Code size={18} />
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
              <Settings size={18} />
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              onClick={() => window.open(chatbot.embedUrl, '_blank')}
            >
              <ExternalLink size={18} />
            </button>
          </div>
        </div>

        {/* Features Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {chatbot.features.map((feature, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Embed Code Modal */}
      {showEmbedCode && (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Embed Code</h3>
            <button 
              onClick={() => setShowEmbedCode(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <code className="text-green-400 text-sm font-mono whitespace-pre-wrap">
              {embedCode}
            </code>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Copy this code to embed the chatbot in your website or application.
          </p>
        </div>
      )}

      {/* Chatbot Embed Area */}
      <div className={`flex-1 p-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
        <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {chatbot.embedUrl ? (
            <iframe
              src={chatbot.embedUrl}
              className="w-full h-full border-0 rounded-lg"
              title={chatbot.name}
              allow="microphone; camera; clipboard-read; clipboard-write"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <div className={`w-16 h-16 ${chatbot.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <div className="w-8 h-8 bg-white rounded opacity-80"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {chatbot.name} Ready
                </h3>
                <p className="text-gray-600 mb-4 max-w-md">
                  This chatbot is ready to be configured. Add your embed URL in the chatbot configuration 
                  to display the interactive interface here.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-yellow-800">
                    <strong>Configuration needed:</strong> Please add the embed URL for this chatbot 
                    in <code className="bg-yellow-100 px-1 rounded">src/data/chatbots.js</code>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatbotPage
