# Dynamic Pro 1.0

Plataforma de ensino dinâmica para alunos e professores, transformando a maneira como você aprende e ensina.

## Status do Projeto

O projeto está atualmente em desenvolvimento com as seguintes funcionalidades:

- ✅ Autenticação de usuários (professores e alunos)
- ✅ Dashboard personalizado por tipo de usuário
- ✅ Modo mock para desenvolvimento sem dependência do MongoDB
- 🚧 Gerenciamento de cursos
- 🚧 Matrícula de alunos
- 🚧 Atividades e avaliações

## Modo Mock

O projeto está configurado para funcionar em "modo mock" quando a conexão com o MongoDB falha ou não está disponível. Isso permite o desenvolvimento e teste da interface sem depender de uma conexão de banco de dados ativa.

### Endpoints Disponíveis

- `/api/auth/login-mock`: Login simulado
- `/api/auth/registro-mock`: Registro simulado
- `/api/auth/verify`: Verificação de token
- `/api/init-db`: Inicialização do banco de dados (mock)
- `/api/cursos`: Gerenciamento de cursos (mock)
- `/api/cursos/matricula`: Matrícula de alunos em cursos (mock)
- `/api/diagnostico-detalhado`: Diagnóstico da conexão com MongoDB

## Desenvolvimento Local

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente: