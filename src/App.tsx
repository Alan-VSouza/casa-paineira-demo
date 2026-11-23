import { useEffect } from 'react'
import Chat from './Chat'
import { CLINICA, IMOVEIS, custoTotal, type Imovel } from '../shared/clinica'

const reais = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const ESTUDANTES = ['CP-101', 'CP-107', 'CP-102', 'CP-105', 'CP-104']
const FAMILIAS = ['CP-103', 'CP-109', 'CP-106', 'CP-108']
const im = (id: string) => IMOVEIS.find((x) => x.id === id)!

const ARROW = (
  <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true"><path className="m-arrow__stem" d="M1 6h8" /><path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" /></svg>
)

const KIT = ['/assets/system.js', '/assets/motion/motion.js', '/assets/layout/layout.js']

function usarKit() {
  useEffect(() => {
    if (document.querySelector('script[data-kit]')) return
    for (const src of KIT) {
      const el = document.createElement('script')
      el.type = 'module'
      el.src = src
      el.dataset.kit = ''
      document.head.appendChild(el)
    }
  }, [])
}

function Vitrine({ ids, titulo, linha, secao }: { ids: string[]; titulo: string; linha: string; secao: string }) {
  const lista: Imovel[] = ids.map(im)
  return (
    <section className="section" id={secao} aria-labelledby={secao + '-h'} style={{ ['--hm' as string]: 2 }}>
      <div className="wrap">
        <div className="section-head"><h2 id={secao + '-h'}>{titulo}</h2><p>{linha}</p></div>
        <div className="grid grid--top fill" data-peek>
          <ul className="rows span-5">
            {lista.map((i) => (
              <li key={i.id} data-peek-to={i.id} tabIndex={0}>
                <span className="rows__name">{i.tipo} no {i.bairro}</span>
                <p>{i.destaque}. {i.area} m², {i.quartos} {i.quartos === 1 ? 'quarto' : 'quartos'}.</p>
                <span className="rows__value">{reais(custoTotal(i))}/mês</span>
              </li>
            ))}
          </ul>
          <div className="frame frame--photo frame--fill span-6 start-7">
            {lista.map((i, k) => (
              <img key={i.id} className="frame__img" data-peek-for={i.id} src={i.foto} alt={`${i.tipo} no ${i.bairro}, ${i.destaque.toLowerCase()}`} hidden={k > 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  usarKit()

  return (
    <>
      <header className="nav">
        <div className="wrap nav__bar">
          <a className="skip-link" href="#top">Pular para o conteúdo</a>
          <a className="nav__logo" href="#top">Casa Paineira</a>
          <nav className="nav__links" aria-label="Principal">
            <div className="nav__item">
              <a className="nav__link" href="#estudantes">Imóveis <svg className="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
              <div className="nav__menu">
                <div className="wrap grid">
                  <div className="menu-col span-3">
                    <p className="t-label">Estudantes</p>
                    <a href="#estudantes">Kitnets e studios<span>Perto da USP, desde R$ 965</span></a>
                    <a href="#estudantes">Quarto em república<span>A 10 min da UFSCar</span></a>
                  </div>
                  <div className="menu-col span-3">
                    <p className="t-label">Famílias</p>
                    <a href="#familias">Apartamentos<span>2 e 3 quartos, com vaga</span></a>
                    <a href="#familias">Casa com quintal<span>Cidade Jardim, 2 vagas</span></a>
                  </div>
                  <a className="menu-card span-3 start-10" href="#como-alugar">
                    <div className="panel"><img className="frame__img" src="/img/contrato.jpg" alt="Pessoa assinando um contrato sobre a mesa" /></div>
                    <span className="t-card">Sem taxa de visita</span>
                    <span className="t-small muted">Contrato de 12 ou 30 meses</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="nav__item"><a className="nav__link" href="#como-alugar">Contrato</a></div>
            <div className="nav__item"><a className="nav__link" href="#loja">Loja</a></div>
            <div className="nav__item"><a className="nav__link" href="#para-empresas">Empresas</a></div>
          </nav>
          <div className="nav__actions">
            <a className="btn btn--primary" href="#agendar">Marcar visita com a Bia{ARROW}</a>
          </div>
          <button className="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero hero--photo" data-enter data-calm="left" aria-labelledby="hero-h">
          <img className="hero__bg" src="/img/predio.jpg" alt="Prédio residencial com varandas ao entardecer" style={{ ['--ly-pos' as string]: '70% 50%', ['--ly-pos-phone' as string]: '80% 50%' }} {...{ fetchpriority: 'high' }} />
          <div className="wrap"><div className="hero-text">
            <div className="hero__text">
              <p className="hero__kicker"><span className="dot" aria-hidden="true" />Demonstração: imobiliária fictícia, assistente real</p>
              <h1 id="hero-h">Imobiliária em São Carlos</h1>
              <p className="hero__lead">Aluguel perto da USP e da UFSCar, com condomínio e IPTU já somados no valor.</p>
              <div className="btn-row">
                <a className="btn btn--primary" href="#agendar">Marcar visita com a Bia{ARROW}</a>
                <a className="btn btn--secondary" href="#estudantes">Ver os 9 imóveis</a>
              </div>
            </div>
          </div></div>
        </section>

        <Vitrine secao="estudantes" titulo="Imóveis perto da USP e da UFSCar" linha="Valor total do mês: aluguel, condomínio e IPTU. Passe o mouse ou toque para ver cada um." ids={ESTUDANTES} />

        <section className="section" id="agendar" aria-labelledby="agendar-h" style={{ ['--hm' as string]: 2 }}>
          <div className="wrap">
            <div className="grid fill">
              <div className="span-5 stack-4">
                <h2 id="agendar-h">Busca e visita pelo chat da Bia</h2>
                <p className="t-lead">Diga o orçamento, a faculdade ou o bairro. A Bia mostra só imóveis da carteira com o valor total e marca a visita na agenda dos corretores.</p>
                <p>Ela também explica documentos e garantias, e passa a conversa para um corretor quando você pedir uma proposta.</p>
              </div>
              <div className="span-6 start-7 chat-frame" id="atendimento" data-visual data-ui="bia">
                <Chat />
              </div>
            </div>
          </div>
        </section>

        <Vitrine secao="familias" titulo="4 imóveis para famílias" linha="Dois e três quartos, com vaga. Todos aceitam conversa sobre pet com o corretor." ids={FAMILIAS} />

        <section className="section ground-inverse" id="como-alugar" style={{ ['--h' as string]: 2 }} data-moment="pinned-chapters" aria-labelledby="como-alugar-h">
          <div className="wrap mo-pc__grid">
            <div className="mo-pc__text">
              <h2 id="como-alugar-h">Do primeiro contato às chaves em 3 etapas</h2>
              <ol className="mo-pc__steps">
                <li className="mo-pc__step">
                  <h3>Visita sem taxa</h3>
                  <p>A Bia filtra pelo orçamento e marca a visita com um corretor.</p>
                  <figure className="mo-pc__visual"><img src="/img/visita.jpg" alt="Sala vazia de apartamento com piso de madeira e porta para a varanda" width="1600" height="1069" /></figure>
                </li>
                <li className="mo-pc__step">
                  <h3>Cadastro na imobiliária</h3>
                  <p>RG, CPF e renda. Seguro-fiança, caução ou fiador, que pode ser de outra cidade.</p>
                  <figure className="mo-pc__visual"><img src="/img/contrato.jpg" alt="Pessoa assinando um contrato sobre a mesa" width="1600" height="1068" /></figure>
                </li>
                <li className="mo-pc__step">
                  <h3>Contrato de 12 ou 30 meses</h3>
                  <p>Taxa de R$ 200 e chaves na assinatura. Vencimento no dia 5, 10 ou 15.</p>
                  <figure className="mo-pc__visual"><img src="/img/chaves.jpg" alt="Mão entregando as chaves na porta de um apartamento" width="1600" height="1067" /></figure>
                </li>
              </ol>
            </div>
            <div className="mo-pc__visuals frame" />
          </div>
        </section>

        <section className="section" id="loja" aria-labelledby="loja-h">
          <div className="wrap">
            <div className="grid grid--top fill">
              <div className="span-5 stack-4">
                <h2 id="loja-h">Loja no Centro de São Carlos</h2>
                <address className="visit__address">Centro<br />São Carlos</address>
                <a className="link" href="https://www.openstreetmap.org/search?query=Centro%20S%C3%A3o%20Carlos">Ver a região no mapa</a>
                <dl className="hours" data-tz="America/Sao_Paulo" data-assumed="">
                  <dt data-days="mon-fri">Segunda a sexta</dt><dd>8h30 às 18h</dd>
                  <dt data-days="sat">Sábado</dt><dd>9h às 13h</dd>
                  <dt data-days="sun">Domingo</dt><dd>Fechado</dd>
                </dl>
                <p>Visitas aos imóveis até as 19h, com hora marcada.</p>
              </div>
              <div className="frame frame--photo span-6 start-7 foto-loja">
                <img className="frame__img" src="/img/predio-branco.jpg" alt="Prédio residencial branco com sacadas entre árvores" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="para-empresas" aria-labelledby="para-empresas-h" style={{ ['--hm' as string]: 2 }}>
          <div className="wrap">
            <div className="grid grid--top fill">
              <div className="span-5 stack-4">
                <p className="t-label">Para imobiliárias e corretores</p>
                <h2 id="para-empresas-h">Uma Bia para a sua imobiliária</h2>
                <p>A Casa Paineira é fictícia; a Bia, não. Ela atende no site e no WhatsApp ligada à sua carteira de imóveis.</p>
                <ul className="rows">
                  <li><span className="rows__name">Lead respondido na hora</span><p>Quem pergunta às 23h já sai com visita marcada.</p></li>
                  <li><span className="rows__name">Só imóvel da carteira</span><p>Valores e disponibilidade vêm do seu cadastro. Ela não inventa.</p></li>
                  <li><span className="rows__name">Painel para os corretores</span><p>Visitas e pedidos de proposta num só lugar. <a className="link" href="/painel">Abrir o painel desta demo</a></p></li>
                </ul>
                <div className="btn-row"><a className="btn btn--primary" href="https://wa.me/5519994450160?text=Oi%2C%20Alan%21%20Vi%20a%20demonstra%C3%A7%C3%A3o%20da%20Bia%20e%20quero%20uma%20assistente%20assim%20para%20a%20minha%20imobili%C3%A1ria." target="_blank" rel="noreferrer">Quero uma Bia na minha imobiliária</a></div>
                <p className="t-small muted">Fala direto com o Alan Souza, desenvolvedor de IA em São Carlos, pelo WhatsApp. <a className="link" href="https://alansouza.netlify.app" target="_blank" rel="noreferrer">Ver o portfólio</a></p>
              </div>
              <div className="frame frame--photo span-6 start-7" style={{ aspectRatio: '4 / 5', maxHeight: 708, width: '100%' }}>
                <img className="frame__img" src="/img/chaves-mesa.jpg" alt="Molho de chaves sobre uma mesa de madeira" loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer closing footer--dark ground-inverse" id="contact" aria-labelledby="close-h">
        <div className="wrap">
          <div className="closing__cta close--photo">
            <div className="section-head--split">
              <div><h2 id="close-h">Visitas de segunda a sábado, sem taxa</h2><p className="t-lead">{CLINICA.pagamento}</p></div>
              <a className="btn btn--primary" href="#agendar">Marcar visita com a Bia{ARROW}</a>
            </div>
            <div className="close__media"><img src="/img/mudanca.jpg" alt="Mulher desembalando caixas de mudança na sala" loading="lazy" /></div>
          </div>
          <div className="closing__links">
            <div className="grid">
              <div className="span-4 stack-4">
                <a className="nav__logo" href="#top">Casa Paineira</a>
                <p className="footer__lede">Imobiliária fictícia de locação em São Carlos, criada para demonstrar uma assistente de IA.</p>
              </div>
              <div className="span-2 footer__col"><h3>Imóveis</h3><ul><li><a href="#estudantes">Estudantes</a></li><li><a href="#familias">Famílias</a></li></ul></div>
              <div className="span-2 footer__col"><h3>Aluguel</h3><ul><li><a href="#como-alugar">Contrato</a></li><li><a href="#loja">Loja</a></li></ul></div>
              <div className="span-2 footer__col"><h3>Visitas</h3><ul><li><a href="#atendimento">Chat com a Bia</a></li><li><a href="/painel">Painel</a></li></ul></div>
              <div className="span-2 footer__col"><h3>Empresas</h3><ul><li><a href="#para-empresas">Como funciona</a></li><li><a href="https://wa.me/5519994450160?text=Oi%2C%20Alan%21%20Vi%20a%20demonstra%C3%A7%C3%A3o%20da%20Bia%20e%20quero%20uma%20assistente%20assim%20para%20a%20minha%20imobili%C3%A1ria." target="_blank" rel="noreferrer">Contratar</a></li></ul></div>
            </div>
            <div className="footer__legal">
              <span>&copy; 2026 Casa Paineira Imóveis, negócio fictício</span>
              <div className="socials" />
              <span className="credits">Fotos via Unsplash</span>
            </div>
          </div>
        </div>
      </footer>

      <nav className="actionbar" aria-label="Ações rápidas">
        <a className="btn btn--primary" href="#agendar">Marcar visita com a Bia</a>
      </nav>
    </>
  )
}
