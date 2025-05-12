![image (3)](https://github.com/user-attachments/assets/56145d79-2fcc-4386-86ac-694c767303cd)

# 🧪 Projeto Comunitário - Realizando Sonhos App

Este repositório faz parte da iniciativa do projeto social  <a src="https://www.realizandosonhos.org.br/">Realizando Sonhos</a> , voltado a transformar a vida de crianças e adolescentes por meio da **educação, acolhimento e oportunidades**.  

O sistema é uma ferramenta para **educadores voluntários** realizarem o **gerenciamento de turmas, alunos, listas de chamada e histórico de presença**.

O projeto é desenvolvido de forma **colaborativa** e **comunitária**. Qualquer pessoa com interesse em tecnologia e impacto social é bem-vinda para contribuir!

## 📌 Como contribuir

Estamos usando as **issues do GitHub como painel Kanban (Scrum)**.  
Cada issue representa uma tarefa, melhoria ou problema a ser resolvido.

> Esse Projeto é completamente livre para contribuir, suas ideias são **valiosas** demais para não serem compartilhadas.

### 🪪 Regras de Contribuição

1. **Escolha uma issue disponível** (com o label `disponível` ou `boa primeira contribuição`), ou crie uma issue viável que você percebe necessidade de ser implementada.
2. Comente na issue pedindo para ser designado(a).
3. Crie uma branch a partir da `main` - seguindo os padrões de nomeação de branch.
5. Envie seu pull request com uma descrição clara da sua contribuição.
6. Aguarde a revisão e feedback.

> 💬 Se tiver dúvidas, abra uma issue ou participe da discussão de uma já existente.

## 📂 Padrões para nomes de branch
### ✅ Exemplos

- `feature/12-criar-turma`
- `fix/23-presenca-nao-salva`
- `refactor/31-ajustar-layout-turmas`
- `docs/45-atualizar-readme`

---

## 📌 Tipos mais comuns

| Prefixo     | Quando usar                                                |
|-------------|-------------------------------------------------------------|
| `feature/`  | Para novas funcionalidades                                  |
| `fix/`      | Para correção de bugs                                       |
| `refactor/` | Para melhorias internas no código sem alteração funcional   |
| `chore/`    | Para tarefas operacionais ou de configuração (ex: lint)     |
| `docs/`     | Para alterações em documentação                             |
| `test/`     | Para adicionar ou ajustar testes automatizados              |

---

## 💡 Dicas adicionais

- Use **letras minúsculas** e **hífens (-)** para separar palavras.
- Sempre que possível, inclua o **número da issue** logo após o tipo.
- Mantenha a descrição **curta e direta**.

## Padrões de Commit:
### ✅ Exemplos

- `feat(turmas): adicionar criação de nova turma`
- `fix(presenca): corrigir erro ao marcar presença`
- `docs(readme): atualizar instruções de contribuição`
- `refactor(alunos): melhorar lógica de associação`
- `chore: atualizar dependências do projeto`

---

### 📌 Tipos de commit

| Tipo       | Descrição                                                                 |
|------------|---------------------------------------------------------------------------|
| `feat`     | Uma nova funcionalidade                                                   |
| `fix`      | Correção de bugs                                                          |
| `docs`     | Alterações na documentação (README, comentários, etc.)                   |
| `style`    | Ajustes de formatação (semântica, espaços, vírgulas etc. sem código novo) |
| `refactor` | Refatorações sem alterar funcionalidades                                 |
| `test`     | Adição ou modificação de testes                                           |
| `chore`    | Tarefas administrativas ou técnicas (ex: configs, scripts, etc.)          |

---

### 💡 Boas práticas

- Use o imperativo no presente: _"add"_, _"fix"_ e não _"added"_ ou _"adding"_.
- Mantenha a descrição curta (máximo 72 caracteres).
- Use escopo entre parênteses **apenas se necessário** para indicar onde a mudança ocorreu (ex: `feat(turmas)`).

---

Seguindo essa convenção, o histórico de commits se torna mais claro, útil e fácil de navegar para toda a comunidade.


## 🧱 Stack do Projeto

- **Next.js (App Router)**
- **TypeScript**
- **TailwindCSS**
- **Supabase** (Auth e Database)
- **Prisma ORM**
- **PostgreSQL** (via Supabase)
- **Shadcn UI** (componentes)

---


## 🚀 Como começar

### 1. **Clone o repositório**

   ```bash
   git clone https://github.com/guirra-byte/realizando-sonhos-app.git
   cd realizando-sonhos
   ```

### 2. Instale as dependências

```bash
npm --force install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` e adicione as seguintes chaves:

```env
# SUPABASE PRISMA CONNECTION URL
DATABASE_URL=""

# GOOGLE OAuth CREDENTIALS
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

---

## 🤝 Contribuindo
Este é um projeto com fins sociais e educacionais. Por isso, contribuições são bem-vindas.

Entre em contato antes de contribuir
Por favor, abra uma issue ou me envie uma mensagem explicando sua intenção de contribuir. Assim conseguimos alinhar objetivos e evitar retrabalho.
Meu contato WhatsApp: `+55 (61) 99283-9756`

## 💙 Sobre o Projeto Realizando Sonhos

Um projeto social dedicado a transformar a vida de crianças e adolescentes por meio da educação e acolhimento.  
Seu código fará parte de uma ferramenta usada por educadores voluntários no dia a dia.
