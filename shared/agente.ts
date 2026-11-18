import { CLINICA, IMOVEIS, buscarImoveis, horariosLivres, textoClinica } from './clinica.js'

// Assistente virtual do negócio fictício. A IA (Google Gemini) só interpreta e redige;
// horários e agendamentos são consultados e validados aqui no servidor.

type Msg = { role: 'user' | 'assistente'; texto: string }
type Acao =
  | { tipo: 'agendamento'; protocolo: string; servico: string; data: string; hora: string; nome: string }
  | { tipo: 'transferencia'; motivo: string; resumo: string }

// Usa a API do Google direto. No Netlify, o AI Gateway também pode injetar GOOGLE_GEMINI_BASE_URL.
const BASE = (process.env.GOOGLE_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com').replace(/\/$/, '')
// Modelos tentados em ordem; o primeiro aceito fica guardado enquanto a função estiver quente.
// O "lite" vem primeiro: no plano grátis do Google é o que responde rápido e sem limite apertado.
const CANDIDATOS = [process.env.GEMINI_MODEL, 'gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3-flash-preview'].filter(Boolean) as string[]
let modeloOk: string | null = null
const MAX_MSGS = 30
const MAX_CHARS = 600

// Limite simples por IP (por instância da função) para a demo pública não ser abusada.
const uso = new Map<string, number[]>()
function limitado(ip: string) {
  const agora = Date.now()
  const janela = (uso.get(ip) || []).filter((t) => agora - t < 10 * 60_000)
  janela.push(agora)
  uso.set(ip, janela)
  return janela.length > 40
}

function hojeSP() {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date())
}

function instrucoes() {
  return `Você é a ${CLINICA.assistente}, assistente virtual da ${CLINICA.nome}, uma ${CLINICA.tipo} em São Carlos. Atenda pelo chat do site, em português do Brasil, de forma simpática, direta e prática. Muitos clientes são estudantes da USP e da UFSCar e seus pais.

Agora é ${hojeSP()} (horário de Brasília).

INFORMAÇÕES DA IMOBILIÁRIA (a única fonte que você pode usar):
${textoClinica()}

REGRAS:
- Responda de forma curta: no máximo 3 frases ou uma lista curta.
- Para falar de imóveis, SEMPRE chame buscar_imoveis com os filtros que a pessoa deu (orçamento total por mês, quartos, mobiliado, pet, perto da USP ou da UFSCar, tipo, bairro). Mostre no máximo 3 opções, cada uma com código, tipo, bairro, **valor total por mês** (aluguel + condomínio + IPTU) e a distância da universidade.
- Se não houver imóvel com os filtros, diga isso e sugira afrouxar um filtro (por exemplo, subir o orçamento ou aceitar não mobiliado). Nunca invente imóvel, valor, endereço ou disponibilidade.
- Para marcar visita: confirme o código do imóvel, dia e hora, peça só o primeiro nome e chame agendar_visita. Antes, consulte ver_horarios e ofereça no máximo 4 horários.
- Não peça CPF, telefone, e-mail nem outros dados pessoais (é uma demonstração).
- Se a ferramenta disser que o horário não está livre, peça desculpas e ofereça outros.
- Não dê conselho jurídico nem prometa aprovação de cadastro. Proposta, negociação de valor e assinatura são com um corretor: chame transferir_para_corretor.
- Se a pessoa pedir um corretor, quiser comprar ou vender imóvel, reclamar, ou o assunto fugir do que você sabe, chame transferir_para_corretor.
- Se perguntarem se você é uma IA ou se a imobiliária é real: diga que é uma assistente de IA de demonstração e que a imobiliária é fictícia, criada por Alan Souza para mostrar como funciona um atendimento com IA.
- Pode usar **negrito** para valores e horários. Não use títulos.`
}

const FERRAMENTAS = [
  {
    functionDeclarations: [
      {
        name: 'buscar_imoveis',
        description: 'Busca imóveis para alugar na carteira da imobiliária. Use sempre antes de citar qualquer imóvel.',
        parameters: {
          type: 'OBJECT',
          properties: {
            preco_max: { type: 'NUMBER', description: 'Valor total máximo por mês em reais (aluguel + condomínio + IPTU).' },
            quartos_min: { type: 'NUMBER' },
            mobiliado: { type: 'BOOLEAN' },
            pet: { type: 'BOOLEAN', description: 'true se precisa aceitar animal de estimação.' },
            perto_de: { type: 'STRING', enum: ['USP', 'UFSCar'], description: 'Perto (a pé ou de bicicleta) de qual universidade.' },
            tipo: { type: 'STRING', description: 'Kitnet, Studio, Apartamento, Casa ou Quarto em república.' },
            bairro: { type: 'STRING' },
          },
        },
      },
      {
        name: 'ver_horarios',
        description: 'Lista horários livres para visita. Use antes de oferecer qualquer horário.',
        parameters: {
          type: 'OBJECT',
          properties: {
            data: { type: 'STRING', description: 'Data desejada no formato AAAA-MM-DD (opcional).' },
            periodo: { type: 'STRING', enum: ['manha', 'tarde', 'noite', 'qualquer'] },
          },
        },
      },
      {
        name: 'agendar_visita',
        description: 'Agenda a visita a um imóvel depois que a pessoa confirmou imóvel, dia, hora e nome.',
        parameters: {
          type: 'OBJECT',
          properties: {
            imovel_id: { type: 'STRING', enum: IMOVEIS.map((i) => i.id) },
            data: { type: 'STRING', description: 'AAAA-MM-DD' },
            hora: { type: 'STRING', description: 'HH:MM' },
            nome: { type: 'STRING', description: 'Primeiro nome' },
          },
          required: ['imovel_id', 'data', 'hora', 'nome'],
        },
      },
      {
        name: 'transferir_para_corretor',
        description: 'Encaminha a conversa para um corretor de verdade.',
        parameters: {
          type: 'OBJECT',
          properties: {
            motivo: { type: 'STRING' },
            resumo: { type: 'STRING', description: 'Resumo curto do que a pessoa procura' },
          },
          required: ['motivo', 'resumo'],
        },
      },
    ],
  },
]

function executar(nome: string, args: any, ocupados: string[], acoes: Acao[]) {
  if (nome === 'buscar_imoveis') {
    const lista = buscarImoveis(args || {})
    return { encontrados: lista.length, imoveis: lista.slice(0, 5), observacao: lista.length ? undefined : 'Nenhum imóvel com esses filtros.' }
  }
  if (nome === 'ver_horarios') {
    let lista = horariosLivres(new Date(), 7, ocupados)
    if (args?.data) lista = lista.filter((h) => h.data === args.data)
    if (args?.periodo === 'manha') lista = lista.filter((h) => h.hora < '12:00')
    if (args?.periodo === 'tarde') lista = lista.filter((h) => h.hora >= '13:00' && h.hora < '18:00')
    if (args?.periodo === 'noite') lista = lista.filter((h) => h.hora >= '18:00')
    return { horarios: lista.slice(0, 8), observacao: lista.length ? undefined : 'Nenhum horário livre com esse filtro.' }
  }
  if (nome === 'agendar_visita') {
    const imovel = IMOVEIS.find((i) => i.id === args?.imovel_id)
    const hora = String(args?.hora || '').slice(0, 5)
    const livre = horariosLivres(new Date(), 7, ocupados).some((h) => h.data === args?.data && h.hora === hora)
    if (!imovel) return { ok: false, erro: 'Imóvel inválido.' }
    if (!livre) return { ok: false, erro: 'Esse horário não está livre. Consulte ver_horarios de novo.' }
    const nomeCliente = String(args?.nome || '').trim().split(/\s+/)[0]?.slice(0, 30) || 'Cliente'
    const protocolo = 'CP' + Math.random().toString(36).slice(2, 7).toUpperCase()
    const servico = `Visita ${imovel.id} · ${imovel.tipo} no ${imovel.bairro}`
    ocupados.push(`${args.data} ${hora}`)
    acoes.push({ tipo: 'agendamento', protocolo, servico, data: args.data, hora, nome: nomeCliente })
    return { ok: true, protocolo, imovel: imovel.id, data: args.data, hora, nome: nomeCliente, ponto_de_encontro: 'Na frente do imóvel; o corretor confirma o endereço exato pelo WhatsApp.' }
  }
  if (nome === 'transferir_para_corretor') {
    acoes.push({ tipo: 'transferencia', motivo: String(args?.motivo || '').slice(0, 200), resumo: String(args?.resumo || '').slice(0, 300) })
    return { ok: true, mensagem: 'Conversa enviada para um corretor. Em horário comercial, ele responde em poucos minutos.' }
  }
  return { ok: false, erro: 'Ferramenta desconhecida.' }
}

function json(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), { status, headers: { 'content-type': 'application/json; charset=utf-8' } })
}

export async function atender(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ erro: 'Use POST.' }, 405)
  const chave = process.env.GEMINI_API_KEY
  if (!chave) return json({ resposta: 'A assistente está em manutenção no momento. Tente de novo mais tarde.', acoes: [] })

  const ip = req.headers.get('x-real-ip') || req.headers.get('x-nf-client-connection-ip') || (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim()
  if (limitado(ip)) return json({ resposta: 'Muitas mensagens em pouco tempo. Aguarde alguns minutos e tente de novo.', acoes: [] }, 429)

  let corpo: { mensagens?: Msg[]; agendados?: string[] }
  try {
    corpo = await req.json()
  } catch {
    return json({ erro: 'JSON inválido.' }, 400)
  }
  const mensagens = (corpo.mensagens || []).slice(-MAX_MSGS).filter((m) => m && typeof m.texto === 'string' && (m.role === 'user' || m.role === 'assistente'))
  if (!mensagens.length || mensagens[mensagens.length - 1].role !== 'user') return json({ erro: 'Envie a mensagem do usuário.' }, 400)
  const ocupados = (corpo.agendados || []).filter((s) => typeof s === 'string').slice(0, 50)

  const contents: any[] = mensagens.map((m) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.texto.slice(0, MAX_CHARS) }] }))
  const acoes: Acao[] = []

  for (let passo = 0; passo < 5; passo++) {
    const corpoReq = JSON.stringify({
      systemInstruction: { parts: [{ text: instrucoes() }] },
      contents,
      tools: FERRAMENTAS,
      generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
    })
    const fila = modeloOk ? [modeloOk, ...CANDIDATOS.filter((m) => m !== modeloOk)] : CANDIDATOS
    const chamar = async (modelo: string, ms: number, cancelar?: AbortSignal): Promise<Response> => {
      try {
        const sinais = [AbortSignal.timeout(ms), ...(cancelar ? [cancelar] : [])]
        const resp = await fetch(`${BASE}/v1beta/models/${modelo}:generateContent`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': chave },
          body: corpoReq,
          signal: AbortSignal.any(sinais),
        })
        if (!resp.ok) console.log('MODELO_FALHOU ' + modelo + ' ' + resp.status + ' ' + (await resp.clone().text()).slice(0, 160).replace(/\s+/g, ' '))
        return resp
      } catch {
        return new Response('{}', { status: 504 })
      }
    }

    // Um modelo por vez (chamadas em paralelo gastam o dobro da cota grátis do Google).
    // Se um estiver sobrecarregado, sem cota ou travado, passa para o próximo.
    let r: Response = new Response('{}', { status: 504 })
    for (const modelo of fila) {
      r = await chamar(modelo, 8000)
      if (r.ok) {
        modeloOk = modelo
        break
      }
      if (r.status >= 500 || r.status === 429) continue
      const txt = await r.clone().text()
      if (!/unknown_model|not found|suitable provider|not supported|no longer available/i.test(txt)) break
    }
    if (!r.ok) {
      console.log('ERRO_GEMINI status=' + r.status + ' corpo=' + (await r.text()).slice(0, 300).replace(/\s+/g, ' '))
      const msg = r.status === 429 ? 'A demonstração atingiu o limite de uso por agora. Tente de novo em alguns minutos.' : 'Tive um problema para responder agora. Pode tentar de novo?'
      return json({ resposta: msg, acoes })
    }
    const dados: any = await r.json()
    const partes: any[] = dados?.candidates?.[0]?.content?.parts || []
    const chamadas = partes.filter((p) => p.functionCall)
    if (!chamadas.length) {
      const texto = partes.map((p) => p.text || '').join('').trim()
      return json({ resposta: texto || 'Desculpe, não entendi. Pode reformular?', acoes })
    }
    contents.push({ role: 'model', parts: partes })
    contents.push({
      role: 'user',
      parts: chamadas.map((p) => ({
        functionResponse: { name: p.functionCall.name, response: executar(p.functionCall.name, p.functionCall.args, ocupados, acoes) },
      })),
    })
  }
  return json({ resposta: 'Desculpe, me enrolei aqui. Pode repetir o que precisa?', acoes })
}

