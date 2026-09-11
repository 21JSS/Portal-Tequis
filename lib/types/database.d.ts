// Auto-generado por script de introspección
// Base de datos: db_tequisquiapan

export interface Atributo {
  id: number;
  nombre: string;
}

export interface AtributoFormulario {
  id: number;
  id_formulario: number;
  id_atributo: number;
  value?: string;
}

export interface Campo {
  id: number;
  type: string;
  id_etiqueta: number;
  id_atributo: number;
}

export interface CampoFormulario {
  id: number;
  name?: string;
  placeholder?: string;
  size?: number;
  maxlength?: number;
  checked?: string;
  disabled?: string;
  readonly?: string;
  src?: string;
  ahref?: string;
  alt?: string;
  cols?: number;
  rows?: number;
  required?: string;
  id_campo: number;
  id_formulario: number;
}

export interface CiSessions {
  id: string;
  ip_address: string;
  timestamp: Date;
  data: Buffer;
}

export interface Concepto {
  id: number;
  concepto: string;
  costo: number;
  id_tramite: number;
}

export interface CorreccionesCiudadanoInspeccion {
  id: number;
  id_solicitud: number;
  id_ciudadano: number;
  id_funcionario: number;
  observaciones: string;
  url: string;
  fecha?: Date;
}

export interface Corte {
  id: number;
  id_tipo_pago: number;
  fecha_corte?: Date;
  costo_corte: number;
}

export interface Cortepredial {
  id: number;
  id_prediosol: number;
  fecha_corte?: Date;
  monto_predial: number;
}

export interface Dependencia {
  id: number;
  nombre: string;
  descripcion: string;
  id_direccion: number;
}

export interface DictamenAlcohol {
  id: number;
  id_solicitud: number;
  id_funcionario: number;
  url: string;
}

export interface Direccion {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Documento {
  id: number;
  nombre: string;
  url: string;
  id_tramite: number;
}

export interface DocumentoCorte {
  id: number;
  id_corte: number;
  id_cortepredial: number;
  monto_total: number;
  tipo_corte: string;
  url: string;
  documento_generado: number;
}

export interface DocumentoSolicitud {
  id: number;
  id_documento: number;
  id_solicitud: number;
  url: string;
  folio: string;
}

export interface Estado {
  id: number;
  nombre: string;
  id_pais: number;
}

export interface Etiqueta {
  id: number;
  nombre: string;
}

export interface Fase {
  id: number;
  noFase: number;
  id_rol?: number;
  anterior: number;
  siguiente: number;
  id_documento?: number;
}

export interface FasePestania {
  id: number;
  estatus: number;
  id_fase: number;
  id_pestania: number;
}

export interface Formulario {
  id: number;
  name: string;
  method: string;
  action?: string;
  title?: string;
}

export interface FuncionarioSolicitud {
  id: number;
  estatus: number;
  fase: number;
  id_solicitud: number;
  id_usuario: number;
  fecha: Date;
}

export interface Giro {
  id: number;
  sector: string;
  grupo: string;
  tipo: string;
  actividad: string;
  descripcion: string;
  vta_alcohol: number;
  alimentos: number;
}

export interface Infosolicitud {
  id: number;
  informacion: string;
  estatus: number;
  id_solicitud: number;
}

export interface Inspeccion {
  id: number;
  url?: string;
  id_solicitud: number;
  id_usuario: number;
  estatus: number;
  fecha: Date;
}

export interface Migrations {
  version: number;
}

export interface Municipio {
  id: number;
  nombre: string;
  id_estado: number;
}

export interface Notificacion {
  id: number;
  estatus: number;
  id_solicitud: number;
  id_usuario: number;
  contenido: string;
  fecha?: Date;
}

export interface OpinionTecnica {
  id: number;
  id_solicitud: number;
  url: string;
  id_funcionario: number;
}

export interface Pago {
  id: number;
  id_solicitud: number;
  id_tramite: number;
  url: string;
  fecha_emision?: Date;
  fecha_vencimiento?: Date;
  folio: string;
  linea_captura: string;
}

export interface Pais {
  id: number;
  nombre: string;
}

export interface Persona {
  id: number;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  fecha_nacimiento?: Date;
  genero?: string;
  id_municipio: number;
  calle?: string;
  colonia?: string;
  numero_interior?: string;
  numero_exterior?: string;
  rfc?: string;
  razon_social?: string;
  tipo_persona?: number;
}

export interface Pestania {
  id: number;
  nombre: string;
  descripcion: string;
  id_documento: number;
}

export interface PestaniaForm {
  id: number;
  genera_documento: number;
  pide_documento: number;
  id_pestania: number;
  id_formulario: number;
  id_tramite: number;
}

export interface Predio {
  id: number;
  lineaCaptura: string;
  ClaveCatastral: string;
  TipoContribucion: string;
  nombreContribuyente: string;
  ubicacionPredio: string;
  numeroExterior: string;
  letra?: string;
  numeroInterior?: string;
  coloniaPredio?: string;
  anoInicialAdeudo: string;
  bimestreInicialAdeudo: string;
  anofinalAdeudo: string;
  bimestrefinalAdeudo: string;
  rezagoAnosAnteriores: number;
  rezagoAnoTranscurre: number;
  impuestoAno: number;
  adicional: number;
  actualización: number;
  Recargo: number;
  requerimientoGastoEjecucion: number;
  embargoGastosEjecucion: number;
  multa: number;
  descuento: number;
  total: number;
  fechaGeneracion: Date;
  vigenciaPago: Date;
}

export interface Prediosol {
  id: number;
  nombreContribuyente: string;
  claveCatrastal: string;
  FOLIO: string;
  lineaCaptura: string;
  total: number;
  url: string;
  fecha_emision?: Date;
  fecha_vencimiento?: Date;
  estatus_vigente: number;
  estatus_pago: number;
  en_corteP: number;
  fecha?: Date;
}

export interface Requisito {
  id: number;
  nombre: string;
  descripcion: string;
  status: number;
}

export interface RequisitoSolicitud {
  id: number;
  url: string;
  estatus: number;
  id_ciudadano: number;
  id_requisito: number;
  id_solicitud: number;
}

export interface RequisitoTramite {
  id: number;
  id_requisito: number;
  id_tramite: number;
  formato: string;
  obligatorio: number;
}

export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Solicitud {
  id: number;
  fecha_inicio?: Date;
  fecha_fin: Date;
  id_tramite: number;
  estatus: number;
  id_ciudadano: number;
  id_funcionario: number;
  id_fase: number;
  costo?: number;
}

export interface SolicitudConstruccion {
  id: number;
  id_solicitud: number;
  id_tipoConstruccion: number;
}

export interface SolicitudCorreccion {
  id: number;
  id_solicitud: number;
  id_funcionario: number;
  observaciones: string;
  fecha: Date;
}

export interface SolicitudGiro {
  id: number;
  impacto?: string;
  id_solicitud: number;
  id_giro: number;
}

export interface Solicitudsubtramite {
  id: number;
  id_solicitud: number;
  id_subTramite: number;
}

export interface Subtramite {
  id: number;
  id_tramite: number;
  nombreSubTramite: string;
  subNumero: string;
}

export interface TipoConstruccion {
  id: number;
  tipo: string;
  descripcion?: string;
}

export interface TipoPago {
  id: number;
  id_solicitud?: number;
  folio: string;
  corte: number;
  fecha?: Date;
  tipo_pago: string;
}

export interface TipoPersona {
  id: number;
  id_solicitud: number;
  tipo: string;
}

export interface TipoSolicitud {
  id: number;
  id_solicitud: number;
  tipo: number;
}

export interface Tramite {
  id: number;
  nombre: string;
  descripcion: string;
  logo: string;
  dirigido: string;
  documentoObtenido: string;
  vigencia: string;
  fundamentoJurudico: string;
  presencial: string;
  id_dependencia: number;
}

export interface TramiteFase {
  id: number;
  genera_documento: number;
  pide_documento: number;
  id_fase: number;
  id_tramite: number;
}

export interface TramitePago {
  id: number;
  id_sol: number;
  costo: number;
  fecha_ini: Date;
  folio?: string;
  url_doc?: string;
}

export interface Usuario {
  id: number;
  correo_electronico: string;
  contrasenia: string;
  imagen?: string;
  telefono?: string;
  id_persona: number;
  id_dependencia?: number;
  status: number;
  extension: number;
  telefono_oficina?: string;
}

export interface UsuarioRol {
  id: number;
  id_rol: number;
  id_usuario: number;
}

export interface Usuariosopinion {
  id: number;
  id_solicitud: number;
  id_funcionario: number;
  estatus: number;
  fecha_dictamen: Date;
}

