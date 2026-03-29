Aplicativo mobile desenvolvido com React Native (Expo) para gerar senhas aleatórias, salvá-las com um nome de aplicativo, visualizar histórico.

Funcionalidades
Gerador de Senhas:
Geração de senhas seguras com letras maiúsculas, minúsculas, números e símbolos.
Botões para copiar a senha e abrir um modal para salvar a senha com um nome de aplicativo.
Senhas salvas são armazenadas localmente com timestamp.

Histórico de Senhas:
Lista de senhas salvas em formato de cards, mostrando o nome do aplicativo e a senha ofuscada.
Ações por emoji: mostrar/esconder senha,  copiar,  deletar.
Botão "Voltar" para retornar à tela Home.
Botão "Limpar Tudo" para apagar todo o histórico.

Tecnologias Utilizadas
React Native
Expo
React Navigation (stack navigator)
AsyncStorage para persistência local
expo-clipboard para copiar senhas

 
Pré-requisitos
Node.js (versão 14 ou superior)

npm ou yarn
Expo CLI globalmente instalado: npm install -g expo-cli
Um emulador Android/iOS ou dispositivo físico com o aplicativo Expo Go instalado

🚀 Como Rodar o Projeto
1 - Clone o repositório
2 - instale as dependencias: npm install ou yarn install;
3 - inicie o servidor expo: npx expo start ou expo start;
4 - execute no disposito/emulador: 
    Escaneie o QR Code com o aplicativo Expo Go (Android) ou com a câmera do iPhone (iOS).
    pressione a para abrir no emulador Android (caso configurado) ou i para iOS.
    ou se for web: copie o endereço ex: http://localhost:8081

