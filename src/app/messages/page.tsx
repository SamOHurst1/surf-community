'use client'

import { useState, useEffect } from 'react'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isRead: boolean
}

interface Conversation {
  id: string
  surferId: string
  surferName: string
  surferPhoto: string
  lastMessage: string
  timestamp: string
  unread: boolean
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // Load conversations from localStorage
    const storedConversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    setConversations(storedConversations)
    
    // If no conversations, create some mock ones
    if (storedConversations.length === 0) {
      const mockConversations: Conversation[] = [
        {
          id: '1',
          surferId: '1',
          surferName: 'João Silva',
          surferPhoto: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400',
          lastMessage: 'Hey! Are you heading to Costa da Caparica this weekend?',
          timestamp: '2024-01-15T10:30:00Z',
          unread: false
        },
        {
          id: '2',
          surferId: '2',
          surferName: 'Maria Santos',
          surferPhoto: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
          lastMessage: 'Thanks for the surf session yesterday!',
          timestamp: '2024-01-14T16:45:00Z',
          unread: true
        }
      ]
      setConversations(mockConversations)
      localStorage.setItem('conversations', JSON.stringify(mockConversations))
    }
  }, [])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12" style={{ margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50">
          <div className="p-6 sm:p-8 border-b border-border/30">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Messages</h1>
                <p className="text-muted-foreground mt-1">Connect with other surfers in your community</p>
              </div>
            </div>
          </div>
          
          <div className="flex h-96">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-border/30 overflow-y-auto bg-secondary/20">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-foreground">No conversations yet</p>
                  <p className="text-sm text-muted-foreground">Start connecting with other surfers!</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 border-b border-border/30 cursor-pointer transition-all duration-200 ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-primary/20 border-primary/30'
                        : 'hover:bg-accent/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                          {conversation.surferPhoto ? (
                            <img
                              src={conversation.surferPhoto}
                              alt={conversation.surferName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                              {conversation.surferName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-foreground truncate">
                              {conversation.surferName}
                            </h3>
                            {conversation.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {conversation.lastMessage || 'Start a conversation...'}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground ml-2">
                        {formatTimestamp(conversation.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Message Detail */}
            <div className="flex-1 flex flex-col bg-secondary/20">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-border/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary">
                          {selectedConversation.surferPhoto ? (
                            <img
                              src={selectedConversation.surferPhoto}
                              alt={selectedConversation.surferName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                              {selectedConversation.surferName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">
                          {selectedConversation.surferName}
                        </h2>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatTimestamp(selectedConversation.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="bg-card/30 rounded-xl p-4 border border-border/30">
                      <p className="text-foreground">{selectedConversation.lastMessage || 'Start a conversation with this surfer!'}</p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border/30">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      />
                      <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 my-2">
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-foreground">Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 