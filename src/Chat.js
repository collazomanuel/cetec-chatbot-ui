import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { createChatBotMessage } from 'react-chatbot-kit';
import { askGPT } from './services';

//const googleProgrammableSearchEngineURL = 'https://google.com'

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    if (message.includes('hola')) {
      actions.handleHello();
    } else {
      askGPT(message).then((response) => {
        actions.handleAnswer(response.answer);
      });
    }
  };
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: {}
        });
      })}
    </div>
  );};

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleHello = () => {
    const botMessage = createChatBotMessage('Hola. Encantado de conocerte.');
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  const handleAnswer = (answer) => {
    const botMessage = createChatBotMessage(answer);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {handleHello, handleAnswer}
        });
      })}
    </div>
  );
};

const config = {
  initialMessages: [createChatBotMessage('Hola, ¿en qué puedo ayudarte?')],
  botName: 'CETEC Chatbot',
  customComponents: {
    header: () => <div></div>
  }
}

function Chat() {
  return (
    <div>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        placeholderText='Escriba su pregunta aquí'
      />
    </div>
  );
}

export default Chat;
