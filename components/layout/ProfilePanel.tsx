'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Camera, Mail, Phone, User, Save, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'

type UserProfile = {
  id: number
  correo_electronico: string
  imagen: string | null
  telefono: string | null
  primer_nombre: string | null
  segundo_nombre: string | null
  primer_apellido: string | null
  segundo_apellido: string | null
}

export function ProfilePanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      fetch('/api/perfil')
        .then(res => res.json())
        .then(data => {
          if (data.usuario) {
            setProfile(data.usuario)
            setNombre(data.usuario.primer_nombre || '')
            setApellido(data.usuario.primer_apellido || '')
            setTelefono(data.usuario.telefono || '')
          }
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [isOpen])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primer_nombre: nombre, primer_apellido: apellido, telefono })
      })
      setProfile(prev => prev ? { ...prev, primer_nombre: nombre, primer_apellido: apellido, telefono } : prev)
      setEditMode(false)
      setSuccessMsg('¡Datos actualizados!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch(e) {
      console.error(e)
    }
    setSaving(false)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('foto', file)

    try {
      const res = await fetch('/api/perfil/foto', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setProfile(prev => prev ? { ...prev, imagen: data.imagen } : prev)
        setSuccessMsg('¡Foto actualizada!')
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    } catch(e) {
      console.error(e)
    }
    setUploading(false)
  }

  const getInitials = () => {
    if (profile?.primer_nombre) {
      return (profile.primer_nombre[0] + (profile.primer_apellido?.[0] || '')).toUpperCase()
    }
    return session?.user?.email?.[0]?.toUpperCase() || 'U'
  }

  const getDisplayImage = () => {
    if (profile?.imagen) {
      // Si es una URL completa (Google), usarla directamente
      if (profile.imagen.startsWith('http')) return profile.imagen
      return profile.imagen
    }
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-[88px] top-0 bottom-0 w-[360px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#b1193f] to-[#8e1432] p-6 pb-16 relative">
              <div className="flex justify-between items-start">
                <h2 className="text-white font-bold text-lg">Mi Perfil</h2>
                <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Avatar (overlapping header) */}
            <div className="flex flex-col items-center -mt-12 mb-4 relative z-10">
              <div className="relative group">
                {getDisplayImage() ? (
                  <img
                    src={getDisplayImage()!}
                    alt="Foto de perfil"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#c5283d] to-[#8e1432] border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-bold">
                    {loading ? '...' : getInitials()}
                  </div>
                )}
                {/* Upload overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  {uploading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
              {!loading && (
                <p className="text-sm text-gray-400 mt-2">Haz clic en la foto para cambiarla</p>
              )}
            </div>

            {/* Success */}
            {successMsg && (
              <div className="mx-6 mb-3 bg-green-50 text-green-700 text-sm px-4 py-2 rounded-lg border border-green-200 text-center animate-fade-in-up">
                {successMsg}
              </div>
            )}

            {/* Profile Data */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-[#8e1432] animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <User className="w-3.5 h-3.5" /> Nombre
                    </label>
                    {editMode ? (
                      <input
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8e1432]/50 transition-colors"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium bg-slate-50 rounded-lg px-3 py-2.5 text-sm">
                        {profile?.primer_nombre || 'Sin nombre'}
                      </p>
                    )}
                  </div>

                  {/* Apellido */}
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <User className="w-3.5 h-3.5" /> Apellido
                    </label>
                    {editMode ? (
                      <input
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8e1432]/50 transition-colors"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium bg-slate-50 rounded-lg px-3 py-2.5 text-sm">
                        {profile?.primer_apellido || 'Sin apellido'}
                      </p>
                    )}
                  </div>

                  {/* Correo */}
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <Mail className="w-3.5 h-3.5" /> Correo electrónico
                    </label>
                    <p className="text-gray-800 font-medium bg-slate-50 rounded-lg px-3 py-2.5 text-sm">
                      {profile?.correo_electronico || session?.user?.email}
                    </p>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <Phone className="w-3.5 h-3.5" /> Teléfono
                    </label>
                    {editMode ? (
                      <input
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Ej: 442 123 4567"
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8e1432]/50 transition-colors"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium bg-slate-50 rounded-lg px-3 py-2.5 text-sm">
                        {profile?.telefono || 'No registrado'}
                      </p>
                    )}
                  </div>

                  {/* Botones */}
                  <div className="pt-3">
                    {editMode ? (
                      <div className="flex gap-3">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex-1 bg-[#8e1432] text-white py-2.5 rounded-xl font-medium text-sm hover:bg-[#7a0f28] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            setEditMode(false)
                            setNombre(profile?.primer_nombre || '')
                            setApellido(profile?.primer_apellido || '')
                            setTelefono(profile?.telefono || '')
                          }}
                          className="flex-1 bg-slate-100 text-gray-600 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditMode(true)}
                        className="w-full bg-slate-100 text-gray-700 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors"
                      >
                        Editar datos
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
