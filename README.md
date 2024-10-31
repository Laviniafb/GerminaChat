# GerminaChat

**GerminaChat** é um projeto de chat em tempo real desenvolvido com WebSocket, como parte de um trabalho acadêmico supervisionado por Daniel. Este chat permite a comunicação instantânea entre múltiplos usuários, com suporte a mensagens privadas, notificações de digitação e histórico de mensagens.

## 📋 Funcionalidades

- **Comunicação em Tempo Real**: Permite o envio de mensagens públicas para todos os usuários conectados.
- **Mensagens Privadas**: Use o comando `/private nomeDoUsuario mensagem` para enviar mensagens privadas visíveis apenas para o destinatário.
- **Notificações de Digitação**: Notifica quando um usuário está digitando, visível para todos os participantes.
- **Histórico de Mensagens**: Opção para carregar o histórico de mensagens quando um novo usuário entra no chat.
- **Lista de Usuários Ativos**: Exibe os usuários conectados e o tempo online de cada um.


## 🚀 Como Executar o Projeto

1. **Registro de Usuário**: Abra `login.html` em seu navegador para registrar seu nome de usuário.
2. **Inicie o Servidor WebSocket**: Abra um terminal e execute o servidor com o seguinte comando:
   ```bash
   node server.js
