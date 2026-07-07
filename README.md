# Criando um Projeto do Zero

Projeto de estudo em React/Next.js para listar posts de um blog a partir do Prismic, carregar mais publicacoes e renderizar paginas estaticas de cada post.

> Este repositorio e um exercicio. Para producao, revise versionamento das dependencias, monitoramento, tratamento de erro de API, preview do CMS, acessibilidade e estrategia de cache.

## Stack

- Next.js 10
- React 17
- TypeScript
- Sass modules
- Prismic
- date-fns
- Vitest e Testing Library

## Requisitos

- Node.js 14 ou 16 para build com Next.js 10
- npm
- Endpoint do Prismic

## Variaveis de ambiente

Crie um arquivo `.env.local` com:

```bash
PRISMIC_API_ENDPOINT=https://seu-repositorio.cdn.prismic.io/api/v2
```

## Como rodar

Instale as dependencias:

```bash
npm install
```

Suba a aplicacao:

```bash
npm run dev
```

A aplicacao roda, por padrao, em `http://localhost:3000`.

## Scripts

- `npm run dev`: inicia o Next.js em desenvolvimento.
- `npm run build`: valida TypeScript e gera o build de producao.
- `npm run start`: serve o build gerado.
- `npm run lint`: executa o ESLint.
- `npm run test`: executa a suite de testes uma vez.
- `npm run test:watch`: executa os testes em modo observacao.
- `npm run test:coverage`: executa os testes e valida cobertura minima de 90%.
- `npm run coverage`: alias para `npm run test:coverage`.

## O que foi atualizado

- Jest foi substituido por Vitest, seguindo o padrao do projeto de upload de imagens.
- Testes foram migrados de `.spec.tsx` para `.test.tsx`.
- Setup de teste foi movido para `src/test/setup.tsx`.
- Cobertura minima configurada em 90% para branches, functions, lines e statements.
- Testes cobrem pagina inicial, pagina de post, header e cliente do Prismic.
- A paginacao da home agora preserva posts ja renderizados, usa a proxima pagina atual e remove o botao quando nao ha mais posts.

## Boas praticas aplicadas

- Testes focados em comportamento visivel e contratos de dados.
- Mocks isolados para Prismic, Next Router, Next Image e `fetch`.
- Estado de paginacao tipado com `next_page` nullable.
- Configuracao de cobertura exclui arquivos de bootstrap do Next e arquivos de teste.
- Scripts padronizados com `test`, `test:watch` e `test:coverage`.
- Gerenciamento de dependencias padronizado com `package-lock.json`, como no projeto de upload de imagens.

## Observacoes

O projeto continua no Pages Router e nas versoes originais de Next.js/React para preservar a arquitetura do exercicio. A modernizacao foi concentrada no fluxo de testes, cobertura e pequenos ajustes de qualidade sem reescrever a aplicacao.

Em Node.js 24+, o `next build` do Next.js 10 pode falhar por incompatibilidade com internals do PostCSS bloqueados por `package exports`. Para build de producao, use Node 14/16 ou planeje uma atualizacao maior do Next.js.
