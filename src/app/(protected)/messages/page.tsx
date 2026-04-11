'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, ArrowLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Conversation {
  id: string; surferId: string; surferName: string; surferPhoto: string
  lastMessage: string; timestamp: string; unread: boolean
}
interface Message {
  id: string; sender: 'me' | 'them'; content: string; timestamp: string
}

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', sender: 'them', content: "Hey! Are you heading to Costa da Caparica this weekend?", timestamp: '2024-01-15T10:30:00Z' },
    { id: '2', sender: 'me',   content: "Yeah! Forecast looks solid — 4-5ft and clean.", timestamp: '2024-01-15T10:35:00Z' },
    { id: '3', sender: 'them', content: "Perfect, let's meet at the north car park around 7am?", timestamp: '2024-01-15T10:38:00Z' },
  ],
  '2': [
    { id: '1', sender: 'them', content: "Thanks for the surf session yesterday!", timestamp: '2024-01-14T16:45:00Z' },
    { id: '2', sender: 'me',   content: "That was epic! Carcavelos was firing.", timestamp: '2024-01-14T16:50:00Z' },
  ],
}

const defaultConvs: Conversation[] = [
  { id: '1', surferId: '1', surferName: 'João Silva',   surferPhoto: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400', lastMessage: "Perfect, let's meet at the north car park around 7am?", timestamp: '2024-01-15T10:38:00Z', unread: false },
  { id: '2', surferId: '2', surferName: 'Maria Santos', surferPhoto: 'https://images.unsplash.com/photo-1455264745730-cb3b76250887?w=400', lastMessage: 'Thanks for the surf session yesterday!', timestamp: '2024-01-14T16:45:00Z', unread: true },
]

function fmt(ts: string) {
  const d = new Date(ts), diff = (Date.now() - d.getTime()) / 3_600_000
  if (diff < 24) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diff < 48) return 'Yesterday'
  return d.toLocaleDateString()
}

export default function MessagesPage() {
  const [convs, setConvs]         = useState<Conversation[]>([])
  const [selected, setSelected]   = useState<Conversation | null>(null)
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState('')
  const bottomRef                 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored: Conversation[] = JSON.parse(localStorage.getItem('conversations') || '[]')
    const list = stored.length > 0 ? stored : defaultConvs
    if (!stored.length) localStorage.setItem('conversations', JSON.stringify(list))
    setConvs(list)
  }, [])

  const open = (conv: Conversation) => {
    setSelected(conv)
    setMessages(mockMessages[conv.surferId] ?? [])
    setConvs(p => p.map(c => c.id === conv.id ? { ...c, unread: false } : c))
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const send = () => {
    if (!input.trim() || !selected) return
    setMessages(p => [...p, { id: Date.now().toString(), sender: 'me', content: input.trim(), timestamp: new Date().toISOString() }])
    setInput('')
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const cardBg = 'linear-gradient(160deg, oklch(0.13 0.022 248) 0%, oklch(0.10 0.018 252) 100%)'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-4 sm:py-6 lg:py-8">
        <div className="flex border border-border/60 rounded-2xl overflow-hidden"
             style={{ height: 'calc(100dvh - 7rem)', maxHeight: '820px', background: cardBg }}>

          {/* ── Sidebar ── */}
          <div className={`flex flex-col w-full sm:w-72 md:w-80 shrink-0 border-r border-border/60 ${selected ? 'hidden sm:flex' : 'flex'}`}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-border/60 shrink-0">
              <h1 className="font-[family-name:var(--font-syne)] font-700 text-lg tracking-tight text-foreground">Messages</h1>
              <p className="text-[11px] text-muted-foreground mt-0.5 font-300">Your surf connections</p>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto">
              {convs.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => open(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-border/30 transition-colors text-left ${
                    selected?.id === conv.id
                      ? 'bg-primary/8'
                      : 'hover:bg-accent/30'
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={conv.surferPhoto} />
                      <AvatarFallback className="text-sm font-[family-name:var(--font-syne)] font-700"
                                      style={{ background: 'oklch(0.76 0.175 192 / 0.15)', color: 'oklch(0.76 0.175 192)' }}>
                        {conv.surferName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {conv.unread && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card"
                            style={{ background: 'oklch(0.76 0.175 192)' }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm tracking-tight truncate ${conv.unread ? 'font-[family-name:var(--font-syne)] font-700 text-foreground' : 'text-foreground/80 font-500'}`}>
                        {conv.surferName}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-2 shrink-0">{fmt(conv.timestamp)}</span>
                    </div>
                    <p className={`text-xs truncate ${conv.unread ? 'text-foreground/60' : 'text-muted-foreground font-300'}`}>
                      {conv.lastMessage || 'Start a conversation…'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Thread ── */}
          <div className={`flex-1 flex flex-col min-w-0 ${selected ? 'flex' : 'hidden sm:flex'}`}>
            {selected ? (
              <>
                {/* Thread header */}
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/60 shrink-0">
                  <button onClick={() => setSelected(null)} className="sm:hidden text-muted-foreground hover:text-foreground p-1 -ml-1">
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selected.surferPhoto} />
                    <AvatarFallback className="text-xs font-[family-name:var(--font-syne)] font-700"
                                    style={{ background: 'oklch(0.76 0.175 192 / 0.15)', color: 'oklch(0.76 0.175 192)' }}>
                      {selected.surferName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-[family-name:var(--font-syne)] font-700 text-sm tracking-tight text-foreground">{selected.surferName}</p>
                    <p className="text-[10px] font-[family-name:var(--font-syne)] font-600 tracking-[0.08em] uppercase" style={{ color: 'oklch(0.76 0.175 192)' }}>Active surfer</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'me'
                          ? 'rounded-br-sm text-primary-foreground'
                          : 'rounded-bl-sm text-foreground'
                      }`}
                           style={msg.sender === 'me'
                             ? { background: 'oklch(0.76 0.175 192)' }
                             : { background: 'oklch(0.18 0.022 248)', border: '1px solid oklch(0.22 0.022 248)' }}>
                        <p>{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-primary-foreground/55 text-right' : 'text-muted-foreground'}`}>
                          {fmt(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-4 py-4 border-t border-border/60 shrink-0">
                  <div className="flex items-center gap-3">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && send()}
                      placeholder="Message…"
                      className="flex-1 rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 font-300"
                      style={{ background: 'oklch(0.16 0.02 248)', border: '1px solid oklch(0.22 0.022 248)' }}
                    />
                    <button
                      onClick={send}
                      disabled={!input.trim()}
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 disabled:opacity-30"
                      style={{ background: 'oklch(0.76 0.175 192)' }}
                    >
                      <Send className="h-4 w-4" style={{ color: 'oklch(0.07 0.025 248)' }} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                     style={{ background: 'oklch(0.76 0.175 192 / 0.1)', border: '1px solid oklch(0.76 0.175 192 / 0.2)' }}>
                  <Send className="h-6 w-6" style={{ color: 'oklch(0.76 0.175 192)' }} />
                </div>
                <p className="font-[family-name:var(--font-syne)] font-700 text-base text-foreground mb-1">Your messages</p>
                <p className="text-sm text-muted-foreground font-300">Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
