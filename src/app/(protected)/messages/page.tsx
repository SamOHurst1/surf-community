'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Send, ArrowLeft, ExternalLink } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase'

interface Conversation {
  userId: string
  name: string
  image: string | null
  lastMessage: string
  timestamp: string
  unread: number
}

interface Message {
  id: string
  content: string
  sender: 'me' | 'them'
  timestamp: string
}

function fmt(ts: string) {
  const d = new Date(ts), diff = (Date.now() - d.getTime()) / 3_600_000
  if (diff < 24) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diff < 48) return 'Yesterday'
  return d.toLocaleDateString()
}

export default function MessagesPage() {
  const searchParams                  = useSearchParams()
  const { data: session }             = useSession()
  const [convs, setConvs]            = useState<Conversation[]>([])
  const [selected, setSelected]      = useState<Conversation | null>(null)
  const [messages, setMessages]      = useState<Message[]>([])
  const [input, setInput]            = useState('')
  const [sending, setSending]        = useState(false)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const bottomRef                    = useRef<HTMLDivElement>(null)
  const selectedRef                  = useRef<Conversation | null>(null)

  // Keep selectedRef in sync — also updated synchronously in openConv below
  useEffect(() => { selectedRef.current = selected }, [selected])

  // Load conversation list on mount
  useEffect(() => {
    fetch('/api/conversations')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setConvs(data) })
      .catch(() => {})
  }, [])

  // Supabase Realtime — subscribe to new messages sent to the current user
  useEffect(() => {
    const myId = session?.user?.id
    if (!myId) return

    const refreshConvs = () =>
      fetch('/api/conversations')
        .then(r => r.json())
        .then(data => {
          if (!Array.isArray(data)) return
          setConvs(prev => {
            const incoming = data as Conversation[]
            const incomingIds = new Set(incoming.map(c => c.userId))
            const stubs = prev.filter(c => !incomingIds.has(c.userId))
            return [...stubs, ...incoming]
          })
        })
        .catch(() => {})

    const channel = supabase
      .channel('incoming-messages')
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'Message',
          filter: `receiverId=eq.${myId}`,
        },
        payload => {
          // Handle both camelCase and lowercase column names from Postgres
          const row = payload.new as Record<string, unknown>
          const senderId = (row.senderId ?? row.senderid) as string | undefined


          if (!senderId) return

          // Notify navbar badge
          window.dispatchEvent(new Event('new-message'))

          const conv = selectedRef.current

          // Always refresh conversation list
          refreshConvs()

          if (conv && senderId === conv.userId) {
            // Active conversation — re-fetch thread to get the real message object
            fetch(`/api/messages/${conv.userId}`)
              .then(r => r.json())
              .then(data => {
                if (!Array.isArray(data)) return
                setMessages(prev => {
                  const existingIds = new Set(prev.map(m => m.id))
                  const newMsgs = (data as Message[]).filter(m => !existingIds.has(m.id))
                  if (newMsgs.length === 0) return prev
                  setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 30)
                  return [...prev, ...newMsgs]
                })
              })
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [session?.user?.id])

  // Handle ?userId= from discover page — auto-open that conversation
  useEffect(() => {
    const userId = searchParams.get('userId')
    if (!userId) return

    // Check if conversation already exists
    setConvs(prev => {
      const existing = prev.find(c => c.userId === userId)
      if (existing) {
        openConv(existing)
        return prev
      }
      // Fetch user info and add a new entry
      fetch(`/api/user/${userId}`)
        .then(r => r.json())
        .then(user => {
          const newConv: Conversation = {
            userId:      user.id,
            name:        user.name,
            image:       user.image,
            lastMessage: '',
            timestamp:   new Date().toISOString(),
            unread:      0,
          }
          setConvs(p => {
            if (p.find(c => c.userId === userId)) return p
            return [newConv, ...p]
          })
          openConv(newConv)
        })
      return prev
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const openConv = useCallback((conv: Conversation) => {
    selectedRef.current = conv   // sync immediately so Realtime handler sees it right away
    setSelected(conv)
    setMessages([])
    setLoadingMsgs(true)
    // Mark as read locally
    setConvs(p => p.map(c => c.userId === conv.userId ? { ...c, unread: 0 } : c))

    fetch(`/api/messages/${conv.userId}`)
      .then(r => r.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : [])
        setLoadingMsgs(false)
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'instant' }), 30)
      })
  }, [])

  const send = async () => {
    if (!input.trim() || !selected || sending) return
    const body = input.trim()
    setInput('')
    setSending(true)

    // Optimistic update
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      content: body,
      sender: 'me',
      timestamp: new Date().toISOString(),
    }
    setMessages(p => [...p, optimistic])
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 30)

    const res = await fetch(`/api/messages/${selected.userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    })
    const saved = await res.json()
    setSending(false)

    // Replace optimistic with real message
    setMessages(p => p.map(m => m.id === optimistic.id ? saved : m))

    // Update conversation last message
    setConvs(p => p.map(c =>
      c.userId === selected.userId
        ? { ...c, lastMessage: body, timestamp: saved.timestamp }
        : c
    ))
  }

  const cardBg = 'linear-gradient(160deg, oklch(0.13 0.022 248) 0%, oklch(0.10 0.018 252) 100%)'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-4 sm:py-6 lg:py-8">
        <div className="flex border border-border/60 rounded-2xl overflow-hidden"
             style={{ height: 'calc(100dvh - 7rem)', maxHeight: '820px', background: cardBg }}>

          {/* ── Sidebar ── */}
          <div className={`flex flex-col w-full sm:w-72 md:w-80 shrink-0 border-r border-border/60 ${selected ? 'hidden sm:flex' : 'flex'}`}>
            <div className="px-5 py-4 border-b border-border/60 shrink-0">
              <h1 className="font-[family-name:var(--font-syne)] font-700 text-lg tracking-tight text-foreground">Messages</h1>
              <p className="text-[11px] text-muted-foreground mt-0.5 font-300">Your surf connections</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {convs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
                  <p className="text-sm text-muted-foreground font-300">No conversations yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Message a surfer from Discover</p>
                </div>
              ) : convs.map(conv => (
                <button
                  key={conv.userId}
                  onClick={() => openConv(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-border/30 transition-colors text-left ${
                    selected?.userId === conv.userId ? 'bg-primary/8' : 'hover:bg-accent/30'
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={conv.image ?? undefined} />
                      <AvatarFallback className="text-sm font-[family-name:var(--font-syne)] font-700"
                                      style={{ background: 'oklch(0.76 0.175 192 / 0.15)', color: 'oklch(0.76 0.175 192)' }}>
                        {conv.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {conv.unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card"
                            style={{ background: 'oklch(0.76 0.175 192)' }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm tracking-tight truncate ${conv.unread > 0 ? 'font-[family-name:var(--font-syne)] font-700 text-foreground' : 'text-foreground/80 font-500'}`}>
                        {conv.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-2 shrink-0">{fmt(conv.timestamp)}</span>
                    </div>
                    <p className={`text-xs truncate ${conv.unread > 0 ? 'text-foreground/60' : 'text-muted-foreground font-300'}`}>
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
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/60 shrink-0">
                  <button onClick={() => setSelected(null)} className="sm:hidden text-muted-foreground hover:text-foreground p-1 -ml-1">
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selected.image ?? undefined} />
                    <AvatarFallback className="text-xs font-[family-name:var(--font-syne)] font-700"
                                    style={{ background: 'oklch(0.76 0.175 192 / 0.15)', color: 'oklch(0.76 0.175 192)' }}>
                      {selected.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <a
                      href={`/surfers/${selected.userId}`}
                      className="flex items-center gap-1 group"
                    >
                      <p className="font-[family-name:var(--font-syne)] font-700 text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">{selected.name}</p>
                      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                    </a>
                    <p className="text-[10px] font-[family-name:var(--font-syne)] font-600 tracking-[0.08em] uppercase" style={{ color: 'oklch(0.76 0.175 192)' }}>Surfer</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
                  {loadingMsgs ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <p className="text-sm text-muted-foreground font-300">No messages yet</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Say hello and plan a session</p>
                    </div>
                  ) : messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'me' ? 'rounded-br-sm text-primary-foreground' : 'rounded-bl-sm text-foreground'
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

                <div className="px-4 py-4 border-t border-border/60 shrink-0">
                  <div className="flex items-center gap-3">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                      placeholder="Message…"
                      className="flex-1 rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 font-300"
                      style={{ background: 'oklch(0.16 0.02 248)', border: '1px solid oklch(0.22 0.022 248)' }}
                    />
                    <button
                      onClick={send}
                      disabled={!input.trim() || sending}
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
