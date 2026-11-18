import { useEffect } from 'react'
import Chat, { focarChat } from './Chat'
import { CLINICA, IMOVEIS, custoTotal } from '../shared/clinica'

function irParaChat(e?: React.MouseEvent) {
  e?.preventDefault()
  document.getElementById('atendimento')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setTimeout(focarChat, 450)
}

function perguntar(texto: string) {
  document.getElementById('atendimento')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  window.dispatchEvent(new CustomEvent('chat-enviar', { detail: texto }))
}

const reais = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const ATALHOS = [
  { rotulo: 'Perto da USP', texto: 'Quero um imóvel perto da USP' },
  { rotulo: 'Perto da UFSCar', texto: 'Quero um imóvel perto da UFSCar' },
  { rotulo: 'Até R$ 1.200 por mês', texto: 'O que vocês têm até R$ 1.200 por mês, com tudo incluso?' },
  { rotulo: 'Mobiliado', texto: 'Quero um imóvel mobiliado' },
  { rotulo: 'Aceita pet', texto: 'Preciso de um imóvel que aceite pet' },
  { rotulo: '2 quartos ou mais', texto: 'Procuro imóvel com 2 quartos ou mais' },
]

export default function App() {
  useEffect(() => {
    const alvo = document.getElementById('atendimento')
    if (!alvo || !('IntersectionObserver' in window)) return
    const obs = new IntersectionObserver(([e]) => document.body.classList.toggle('chat-visivel', e.isIntersecting), { threshold: 0.15 })
    obs.observe(alvo)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <p className="aviso-demo">
        Site de demonstração: a Casa Paineira Imóveis não existe. A assistente de IA é real. <a href="#para-empresas">Entenda</a>
      </p>

      <header className="topo">
        <a className="marca" href="/" aria-label="Casa Paineira Imóveis, início">
          <span className="marca-placa">CP</span>
          <span className="marca-nome">Casa Paineira<small>Imóveis · São Carlos</small></span>
        </a>
        <nav aria-label="Seções">
          <a href="#imoveis">Imóveis</a>
          <a href="#como-alugar">Como alugar</a>
          <a href="#contato">Contato</a>
        </nav>
        <a className="btn" href="#atendimento" onClick={irParaChat}>Falar com a Bia</a>
      </header>

      <section className="hero">
        <div className="hero-texto">
          <p className="etiqueta">Aluguel em São Carlos · perto da USP e da UFSCar</p>
          <h1>Seu próximo endereço,<br /><span>sem esperar retorno.</span></h1>
          <p className="lead">A Bia conhece todos os imóveis da carteira. Diga o que você procura e ela mostra as opções com o valor total do mês, tira dúvidas sobre documentos e marca a visita na hora, até de madrugada.</p>
          <p className="atalhos-rotulo">Comece por um filtro:</p>
          <div className="atalhos">
            {ATALHOS.map((a) => (
              <button key={a.rotulo} onClick={() => perguntar(a.texto)}>{a.rotulo}</button>
            ))}
          </div>
        </div>
        <div className="hero-chat" id="atendimento">
          <Chat />
        </div>
      </section>

      <section id="imoveis" className="vitrine">
        <div className="vitrine-cabeca">
          <h2>Disponíveis para alugar</h2>
          <p>{IMOVEIS.length} imóveis · valor total = aluguel + condomínio + IPTU</p>
        </div>
        <div className="grade">
          {IMOVEIS.map((i) => (
            <article key={i.id} className="ficha">
              <div className="ficha-foto">
                <img src={i.foto} alt={`${i.tipo} no ${i.bairro}`} loading="lazy" />
                <span className="ficha-codigo">{i.id}</span>
              </div>
              <div className="ficha-corpo">
                <p className="ficha-tipo">{i.tipo} · {i.bairro}</p>
                <p className="ficha-total">{reais(custoTotal(i))}<small>/mês no total</small></p>
                <p className="ficha-destaque">{i.destaque}</p>
                <dl className="ficha-dados">
                  <div><dt>Área</dt><dd>{i.area} m²</dd></div>
                  <div><dt>Quartos</dt><dd>{i.quartos}</dd></div>
                  <div><dt>Mobiliado</dt><dd>{i.mobiliado ? 'sim' : 'não'}</dd></div>
                  <div><dt>Pet</dt><dd>{i.pet ? 'aceita' : 'não'}</dd></div>
                  <div><dt>USP</dt><dd>{i.usp}</dd></div>
                  <div><dt>UFSCar</dt><dd>{i.ufscar}</dd></div>
                </dl>
                <button className="ficha-botao" onClick={() => perguntar(`Quero visitar o imóvel ${i.id}`)}>Marcar visita ao {i.id}</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="como-alugar" className="faixa-escura">
        <div className="faixa-dentro">
          <h2>Como alugar com a gente</h2>
          <ol className="etapas">
            <li><span>01</span><strong>Escolha e visite</strong><p>A Bia filtra pelo seu orçamento e marca a visita. Sem taxa de visita.</p></li>
            <li><span>02</span><strong>Cadastro</strong><p>{CLINICA.documentos}</p></li>
            <li><span>03</span><strong>Garantia</strong><p>{CLINICA.garantias}</p></li>
            <li><span>04</span><strong>Contrato e chaves</strong><p>{CLINICA.contrato}</p></li>
          </ol>
        </div>
      </section>

      <section id="contato" className="contato">
        <div>
          <h2>Loja no Centro</h2>
          <p className="endereco">{CLINICA.endereco}</p>
          <p>{CLINICA.horarios}</p>
          <p className="creci">{CLINICA.creci}</p>
        </div>
        <div className="contato-chamada">
          <p>Janeiro e fevereiro são os meses mais disputados para quem vai estudar em São Carlos. Garanta sua visita antes.</p>
          <a className="btn amarelo" href="#atendimento" onClick={irParaChat}>Ver horários de visita</a>
        </div>
      </section>

      <section id="para-empresas" className="empresas">
        <div className="empresas-dentro">
          <p className="etiqueta clara">Para imobiliárias e corretores</p>
          <h2>Esta imobiliária não existe.<br /><span>A Bia, sim.</span></h2>
          <p className="lead">Uma assistente de IA ligada à sua carteira de imóveis. Atende no site e no WhatsApp a qualquer hora, filtra por orçamento e região, explica documentos e garantias e marca visitas conferindo a agenda dos corretores.</p>
          <ul className="empresas-lista">
            <li><strong>Lead respondido na hora.</strong>Quem pergunta às 23h já sai com visita marcada, em vez de procurar outra imobiliária.</li>
            <li><strong>Só imóvel real.</strong>Valores e disponibilidade vêm da sua carteira. Se não tiver, ela sugere ajustar o filtro, não inventa.</li>
            <li><strong>Corretor no controle.</strong>Visitas e pedidos de proposta chegam num painel. <a href="/painel">Veja o painel desta demo</a>.</li>
          </ul>
          <a className="btn amarelo" href="https://alansouza.netlify.app" target="_blank" rel="noreferrer">Quero uma assistente assim</a>
          <p className="assinatura">Projeto de Alan Souza, desenvolvedor de IA em São Carlos.</p>
        </div>
      </section>

      <footer className="rodape">Casa Paineira Imóveis é um negócio fictício criado para demonstração. Fotos: Unsplash.</footer>

      <a className="flutuante" href="#atendimento" onClick={irParaChat}>Falar com a Bia</a>
    </>
  )
}
