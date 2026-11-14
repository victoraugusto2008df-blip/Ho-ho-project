/**
 * Chaves de demonstração da banca. São as do catálogo do `MockSefazGateway` do backend,
 * mais a de uma nota histórica do seed (já cadastrada, para provar a ReN01).
 */
export const CHAVES_DEMO = {
  /** R$ 65,00 na Zara Shopping Hub. */
  VALIDA_65: '35261111111111000101650010000001010000000101',
  /** R$ 85,00 na Renner Shopping Hub; junto com a anterior atinge a meta de R$ 150,00. */
  VALIDA_85: '35261122222222000102650010000001020000000102',
  /** R$ 55,00 na Fast Shop; depois da meta, prova que não sai um 2º voucher (ReN04). */
  VALIDA_55: '35261155555555000105650010000001030000000103',
  /** Já cadastrada: é a primeira nota histórica do seed (ReN01). */
  DUPLICADA: '35261111111111000101650010000000010000000001',
  /** Emitida há 96 horas (ReN02), em loja credenciada. */
  ANTIGA: '35261111111111000101650010000001050000000105',
  /** CNPJ emissor que não é loja ativa do shopping (RF03). */
  LOJA_NAO_CREDENCIADA: '35261199999999000199650010000001060000000106',
} as const

/** Ordem em que "Simular leitura de QR Code" preenche o campo. */
export const CICLO_SIMULACAO = [CHAVES_DEMO.VALIDA_65, CHAVES_DEMO.VALIDA_85, CHAVES_DEMO.VALIDA_55] as const
