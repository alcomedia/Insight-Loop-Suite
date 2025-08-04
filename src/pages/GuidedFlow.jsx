import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle, Play, RotateCcw } from 'lucide-react'
import ChatInterface from '../components/ChatInterface'

const GuidedFlow = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [isStarted, setIsStarted] = useState(false)

  const steps = [
    { id: 1, name: 'Persona Forge', description: 'Craft deeply human personas from real psychographics and market signals' },
    { id: 2, name: 'MessageCraft', description: 'Language that lands. Messaging that moves' },
    { id: 3, name: 'Predyktable', description: 'Simulate Market Reactions to Any Scenario' },
    { id: 4, name: 'Market Scanner', description: 'Stay ahead. See what\'s shifting' },
    { id: 5, name: 'Strategy Synthesis', description: 'From insights to impact — instantly' },
    { id: 6, name: 'Launch Architect', description: 'Your all-in-one marketing execution engine' },
  ]

  const handleStepComplete = () => {
    setCompletedSteps(prev => [...prev, currentStep])
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setCompletedSteps([])
    setIsStarted(false)
  }

  const isFlowComplete = completedSteps.length === steps.length

  if (!isStarted) {
    return (
      <div className="h-screen flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Play className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Guided Flow Experience
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Let us guide you through all 6 chatbots in a structured sequence for comprehensive marketing insights.
          </p>
          
          <div className="glass-effect rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">What you'll accomplish:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{step.name}</p>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <Link 
              to="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsStarted(true)}
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Start Guided Flow</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (isFlowComplete) {
    return (
      <div className="h-screen flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Flow Complete!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Congratulations! You've successfully completed the entire Insight Loop Suite guided flow.
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <Link 
              to="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Start Over</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header with Progress */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect border-b border-white/20 p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link 
              to="/"
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Guided Flow
              </h1>
              <p className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Progress</p>
            <p className="text-lg font-semibold">
              {Math.round(((completedSteps.length) / steps.length) * 100)}%
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
            className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
          />
        </div>
        
        {/* Steps Indicator */}
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                completedSteps.includes(index)
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {completedSteps.includes(index) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <p className="text-xs mt-1 text-center max-w-16">
                {step.name.split(' ')[0]}
              </p>
            </div>
          ))}
        </div>
      </motion.header>

      {/* Current Step Content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {steps[currentStep].name}
              </h2>
              <p className="text-gray-600">
                {steps[currentStep].description}
              </p>
            </div>
            
            <div className="flex-1">
              <ChatInterface 
                chatbotId={steps[currentStep].id}
                onComplete={handleStepComplete}
                isGuidedMode={true}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default GuidedFlow
