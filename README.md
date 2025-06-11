# 📝 Task Manager App

Um aplicativo moderno de gerenciamento de tarefas construído com React, TypeScript e styled-components. O projeto oferece uma interface intuitiva para criar, organizar e acompanhar suas tarefas diárias com recursos avançados como sugestões de horário e filtros inteligentes.

![Task Manager App](https://img.shields.io/badge/React-v19.1.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.8.3-blue.svg)
![Jest](https://img.shields.io/badge/Jest-v29.7.0-green.svg)
![Coverage](https://img.shields.io/badge/Coverage->95%25-brightgreen.svg)

## ✨ Funcionalidades

### 🎯 Gerenciamento de Tarefas

- ✅ Criar, editar e excluir tarefas
- 📅 Definir prazos e durações estimadas
- 🏷️ Categorizar tarefas (trabalho, pessoal, estudos, etc.)
- ⭐ Sistema de prioridades (alta, média, baixa)
- ✔️ Marcar tarefas como concluídas

### 🔍 Organização e Filtros

- 🔎 Busca por título e descrição
- 📊 Filtros por status, categoria e prioridade
- 📈 Ordenação por data, prioridade ou nome
- 📱 Interface responsiva para todos os dispositivos

### 🎨 Interface e UX

- 🌙 Modo escuro/claro
- 🎨 Design moderno com styled-components
- ♿ Acessibilidade completa (ARIA)
- 🔄 Animações e transições suaves
- 📱 PWA Ready

### 🤖 Recursos Inteligentes

- ⏰ Sugestões automáticas de horário
- 📊 Dashboard com estatísticas
- 💾 Cache local para performance
- 🔔 Sistema de notificações (Toast)
- 📋 Preview em tempo real de tarefas

## 🚀 Performance

### ✅ Implementado

- **Lazy Loading de Componentes**: Componentes principais carregados sob demanda
- **Code Splitting**: Bundle dividido em chunks otimizados
- **Otimização de Bundle**:
  - Análise visual com rollup-plugin-visualizer
  - Chunks manuais para vendor libraries
  - Tree shaking automático
- **Cache de Requisições**: Sistema completo com Workbox 7.0
- **Offline Support**: PWA totalmente funcional
- **Core Web Vitals**: Monitoramento de métricas de performance

### 🔄 Lazy Loading Atual

```typescript
// Componentes com lazy loading
const TaskList = lazy(() => import("../TaskList/TaskList"));
const TaskForm = lazy(() => import("../TaskForm/TaskForm"));
const TaskDetail = lazy(() => import("../../components/TaskDetail/TaskDetail"));
```

### 🔄 Workbox Service Worker

```javascript
✅ Precaching de assets críticos
✅ Cache NetworkFirst para API calls
✅ Cache CacheFirst para imagens
✅ Cache StaleWhileRevalidate para CSS/JS
✅ Cache NetworkFirst para navegação
✅ Cleanup automático de caches antigos
```

### 📊 Core Web Vitals

```typescript
// Métricas monitoradas automaticamente:
✅ LCP - Largest Contentful Paint
✅ INP - Interaction to Next Paint (substitui FID)
✅ CLS - Cumulative Layout Shift
✅ FCP - First Contentful Paint
✅ TTFB - Time to First Byte
```

## 🛠️ Tecnologias Utilizadas

### Frontend Core

- **React 19.1.0** - Framework JavaScript para UI
- **TypeScript 5.8.3** - Tipagem estática
- **Vite 6.3.5** - Build tool e dev server

### Styling & UI

- **Styled Components 6.1.18** - CSS-in-JS
- **React Icons 5.5.0** - Biblioteca de ícones

### Roteamento

- **React Router 7.6.2** - Roteamento client-side

### HTTP Client

- **Axios 1.9.0** - Cliente HTTP para API

### Testes

- **Jest 29.7.0** - Framework de testes
- **Testing Library** - Testes de componentes React
  - `@testing-library/react 16.3.0`
  - `@testing-library/jest-dom 6.6.3`
  - `@testing-library/user-event 14.6.1`
- **Jest Environment JSDOM 30.0.0** - Ambiente DOM para testes

### Desenvolvimento

- **ESLint 9.25.0** - Linting de código
- **Babel** - Transpilação de código
- **SWC** - Compilação rápida
- **JSON Server** - Mock API para desenvolvimento

## 📁 Estrutura do Projeto

```bash
src/
├── components/           # Componentes reutilizáveis
│   ├── TaskCard/        # Card de tarefa
│   ├── PriorityBadge/   # Badge de prioridade
│   ├── CategoryFilter/  # Filtro de categorias
│   ├── TaskDetail/      # Detalhes da tarefa
│   ├── TimeSuggestions/ # Sugestões de horário
│   ├── DeleteConfirmModal/ # Modal de confirmação
│   ├── Toast/           # Notificações
│   ├── Layout/          # Layout principal
│   ├── Navigation/      # Navegação
│   └── ThemeToggle/     # Alternador de tema
├── screens/             # Páginas/Telas
│   ├── Dashboard/       # Painel principal
│   ├── TaskList/        # Lista de tarefas
│   ├── TaskForm/        # Formulário de tarefa
│   ├── TaskPage/        # Container de páginas
│   └── TaskDetailPage/  # Página de detalhes
├── contexts/            # Context API
│   ├── TaskContext.tsx  # Estado global de tarefas
│   ├── ThemeContext.tsx # Tema da aplicação
│   └── ToastContext.tsx # Notificações
├── hooks/               # Custom hooks
│   ├── useTasks.ts      # Hook de tarefas
│   └── useToast.ts      # Hook de notificações
├── services/            # Serviços externos
│   ├── api.ts           # Cliente da API
│   └── cache.ts         # Sistema de cache
├── styles/              # Estilos globais
│   ├── globalStyles.ts  # Estilos globais
│   └── theme.ts         # Tema da aplicação
└── types/               # Definições de tipos
    └── index.ts         # Tipos globais
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. **Clone o repositório**

```bash
git clone <repository-url>
cd task-manager-app
```

2. **Instale as dependências**

```bash
npm install
```

3. **Inicie o servidor de desenvolvimento (API Mock)**

```bash
npm run json-server
```

> O servidor JSON rodará na porta 3001

4. **Em outro terminal, inicie a aplicação**

```bash
npm run dev
```

> A aplicação estará disponível em http://localhost:5173

## 📊 Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run json-server  # Inicia API mock (porta 3001)
npm run build        # Build para produção
npm run preview      # Preview do build de produção
npm run lint         # Executa linting do código
```

### Testes

```bash
npm test            # Executa todos os testes (modo silencioso)
npm run test:debug  # Executa testes com output detalhado
npm run test:watch  # Executa testes em modo watch
```

## 🧪 Testes

O projeto possui uma cobertura de testes robusta com **+95% de cobertura**:

### Tipos de Teste

- **Testes Unitários** - Componentes individuais
- **Testes de Integração** - Interação entre componentes
- **Testes de Context** - Providers e estado global
- **Testes de Hooks** - Custom hooks
- **Testes de Serviços** - API e cache

### Estrutura de Testes

```
src/
├── components/
│   └── ComponentName/
│       └── __tests__/
│           └── ComponentName.test.tsx
├── contexts/
│   └── __tests__/
│       └── ContextName.test.tsx
├── hooks/
│   └── __tests__/
│       └── hookName.test.tsx
└── services/
    └── __tests__/
        └── serviceName.test.tsx
```

### Executar Testes Específicos

```bash
# Testar componente específico
npm test -- TaskCard.test.tsx

# Testar com coverage
npm test -- --coverage

# Testar apenas arquivos modificados
npm test -- --watch
```

## 🏗️ Arquitetura

### Padrões Utilizados

- **Component Composition** - Composição de componentes
- **Custom Hooks** - Lógica reutilizável
- **Context API** - Estado global
- **Styled Components** - CSS-in-JS
- **TypeScript** - Tipagem forte

### Estado Global

```typescript
// TaskContext - Gerencia estado das tarefas
interface TaskContextType {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
  // ... ações
}

// ThemeContext - Gerencia tema da aplicação
interface ThemeContextType {
  theme: Theme;
  mode: "light" | "dark";
  toggleTheme: () => void;
}
```

### Cache System

- **Cache local** com TTL (Time To Live)
- **Persistência** no localStorage
- **Auto-sync** a cada 30 segundos
- **Cleanup** automático de itens expirados

## 🎨 Design System

### Cores

```typescript
colors: {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  // ... mais cores
}
```

### Tipografia

- **Font Family**: Inter, system-ui
- **Tamanhos**: xs (0.75rem) até xl (1.25rem)
- **Pesos**: regular (400), medium (500), bold (700)

### Responsividade

- **Mobile First** design
- **Breakpoints**: xs, sm, md, lg, xl, 2xl
- **Grid flexível** com styled-components

## 📱 API

### Endpoints Principais

```typescript
// Tarefas
GET    /tasks           # Listar tarefas
POST   /tasks           # Criar tarefa
PUT    /tasks/:id       # Atualizar tarefa
DELETE /tasks/:id       # Deletar tarefa

// Sugestões
POST   /suggest-time    # Sugerir horários
```

### Estrutura da Tarefa

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: "high" | "medium" | "low";
  estimatedDuration: number; // em minutos
  dueDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3001
VITE_CACHE_TTL=300000
```

### Jest Configuration

```javascript
// jest.config.js
{
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- **ESLint** - Linting configurado
- **TypeScript** - Tipagem obrigatória
- **Testes** - Cobertura mínima de 80%
- **Commits** - Conventional Commits

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de CORS na API**

```bash
# Certifique-se que o json-server está rodando
npm run json-server
```

**Testes falhando**

```bash
# Limpe o cache do Jest
npm test -- --clearCache
```

**Build falhando**

```bash
# Verifique as tipagens TypeScript
npm run build
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ por Odair Lopes S. Andrade!

---

## 🔗 Links Úteis

- [Documentação do React](https://react.dev/)
- [Styled Components](https://styled-components.com/)
- [Testing Library](https://testing-library.com/)
- [TypeScript](https://www.typescriptlang.org/)
