# 🏆 Dubai Consultas - Sistema Premium

Sistema de consultas avançadas com autenticação e integração com APIs externas.

## 📋 Funcionalidades

- 🔐 **Autenticação**: Sistema de login seguro
- 🔍 **Consultas Locais**: Busca em base de dados local (+889k registros)
- 🌐 **APIs Externas**: Integração com Bronx Services
- 📱 **Interface Responsiva**: Design moderno e intuitivo
- 💾 **Cache Inteligente**: Performance otimizada

## 🚀 Consultas Disponíveis

### Local (Base de Dados)
- **Por CPF**: Busca exata por CPF
- **Por Telefone**: Busca por número de telefone

### API Externa (Bronx Services)
- **Por CPF**: Dados completos + emails + telefones + endereços
- **Por Telefone**: Busca por telefone
- **Por Nome**: Busca por nome completo
- **Por Endereço**: Busca por CPF para endereços

## 🛠️ Instalação e Execução

### Local
```bash
# Instalar dependências
npm install

# Executar servidor
npm start

# Ou para desenvolvimento
npm run dev
```

### Acesso
- **Local**: http://localhost:3000
- **Login**: admin
- **Senha**: admin123

## 🌐 Deploy no Heroku

### 1. Criar conta no Heroku
- Acesse: https://heroku.com
- Crie uma conta gratuita

### 2. Instalar Heroku CLI
```bash
# Windows (PowerShell como Admin)
winget install heroku

# Ou baixar direto: https://devcenter.heroku.com/articles/heroku-cli
```

### 3. Login no Heroku
```bash
heroku login
```

### 4. Criar aplicação
```bash
# No diretório do projeto
heroku create dubai-consultas --region us
```

### 5. Deploy
```bash
# Fazer commit das mudanças
git add .
git commit -m "Primeiro deploy"

# Deploy no Heroku
git push heroku main
```

### 6. Abrir aplicação
```bash
heroku open
```

## 📊 Dados

- **Base de Dados**: `servidor.txt` (889.712 registros)
- **Formato**: CPF,AG,NOME,IDADE,TELEFONE,UF
- **Estados**: Todos os 27 estados brasileiros
- **Maior concentração**: SP (319.809), RJ (135.494), MG (90.324)

## 🔧 Tecnologias

- **Backend**: Node.js + Express
- **Frontend**: HTML5, CSS3, JavaScript
- **APIs**: Bronx Services
- **Cache**: Sistema inteligente (5min)
- **Deploy**: Heroku + GitHub

## 📁 Estrutura do Projeto

```
dubai-consultas/
├── server.js              # Servidor principal
├── sistema-consulta.html  # Interface principal
├── sistema-consulta.js    # Lógica frontend
├── sistema-consulta.css   # Estilos
├── servidor.txt           # Base de dados
├── package.json           # Dependências
├── .gitignore            # Arquivos ignorados
└── README.md             # Documentação
```

## 🎯 Como Usar

1. **Login**: Use admin/admin123
2. **Menu Principal**: Escolha entre "Consultar Dados" ou "Painel de Consulta"
3. **Consultas**: Digite CPF ou telefone desejado
4. **Resultados**: Visualize os dados encontrados

## 📞 Suporte

Para dúvidas ou problemas, verifique:
- Logs do servidor no terminal
- Status das APIs externas
- Conectividade com internet

## 📝 Notas

- Sistema otimizado para performance
- Cache automático de 5 minutos
- Interface responsiva para mobile
- Tratamento completo de erros

---

**🏆 Dubai Consultas - Sistema Premium de Consultas**
