// Dados da imobiliária FICTÍCIA usada na demonstração. Tudo o que a IA pode dizer sai daqui.

export const CLINICA = {
  nome: 'Casa Paineira Imóveis',
  tipo: 'imobiliária de locação e venda',
  assistente: 'Bia',
  cidade: 'São Carlos - SP',
  creci: 'CRECI 00000-J (fictício)',
  endereco: 'Rua Exemplo, 789, Centro, São Carlos - SP (endereço fictício)',
  horarios: 'Atendimento na loja de segunda a sexta, das 8h30 às 18h, e sábado das 9h às 13h. Visitas também até as 19h com hora marcada.',
  agenda: { semana: [9, 19], sabado: [9, 13], pausa: 12 },
  garantias: 'Seguro-fiança, caução de 3 aluguéis, título de capitalização ou fiador com imóvel em São Carlos. Para estudantes, aceitamos fiador de outra cidade ou seguro-fiança no nome dos pais.',
  documentos: 'RG e CPF, comprovante de renda (ou de quem paga o aluguel), comprovante de matrícula para estudantes e comprovante de residência.',
  contrato: 'Contratos de 12 ou 30 meses. Para estudantes, contrato de 12 meses com multa proporcional se sair antes. Taxa de contrato: R$ 200. Sem taxa de visita.',
  pagamento: 'Boleto mensal, vencimento escolhido entre os dias 5, 10 e 15.',
}

export type Imovel = {
  id: string
  tipo: 'Kitnet' | 'Studio' | 'Apartamento' | 'Casa' | 'Quarto em república'
  bairro: string
  quartos: number
  area: number
  aluguel: number
  condominio: number
  iptu: number
  mobiliado: boolean
  pet: boolean
  vaga: boolean
  usp: string
  ufscar: string
  destaque: string
  foto: string
}

export const IMOVEIS: Imovel[] = [
  { id: 'CP-101', tipo: 'Kitnet', bairro: 'Centro', quartos: 1, area: 24, aluguel: 950, condominio: 120, iptu: 30, mobiliado: true, pet: false, vaga: false, usp: '8 min a pé da USP (área 1)', ufscar: '20 min de ônibus', destaque: 'Mobiliada, com internet inclusa no condomínio', foto: '/img/im1.jpg' },
  { id: 'CP-102', tipo: 'Studio', bairro: 'Vila Monteiro', quartos: 1, area: 30, aluguel: 1350, condominio: 220, iptu: 45, mobiliado: true, pet: true, vaga: true, usp: '12 min a pé da USP (área 1)', ufscar: '18 min de ônibus', destaque: 'Prédio novo, lavanderia coletiva e bicicletário', foto: '/img/im3.jpg' },
  { id: 'CP-103', tipo: 'Apartamento', bairro: 'Jardim Lutfalla', quartos: 2, area: 58, aluguel: 1700, condominio: 380, iptu: 70, mobiliado: false, pet: true, vaga: true, usp: '10 min de bicicleta', ufscar: '15 min de carro', destaque: 'Sacada, 2 quartos e portaria 24h', foto: '/img/im5.jpg' },
  { id: 'CP-104', tipo: 'Quarto em república', bairro: 'Jardim Paraíso', quartos: 1, area: 14, aluguel: 650, condominio: 0, iptu: 0, mobiliado: true, pet: false, vaga: false, usp: '15 min de ônibus', ufscar: '10 min a pé da UFSCar', destaque: 'Contas divididas, casa com 4 moradores', foto: '/img/im8.jpg' },
  { id: 'CP-105', tipo: 'Kitnet', bairro: 'Jardim Santa Paula', quartos: 1, area: 26, aluguel: 850, condominio: 90, iptu: 25, mobiliado: false, pet: true, vaga: false, usp: '20 min de ônibus', ufscar: '12 min de bicicleta', destaque: 'Aceita pet de pequeno porte, quintal coletivo', foto: '/img/im2.jpg' },
  { id: 'CP-106', tipo: 'Apartamento', bairro: 'Parque Faber Castell', quartos: 3, area: 84, aluguel: 2600, condominio: 520, iptu: 140, mobiliado: false, pet: true, vaga: true, usp: '15 min de carro', ufscar: '12 min de carro', destaque: 'Condomínio com piscina e academia, 1 suíte', foto: '/img/im9.jpg' },
  { id: 'CP-107', tipo: 'Studio', bairro: 'Centro', quartos: 1, area: 32, aluguel: 1500, condominio: 260, iptu: 50, mobiliado: true, pet: false, vaga: false, usp: '6 min a pé da USP (área 1)', ufscar: '20 min de ônibus', destaque: 'Cozinha planejada e ar-condicionado', foto: '/img/im4.jpg' },
  { id: 'CP-108', tipo: 'Casa', bairro: 'Cidade Jardim', quartos: 3, area: 120, aluguel: 2900, condominio: 0, iptu: 160, mobiliado: false, pet: true, vaga: true, usp: '15 min de carro', ufscar: '20 min de carro', destaque: 'Quintal grande, 2 vagas, ideal para família', foto: '/img/im6.jpg' },
  { id: 'CP-109', tipo: 'Apartamento', bairro: 'Jardim Bethânia', quartos: 2, area: 52, aluguel: 1450, condominio: 300, iptu: 55, mobiliado: true, pet: false, vaga: true, usp: '10 min de ônibus', ufscar: '15 min de ônibus', destaque: 'Mobiliado para dividir em dois, perto de mercado', foto: '/img/im7.jpg' },
]

export const custoTotal = (i: Imovel) => i.aluguel + i.condominio + i.iptu

export type Filtros = { preco_max?: number; quartos_min?: number; mobiliado?: boolean; pet?: boolean; perto_de?: 'USP' | 'UFSCar'; tipo?: string; bairro?: string }

export function buscarImoveis(f: Filtros = {}) {
  return IMOVEIS.filter((i) => {
    if (f.preco_max && custoTotal(i) > f.preco_max) return false
    if (f.quartos_min && i.quartos < f.quartos_min) return false
    if (f.mobiliado !== undefined && f.mobiliado !== null && i.mobiliado !== f.mobiliado) return false
    if (f.pet && !i.pet) return false
    if (f.tipo && !i.tipo.toLowerCase().includes(String(f.tipo).toLowerCase())) return false
    if (f.bairro && !i.bairro.toLowerCase().includes(String(f.bairro).toLowerCase())) return false
    if (f.perto_de === 'USP' && !/a pé da USP|bicicleta/.test(i.usp)) return false
    if (f.perto_de === 'UFSCar' && !/a pé da UFSCar|bicicleta/.test(i.ufscar)) return false
    return true
  }).map(({ foto, ...resto }) => ({ ...resto, total_mensal: custoTotal(resto as Imovel) }))
}

const TZ = 'America/Sao_Paulo'
function partes(d: Date) {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', hourCycle: 'h23' })
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]))
  return { data: `${p.year}-${p.month}-${p.day}`, semana: p.weekday as string, hora: Number(p.hour) }
}
function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return (h >>> 0) % 100
}
export type Horario = { data: string; diaSemana: string; hora: string }
const NOMES_DIA: Record<string, string> = { Mon: 'segunda', Tue: 'terça', Wed: 'quarta', Thu: 'quinta', Fri: 'sexta', Sat: 'sábado', Sun: 'domingo' }

/** Horários livres para visita. Parte aparece ocupada para parecer uma agenda real. */
export function horariosLivres(agora = new Date(), dias = 7, ocupados: string[] = []): Horario[] {
  const out: Horario[] = []
  const hoje = partes(agora)
  const { semana: hSemana, sabado: hSabado, pausa } = CLINICA.agenda
  for (let i = 0; i < dias + 3 && out.length < 400; i++) {
    const d = new Date(agora.getTime() + i * 86400000)
    const { data, semana } = partes(d)
    if (semana === 'Sun') continue
    const [abre, fecha] = semana === 'Sat' ? hSabado : hSemana
    for (let h = abre; h < fecha; h++) {
      if (h === pausa && semana !== 'Sat') continue
      if (data === hoje.data && h <= hoje.hora + 1) continue
      const hora = `${String(h).padStart(2, '0')}:00`
      const chave = `${data} ${hora}`
      if (hash(chave) < 45 || ocupados.includes(chave)) continue
      out.push({ data, diaSemana: NOMES_DIA[semana] ?? semana, hora })
    }
  }
  return out
}

export function textoClinica(): string {
  const c = CLINICA
  return [
    `Nome: ${c.nome} (${c.tipo} fictícia de demonstração) - ${c.cidade}. ${c.creci}.`,
    `Endereço da loja: ${c.endereco}`,
    `Horário: ${c.horarios}`,
    `Garantias aceitas: ${c.garantias}`,
    `Documentos para alugar: ${c.documentos}`,
    `Contrato e taxas: ${c.contrato}`,
    `Pagamento: ${c.pagamento}`,
    `A carteira tem ${IMOVEIS.length} imóveis para alugar. Para listar, use SEMPRE a ferramenta buscar_imoveis.`,
  ].join('\n')
}
