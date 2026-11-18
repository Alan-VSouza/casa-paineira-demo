# Bia · assistente de IA para imobiliárias (demo)

Site de uma imobiliária **fictícia** (Casa Paineira Imóveis, São Carlos-SP) com uma assistente de IA que busca imóveis na carteira, explica documentos e garantias e marca visitas sozinha.

**Teste ao vivo:** https://casa-paineira-demo-alan.vercel.app

- Busca por orçamento total do mês (aluguel + condomínio + IPTU), quartos, mobiliado, pet, bairro e distância da USP ou da UFSCar.
- Os filtros da página e o botão de cada imóvel mandam a pergunta direto para o chat.
- Marca visita conferindo a agenda no servidor e passa para um corretor quando o assunto é proposta, compra ou venda.
- Painel dos corretores em `/painel`.

React 18 + TypeScript + Vite, função serverless na Vercel e Google Gemini com *function calling*. Dados em `shared/clinica.ts`.

Feito por **Alan Souza**, desenvolvedor full-stack e de IA em São Carlos-SP. A Casa Paineira Imóveis não existe. Fotos: Unsplash.
