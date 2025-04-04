# 🧪 Desafio Técnico - Desenvolvedor Next.js  

**Projeto: Realizando Sonhos - Sistema de Gerenciamento de Alunos e Turmas**

## 📚 Visão Geral

Este projeto é parte de um sistema de gerenciamento de alunos para o projeto social **Realizando Sonhos**, voltado para o controle de **turmas**, **alunos**, **lista de chamada** e **histórico de presença**.

O sistema já está parcialmente implementado em **Next.js (App Router)**. Seu desafio será **completar funcionalidades-chave relacionadas ao serviço de turmas** e **associação de alunos**.

### 📁 Diretório `/components/turmas`

Dentro do diretório `/components/turmas` você encontrará os componentes já criados para o gerenciamento de turmas (tais componentes podem conter erros).  
Você deverá completar e integrar as funcionalidades de **criar, editar, deletar e atualizar turmas**, além de **adicionar alunos às turmas**.  
Também está incluída a estrutura para a **lista de chamada** e o **histórico de presença dos alunos**.

- Se você está vendo este repositório você também tem acesso ao **v0** do Projeto (para saber como a interface deverá se parecer e funcionar) e ao **Supabase DB**.

## 🎯 Objetivo do Desafio

Você deverá implementar e/ou completar as seguintes funcionalidades:

### ✅ Funcionalidades de Turmas

- Criar nova turma
- Editar turma existente
- Deletar turma
- Atualizar dados da turma (nome, dias da semana, turno, etc.)

### ✅ Associação de Alunos

- Atribuir alunos a suas respectivas turmas
- Visualizar alunos por turma

### ✅ Lista de Chamada

- Criar sistema de lista de presença por turma
- Marcar presença de alunos em datas específicas
- Armazenar histórico de presença por aluno e turma

## 🧱 Stack Utilizada

- **Next.js** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Supabase** (Auth e Database)
- **Shadcn UI** (componentes)
- **PostgreSQL** (via Supabase)
- **Prisma ORM**

## 🚀 Como começar

### 1. **Clone o repositório**

   ```bash
   git clone https://github.com/guirra-byte/realizando-sonhos-app.git
   cd realizando-sonhos

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` com base no `.env.example` e adicione as seguintes chaves do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

---

## ✍️ O que será avaliado

- Organização e estrutura do código  
- Boas práticas com React/Next.js (hooks, componentes, etc.)  
- Clareza e reutilização de código  
- Uso correto do Supabase (CRUD de turmas, relacionamento com alunos)  
- UX simples e funcional para uso em um projeto social  

## 📦 Extras (Opcional)

Se quiser ir além, você pode implementar:

- Confirmação antes de deletar turma ou aluno  

## 📩 Entrega

Crie um repositório **privado** (com acesso compartilhado) no GitHub e envie o link para o revisor.

## 💙 Sobre o Projeto Realizando Sonhos

Um projeto social dedicado a transformar a vida de crianças e adolescentes por meio da educação e acolhimento.  
Seu código fará parte de uma ferramenta usada por educadores voluntários no dia a dia.

---

Se tiver dúvidas, fique à vontade para abrir uma *Issue* ou entrar em contato com a equipe de suporte do desafio.

**Boa sorte!** 🚀
