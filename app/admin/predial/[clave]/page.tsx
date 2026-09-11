'use client'

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ArrowLeft, User, MapPin, Building2, Tag, CalendarDays, History, AlertCircle, Edit, Banknote, ShieldCheck } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

export default function AdminPredialDetalle() {
  const router = useRouter()
  const params = useParams()
  const clave = typeof params.clave === 'string' ? decodeURIComponent(params.clave) : ''

  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('adeudos') // 'adeudos', 'historial', 'datos'
  
  const [predioInfo, setPredioInfo] = useState<any>(null)
  const [adeudos, setAdeudos] = useState<any[]>([])
  const [historial, setHistorial] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para formulario y acciones
  const [editData, setEditData] = useState({ nombre: '', direccion: '' })
  const [isProcessing, setIsProcessing] = useState(false)
  const [modalConfirm, setModalConfirm] = useState<{isOpen: boolean, action: 'condonar' | 'pagar' | null}>({ isOpen: false, action: null })
  const [modalFeedback, setModalFeedback] = useState<{isOpen: boolean, type: 'success' | 'error', message: string}>({ isOpen: false, type: 'success', message: '' })

  useEffect(() => {
    setMounted(true)
    fetchDetalles()
  }, [clave])

  const fetchDetalles = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/predial/detalles?clave=${encodeURIComponent(clave)}`)
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Error al cargar detalles')
      }
      const data = await res.json()
      setPredioInfo(data.predioInfo)
      setAdeudos(data.adeudos || [])
      setHistorial(data.historial || [])
      if (data.predioInfo) {
        setEditData({
          nombre: data.predioInfo.propietario,
          direccion: data.predioInfo.direccion
        })
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const confirmAction = async () => {
    if (!modalConfirm.action) return;
    const actionToRun = modalConfirm.action;
    setModalConfirm({ isOpen: false, action: null });
    setIsProcessing(true);
    
    try {
      const res = await fetch('/api/admin/predial/pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave, action: actionToRun })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setModalFeedback({ isOpen: true, type: 'success', message: data.message });
      fetchDetalles(); // Recargar datos
    } catch (err: any) {
      setModalFeedback({ isOpen: true, type: 'error', message: `Error: ${err.message}` });
    } finally {
      setIsProcessing(false);
    }
  }

  const handleSaveEdit = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin/predial/editar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave, nombre: editData.nombre, direccion: editData.direccion })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setModalFeedback({ isOpen: true, type: 'success', message: data.message });
      fetchDetalles(); // Recargar datos
    } catch (err: any) {
      setModalFeedback({ isOpen: true, type: 'error', message: `Error: ${err.message}` });
    } finally {
      setIsProcessing(false);
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <p className="text-slate-500 font-semibold animate-pulse">Cargando datos del predio...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !predioInfo) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
          <p className="text-red-500 font-semibold">{error || 'Predio no encontrado'}</p>
          <button onClick={() => router.back()} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">Volver</button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-[1440px] mx-auto space-y-6">
        
        {/* Header con back button */}
        <div className={`flex items-center gap-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Detalle del Predio</h1>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <span className="font-mono bg-slate-200/50 px-2 py-0.5 rounded text-slate-700 font-semibold">{clave}</span>
            </p>
          </div>
        </div>

        {/* Tarjeta de Información General */}
        <div className={`bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6 relative overflow-hidden transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-0" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Propietario / Copropietarios</p>
                  <p className="text-lg font-bold text-slate-900">{predioInfo.propietario}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Dirección del Inmueble</p>
                  <p className="text-sm font-semibold text-slate-700">{predioInfo.direccion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Custom Tabs */}
          <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-xl w-fit mb-6">
            <button 
              onClick={() => setActiveTab('adeudos')}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'adeudos' ? 'bg-[#c5283d] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              <AlertCircle className="w-4 h-4" /> Adeudos y Pagos
            </button>
            <button 
              onClick={() => setActiveTab('historial')}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'historial' ? 'bg-[#c5283d] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              <History className="w-4 h-4" /> Historial
            </button>
            <button 
              onClick={() => setActiveTab('datos')}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'datos' ? 'bg-[#c5283d] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              <Edit className="w-4 h-4" /> Modificar Padrón
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
            
            {activeTab === 'adeudos' && (
              <div>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-lg font-bold text-slate-900">Periodos Adeudados</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setModalConfirm({ isOpen: true, action: 'condonar' })}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-amber-50 text-amber-700 font-semibold text-sm rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Tag className="w-4 h-4" /> Aplicar Condonación
                    </button>
                    <button 
                      onClick={() => setModalConfirm({ isOpen: true, action: 'pagar' })}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-[#c5283d] text-white font-semibold text-sm rounded-lg hover:bg-red-800 shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Banknote className="w-4 h-4" /> Marcar como Pagado
                    </button>
                  </div>
                </div>
                <div className="p-0">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500">Periodo</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 text-right">Impuesto Base</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 text-right">Recargos</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-900 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {adeudos.map((a, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-sm text-slate-700">Bimestre {a.bimestre} del {a.anio}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 text-right">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(a.base)}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 text-right">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(a.recargos)}</td>
                          <td className="px-6 py-4 text-sm font-bold text-[#c5283d] text-right">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(a.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <div className="text-right">
                      <p className="text-sm text-slate-500 mb-1">Adeudo Total Pendiente</p>
                      <p className="text-2xl font-bold text-[#c5283d]">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(adeudos.reduce((acc, curr) => acc + curr.total, 0))}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'historial' && (
              <div>
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">Historial de Pagos</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {historial.map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{h.concepto}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {h.fecha}</span>
                            <span>•</span>
                            <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{h.folio}</span>
                            <span>•</span>
                            <span>Cobrado por: {h.responsable}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(h.monto)}</p>
                        <button className="text-xs font-semibold text-blue-600 hover:underline mt-1">Ver Recibo</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'datos' && (
              <div className="p-8">
                <div className="max-w-2xl bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-800">Modificación de Padrón</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Cualquier cambio realizado en esta sección actualizará la base de datos catastral y dejará un registro de auditoría con su usuario.
                    </p>
                  </div>
                </div>

                <form className="space-y-6 max-w-2xl" onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre del Propietario</label>
                      <input 
                        type="text" 
                        value={editData.nombre}
                        onChange={e => setEditData({...editData, nombre: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-[#c5283d] text-slate-800" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Dirección del Inmueble</label>
                      <input 
                        type="text" 
                        value={editData.direccion}
                        onChange={e => setEditData({...editData, direccion: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-[#c5283d] text-slate-800" 
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className="px-6 py-2.5 rounded-xl bg-[#c5283d] text-white font-semibold hover:bg-red-800 shadow-md transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Modal de Confirmación */}
      {modalConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Confirmar Acción</h3>
              <p className="text-slate-600">
                ¿Estás seguro de que deseas {modalConfirm.action === 'condonar' ? 'aplicar condonación a' : 'marcar como pagado'} este predio? 
                Esta acción modificará la base de datos.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setModalConfirm({ isOpen: false, action: null })}
                className="px-4 py-2 rounded-xl text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmAction}
                className="px-6 py-2 rounded-xl bg-[#c5283d] text-white font-semibold hover:bg-red-800 shadow-md transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Feedback (Éxito o Error) */}
      {modalFeedback.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up text-center">
            <div className="p-8">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${modalFeedback.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {modalFeedback.type === 'success' ? <ShieldCheck className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {modalFeedback.type === 'success' ? '¡Éxito!' : 'Error'}
              </h3>
              <p className="text-slate-600">{modalFeedback.message}</p>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setModalFeedback({ isOpen: false, type: 'success', message: '' })}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900 shadow-md transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
