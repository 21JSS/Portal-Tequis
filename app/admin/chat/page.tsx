'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { pusherClient } from '@/lib/pusher'
import { User, Send, CheckCircle2, MessageCircle } from 'lucide-react'

type Sesion = {
  id: number
  estado: string
  creado_en: string
  correo_electronico: string
  primer_nombre: string
  primer_apellido: string
}

type Mensaje = {
  id: number
  remitente_tipo: 'ciudadano' | 'admin'
  mensaje: string
  creado_en: string
}

export default function AdminChatPage() {
  const { data: session, status } = useSession()
  const [sesiones, setSesiones] = useState<Sesion[]>([])
  const [sesionActiva, setSesionActiva] = useState<Sesion | null>(null)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const mensajesEndRef = useRef<HTMLDivElement>(null)

  // Cargar sesiones abiertas al montar
  useEffect(() => {
    if (status !== 'authenticated') return
    
    setLoading(true)
    fetch('/api/chat/admin/sesiones')
      .then(res => res.json())
      .then(data => {
        console.log('Respuesta sesiones:', data)
        if (data.sesiones) {
          setSesiones(data.sesiones)
        } else if (data.error) {
          setError(data.error)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error cargando sesiones:', err)
        setError('Error de conexión')
        setLoading(false)
      })
  }, [status])

  // Escuchar nuevas sesiones globalmente
  useEffect(() => {
    if (!pusherClient) return
    const channel = pusherClient.subscribe('admin-chats')
    channel.bind('nueva-sesion', () => {
      fetch('/api/chat/admin/sesiones')
        .then(res => res.json())
        .then(data => {
          if (data.sesiones) setSesiones(data.sesiones)
        })
    })

    return () => {
      pusherClient?.unsubscribe('admin-chats')
    }
  }, [])

  // Cargar mensajes al cambiar de sesión activa
  useEffect(() => {
    if (!sesionActiva) return

    fetch(`/api/chat/admin/mensajes?id=${sesionActiva.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.mensajes) setMensajes(data.mensajes)
      })

    if (!pusherClient) return
    const channel = pusherClient.subscribe(`chat-sesion-${sesionActiva.id}`)
    channel.bind('nuevo-mensaje', (mensaje: Mensaje) => {
      setMensajes(prev => {
        if (prev.find(m => m.id === mensaje.id)) return prev
        return [...prev, mensaje]
      })
    })

    return () => {
      pusherClient?.unsubscribe(`chat-sesion-${sesionActiva.id}`)
    }
  }, [sesionActiva])

  // Scroll
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoMensaje.trim() || !sesionActiva) return

    const texto = nuevoMensaje
    setNuevoMensaje('')

    const tempId = Date.now()
    setMensajes(prev => [...prev, { id: tempId, remitente_tipo: 'admin', mensaje: texto, creado_en: new Date().toISOString() }])

    try {
      const res = await fetch('/api/chat/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: texto, sesionId: sesionActiva.id, esAdmin: true })
      })
      const data = await res.json()
      if (data.success) {
        setMensajes(prev => prev.map(m => m.id === tempId ? data.mensaje : m))
      }
    } catch(err) {
      console.error(err)
    }
  }

  // Mostrar estado de carga
  if (status === 'loading') {
    return <div className="p-8 text-center text-gray-500">Cargando...</div>
  }

  // Debug: mostrar info del rol
  if (session?.user?.role !== 'Administrador' && session?.user?.role !== 'SuperAdmin') {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-2">Acceso denegado</p>
        <p className="text-xs text-gray-400">
          Tu rol actual: <strong>{session?.user?.role || 'sin rol'}</strong>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Correo: {session?.user?.email || 'no detectado'}
        </p>
        <p className="text-xs text-red-400 mt-3">
          Necesitas cerrar sesión y volver a iniciar sesión para que se actualice tu rol a Administrador.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white rounded-xl shadow-xl overflow-hidden m-4 border border-gray-100">
      
      {/* Lista de Sesiones (Sidebar) */}
      <div className="w-1/3 max-w-sm border-r border-gray-100 bg-slate-50 flex flex-col">
        <div className="p-4 bg-white border-b border-gray-100">
          <h2 className="font-bold text-[#8e1432] flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Bandeja de Entrada
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="p-8 text-center text-sm text-gray-400">Cargando chats...</p>
          ) : error ? (
            <p className="p-8 text-center text-sm text-red-400">{error}</p>
          ) : sesiones.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-400">No hay chats activos</p>
          ) : (
            sesiones.map(s => (
              <button
                key={s.id}
                onClick={() => setSesionActiva(s)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-slate-100 transition-colors ${
                  sesionActiva?.id === s.id ? 'bg-slate-200/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#8e1432]/10 p-2 rounded-full text-[#8e1432]">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-gray-800 truncate">
                      {s.primer_nombre} {s.primer_apellido}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{s.correo_electronico}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Ventana de Chat */}
      <div className="flex-1 flex flex-col bg-white">
        {sesionActiva ? (
          <>
            <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
              <div>
                <h3 className="font-bold text-gray-800">
                  {sesionActiva.primer_nombre} {sesionActiva.primer_apellido}
                </h3>
                <p className="text-xs text-gray-500">{sesionActiva.correo_electronico}</p>
              </div>
              <button className="flex items-center gap-2 text-sm text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 transition-colors">
                <CheckCircle2 className="w-4 h-4" /> Terminar Chat
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 flex flex-col gap-4">
              {mensajes.map(m => (
                <div
                  key={m.id}
                  className={`max-w-[70%] p-3 rounded-2xl ${
                    m.remitente_tipo === 'admin'
                      ? 'bg-blue-600 text-white rounded-tr-none self-end'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none self-start shadow-sm'
                  }`}
                >
                  <p className="text-sm">{m.mensaje}</p>
                  <span className={`text-[10px] mt-1 block ${m.remitente_tipo === 'admin' ? 'text-blue-200 text-right' : 'text-gray-400 text-left'}`}>
                    {new Date(m.creado_en).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              ))}
              <div ref={mensajesEndRef} />
            </div>

            <form onSubmit={enviarMensaje} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
              <input
                type="text"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="flex-1 bg-slate-50 border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!nuevoMensaje.trim()}
                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-slate-50">
            <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
            <p>Selecciona una conversación para empezar a responder</p>
          </div>
        )}
      </div>
    </div>
  )
}
