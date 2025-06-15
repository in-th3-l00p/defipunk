'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm DeFiPunk AI, your expert assistant for analyzing DeFi protocols through a cypherpunk lens. 

I have comprehensive knowledge about our 6 curated protocols:
• **Liquity v1** (Score: 91/100, Stage 2) - Fully immutable lending
• **Morpho Blue** (Score: 79/100, Stage 1) - Permissionless markets  
• **Aave v3** (Score: 58/100, Stage 0) - Upgradeable lending
• **Compound v3** (Score: 54/100, Stage 0) - Guardian-controlled
• **Sky Lending** (Score: 49/100, Stage 0) - USDC-dependent CDP
• **Dyad** (Score: 44/100, Stage 0) - Team-controlled stablecoin

Ask me about:
- Protocol security and decentralization risks
- DeFiScan stage ratings and what they mean
- Cypherpunk alignment scores and criteria
- Live on-chain analytics from our subgraphs
- Comparisons between protocols
- Specific technical details or governance structures

What would you like to know?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          // Could add protocolSlug here if we want context-specific data
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to protocols
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              DeFiPunk AI Assistant
            </h1>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
              
              <div
                className={`max-w-3xl rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white ml-12'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {message.content.split('\n').map((line, index) => {
                    if (line.trim() === '') {
                      return <br key={index} />
                    }
                    
                    // Handle bullet points
                    if (line.startsWith('• ') || line.startsWith('- ')) {
                      return (
                        <div key={index} className="flex items-start gap-2 my-1">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{line.substring(2)}</span>
                        </div>
                      )
                    }
                    
                    // Handle bold text
                    const boldRegex = /\*\*(.*?)\*\*/g
                    const parts = line.split(boldRegex)
                    
                    return (
                      <p key={index} className="my-2">
                        {parts.map((part, partIndex) => 
                          partIndex % 2 === 1 ? (
                            <strong key={partIndex} className="font-semibold text-blue-600 dark:text-blue-400">
                              {part}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    )
                  })}
                </div>
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about protocol security, decentralization, or cypherpunk alignment..."
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            Powered by OpenAI • Real-time DeFiLlama & Subgraph data • DeFiScan analysis
          </div>
        </div>
      </div>
    </div>
  )
} 