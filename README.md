# ATV III - Atlantis

Sistema completo de gestão hoteleira com acomodações e hospedagens desenvolvido em TypeScript.

## 📋 Descrição

Este é o terceiro projeto da série Atlantis, um sistema completo de gestão hoteleira que implementa o padrão Builder para criação de acomodações personalizadas. O sistema gerencia clientes, acomodações, hospedagens e implementa diferentes tipos de diretores para categorias específicas de acomodações.

## 🚀 Funcionalidades

### Gestão de Clientes
- **Cadastrar Cliente**: Registra novos clientes (titular ou dependente)
- **Editar Cliente**: Modifica informações de clientes existentes
- **Listar Clientes**: Visualiza clientes com diferentes critérios

### Gestão de Acomodações
- **Listar Acomodações**: Visualiza todas as acomodações disponíveis
- **Categorias Predefinidas**: 
  - **Solteiro Simples**: Acomodação básica para uma pessoa
  - **Solteiro Mais**: Acomodação premium para uma pessoa
  - **Casal Simples**: Acomodação básica para casal
  - **Família Simples**: Acomodação para família pequena
  - **Família Mais**: Acomodação para família média
  - **Família Super**: Acomodação premium para família grande

### Gestão de Hospedagens
- **Cadastrar Hospedagem**: Registra nova hospedagem vinculando cliente e acomodação
- **Encerrar Hospedagem**: Finaliza hospedagem ativa
- **Listar Hospedagens**: Visualiza todas as hospedagens do sistema

### Sistema de Builder Pattern
- **Construtores Específicos**: Para cada tipo de acomodação
- **Diretores Especializados**: Cada diretor constrói um tipo específico de acomodação
- **Customização**: Permite personalizar acomodações conforme necessidade

## 🛠️ Tecnologias Utilizadas

- **TypeScript** - Linguagem principal
- **Node.js** - Runtime JavaScript
- **ts-node** - Executor TypeScript direto
- **prompt-sync** - Interface de entrada do usuário

## 📦 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com Node.js)

## 🔧 Instalação

1. **Clone o repositório ou navegue até a pasta do projeto:**
   ```bash
   git clone https://github.com/mariannevalerion/atlantis-3.git
   cd atlantis-3
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

## ▶️ Como Executar

Para rodar o projeto, execute o seguinte comando:

```bash
npm start
```

O sistema irá exibir um menu principal com as seguintes opções:

```
****************************
| Por favor, selecione uma opção...
----------------------
| Opções para cliente:
----------------------
| 1 - Cadastrar cliente
| 2 - Editar cliente
| 3 - Listar cliente(s)
| 4 - Excluir cliente
----------------------
| Opções para hospedagem:
----------------------
| 5 - Listar acomodações
| 6 - Cadastrar hospedagem
| 7 - Encerrar hospedagem
| 8 - Listar hospedagens
----------------------
****************************
| 0 - Sair
----------------------
```

## 🎯 Padrões de Design Implementados

### Builder Pattern
- **ConstrutorAcomodacao**: Builder concreto para construir acomodações
- **Diretores**: Cada diretor sabe como construir um tipo específico de acomodação
- **Flexibilidade**: Permite criar acomodações com diferentes configurações

### Director Pattern
- **DiretorSolteiroSimples**: Cria acomodação básica para solteiros
- **DiretorSolteiroMais**: Cria acomodação premium para solteiros
- **DiretorCasalSimples**: Cria acomodação para casais
- **DiretorFamiliaSimples**: Cria acomodação básica para famílias
- **DiretorFamiliaMais**: Cria acomodação média para famílias
- **DiretorFamiliaSuper**: Cria acomodação premium para famílias

### Strategy Pattern
- **Impressores**: Diferentes estratégias de impressão
- **Processos**: Diferentes estratégias de processamento

## 🏠 Tipos de Acomodações

| Tipo | Camas Solteiro | Camas Casal | Suítes | Climatização | Garagem |
|------|----------------|-------------|--------|---------------|----------|
| Solteiro Simples | 1 | 0 | 0 | ❌ | 0 |
| Solteiro Mais | 1 | 0 | 1 | ✅ | 1 |
| Casal Simples | 0 | 1 | 0 | ❌ | 0 |
| Família Simples | 2 | 1 | 0 | ❌ | 0 |
| Família Mais | 2 | 1 | 1 | ✅ | 1 |
| Família Super | 4 | 2 | 2 | ✅ | 2 |

## 🔄 Fluxo de Uso

1. **Inicialização**: Sistema cadastra automaticamente 6 tipos de acomodações
2. **Menu Principal**: Escolha a operação desejada
3. **Gestão de Clientes**: Cadastre, edite ou liste clientes
4. **Visualizar Acomodações**: Veja todas as opções disponíveis
5. **Cadastrar Hospedagem**: Vincule cliente a uma acomodação
6. **Gerenciar Hospedagens**: Liste ou encerre hospedagens ativas
