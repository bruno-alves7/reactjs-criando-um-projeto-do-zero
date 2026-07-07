# Criando um Projeto do Zero

Projeto de estudo em React/Next.js para listar posts de um blog a partir do Prismic, carregar mais publicacoes e renderizar paginas estaticas de cada post.

> Este repositorio e um exercicio. Para producao, revise monitoramento, preview do CMS, acessibilidade, estrategia de cache e politicas de seguranca.

## Stack

- Next.js 16
- React 19
- TypeScript
- Sass modules
- Prismic
- date-fns
- Vitest e Testing Library
- ESLint flat config

## Requisitos

- Node.js 24 LTS
- npm
- Endpoint do Prismic opcional

## Variaveis de ambiente

O projeto roda com posts locais de fallback quando o Prismic nao esta configurado.

Para usar dados reais do Prismic, crie um arquivo `.env.local` com:

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

- Next.js foi atualizado de 10 para 16.
- React foi atualizado de 17 para 19.
- Node alvo atualizado para 24 LTS via `.nvmrc`.
- Jest foi substituido por Vitest, seguindo o padrao do projeto de upload de imagens.
- Testes foram migrados de `.spec.tsx` para `.test.tsx`.
- Setup de teste foi movido para `src/test/setup.tsx`.
- Cobertura minima configurada em 90% para branches, functions, lines e statements.
- Testes cobrem pagina inicial, pagina de post, componentes, fallback local e cliente do Prismic.
- A paginacao da home agora preserva posts ja renderizados, usa a proxima pagina atual e remove o botao quando nao ha mais posts.
- O app passou a ter fallback local quando o Prismic nao esta configurado ou esta indisponivel.
- `prismic-dom` e integracoes antigas de preview foram removidas.
- ESLint foi migrado para flat config moderna.

## Boas praticas aplicadas

- Testes focados em comportamento visivel e contratos de dados.
- Mocks isolados para Prismic, Next Router, Next Image e `fetch`.
- Estado de paginacao tipado com `next_page` nullable.
- Configuracao de cobertura exclui arquivos de bootstrap do Next e arquivos de teste.
- Scripts padronizados com `test`, `test:watch` e `test:coverage`.
- Gerenciamento de dependencias padronizado com `package-lock.json`, como no projeto de upload de imagens.
- Build de producao validado com `next build --webpack`.

## Observacoes

O projeto continua no Pages Router para preservar a arquitetura do exercicio original. A atualizacao moderniza runtime, dependencias, testes e configuracao sem migrar para App Router.

O `npm audit` ainda aponta vulnerabilidade moderada transitiva em `postcss` via Next.js. O fix automatico sugerido pelo npm usa `--force` e faz downgrade quebrador, entao nao foi aplicado. Atualize assim que a cadeia do Next publicar uma versao corrigida.
