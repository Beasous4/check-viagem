# 🌍 Check Viagem - Travel Checklist App

Uma aplicação web intuitiva para rastrear países e lugares que você já visitou, além de manter uma lista de destinos que deseja explorar.

## ✨ Funcionalidades

- 📍 **Já Conheço**: Marque países e cidades que você já visitou
- 🎯 **Quero Conhecer**: Crie uma lista de desejos com destinos que pretende visitar
- 💡 **Sugestões**: Descubra novos lugares recomendados pela aplicação
- 🔍 **Filtros**: Filtre por continente e busque por país/cidade
- 📊 **Estatísticas**: Acompanhe quantos países e lugares você já visitou
- 💾 **Armazenamento Local**: Seus dados são salvos automaticamente no navegador

## 🚀 Como Usar

### Instalação

```bash
npm install
npm start
```

### Uso da Aplicação

1. **Aba "Já Conheço"**: Marque os países e cidades que você visitou usando os checkboxes
2. **Aba "Quero Conhecer"**: Adicione novos destinos que deseja visitar com notas opcionais
3. **Aba "Sugestões"**: Explore recomendações e adicione à sua lista de desejos
4. **Filtros**: Use o painel esquerdo para filtrar por continente ou pesquisar

## 🛠️ Tecnologias

- **React** - Framework JavaScript
- **Tailwind CSS** - Estilização
- **localStorage** - Persistência de dados

## 📋 Estrutura do Projeto

```
src/
├── App.jsx           # Componente principal
└── components/       # Componentes reutilizáveis
```

### Componentes

- `QuickAddForm` - Formulário para adicionar países
- `AddPlaceInline` - Adicionar cidades a um país
- `WantList` - Exibir lista de desejos
- `AddWantForm` - Adicionar itens à lista de desejos

## 🎨 Paleta de Cores

- **Primária**: Indigo-600 (botões, destaques)
- **Sucesso**: Verde-600 (ações positivas)
- **Perigo**: Vermelho-500 (remoção)
- **Fundo**: Cinza-50 e Branco

## 💭 Pontos de Melhoria Sugeridos

### 1. **Estrutura de Código**
   - [ ] Separar componentes em arquivos individuais
   - [ ] Criar arquivo `constants.js` para dados iniciais
   - [ ] Extrair lógica em custom hooks

### 2. **Funcionalidades**
   - [ ] Editar países/cidades existentes
   - [ ] Deletar países com confirmação
   - [ ] Categorizar destinos por tipo (praia, montanha, etc)
   - [ ] Adicionar datas de visitação
   - [ ] Sistema de ratings/comentários

### 3. **Interface & UX**
   - [ ] Página de detalhes de cada país
   - [ ] Ícones para continentes
   - [ ] Modo escuro
   - [ ] Animações de transição
   - [ ] Toast/notificações para ações

### 4. **Performance**
   - [ ] Adicionar `React.memo()` em componentes
   - [ ] Implementar lazy loading
   - [ ] Otimizar renderizações com callbacks

### 5. **Dados**
   - [ ] Integrar com API de países/cidades
   - [ ] Banco de dados para múltiplos usuários
   - [ ] Importar/exportar dados (CSV, JSON)

### 6. **Testes**
   - [ ] Testes unitários (Jest)
   - [ ] Testes de integração
   - [ ] Testes E2E (Cypress/Playwright)

### 7. **Deploy**
   - [ ] Configurar GitHub Pages
   - [ ] Adicionar CI/CD pipeline
   - [ ] Configurar domínio personalizado

## 📱 Responsividade

A aplicação é totalmente responsiva:
- **Desktop**: Layout em 4 colunas (controles | conteúdo | estatísticas)
- **Tablet & Mobile**: Layout adaptativo com reflow automático

## 🤝 Contribuindo

Sinta-se livre para contribuir com melhorias, bug fixes ou novas funcionalidades.

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com Beatriz**
