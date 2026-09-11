'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { pusherClient } from '@/lib/pusher'
import { AnimatePresence, motion } from 'framer-motion'

type Mensaje = {
  id: number;
  remitente_tipo: 'ciudadano' | 'admin';
  mensaje: string;
  creado_en: string;
}

export function ChatWidget() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [sesionId, setSesionId] = useState<number | null>(null)
  const mensajesEndRef = useRef<HTMLDivElement>(null)

  // Cargar historial
  useEffect(() => {
    if (isOpen && session?.user && !sesionId) {
      fetch('/api/chat/sesion')
        .then(res => res.json())
        .then(data => {
          if (data.sesion) {
            setSesionId(data.sesion.id)
            setMensajes(data.mensajes || [])
          }
        })
    }
  }, [isOpen, session])

  // Suscribirse a Pusher
  useEffect(() => {
    if (!sesionId) return

    const channel = pusherClient.subscribe(`chat-sesion-${sesionId}`)
    channel.bind('nuevo-mensaje', (mensaje: Mensaje) => {
      setMensajes(prev => {
        // Evitar duplicados
        if (prev.find(m => m.id === mensaje.id)) return prev
        return [...prev, mensaje]
      })
    })

    return () => {
      pusherClient.unsubscribe(`chat-sesion-${sesionId}`)
    }
  }, [sesionId])

  // Scroll automático
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoMensaje.trim()) return

    const texto = nuevoMensaje
    setNuevoMensaje('')

    // Simular el mensaje temporalmente para que se vea rápido
    const tempId = Date.now()
    setMensajes(prev => [...prev, { id: tempId, remitente_tipo: 'ciudadano', mensaje: texto, creado_en: new Date().toISOString() }])

    try {
      const res = await fetch('/api/chat/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: texto, sesionId, esAdmin: false })
      })
      const data = await res.json()
      if (data.success) {
        if (!sesionId) {
          setSesionId(data.mensaje.sesion_id)
        }
        // Reemplazar el temporal con el real
        setMensajes(prev => prev.map(m => m.id === tempId ? data.mensaje : m))
      }
    } catch(err) {
      console.error(err)
      // Podríamos mostrar error o quitar el mensaje temporal
    }
  }

  // Si no está logueado, no mostrar el widget
  if (!session?.user) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 bg-white rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden border border-gray-100 flex flex-col h-[500px] max-h-[80vh]"
          >
            {/* Header */}
            <div className="bg-[#8e1432] p-4 flex justify-between items-center text-white">
              <div>
                <h3 className="font-bold">Atención Ciudadana</h3>
                <p className="text-xs text-white/80">Respondemos lo más pronto posible</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-3">
              {mensajes.length === 0 ? (
                <div className="text-center text-gray-400 text-sm my-auto">
                  ¡Hola! ¿En qué podemos ayudarte el día de hoy?
                </div>
              ) : (
                mensajes.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      m.remitente_tipo === 'ciudadano'
                        ? 'bg-[#8e1432] text-white rounded-tr-none self-end'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none self-start shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{m.mensaje}</p>
                    <span className={`text-[10px] mt-1 block ${m.remitente_tipo === 'ciudadano' ? 'text-white/70 text-right' : 'text-gray-400 text-left'}`}>
                      {new Date(m.creado_en).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                ))
              )}
              <div ref={mensajesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={enviarMensaje} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-slate-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#8e1432]/50 transition-colors"
              />
              <button
                type="submit"
                disabled={!nuevoMensaje.trim()}
                className="bg-[#8e1432] text-white p-2.5 rounded-full hover:bg-[#7a0f28] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-[#8e1432] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#7a0f28] transition-colors float-right"
        >
          <MessageCircle className="w-7 h-7" />
        </motion.button>
      )}
    </div>
  )
}
