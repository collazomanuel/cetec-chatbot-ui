import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { createChatBotMessage } from 'react-chatbot-kit';
import {askLSTM, askTransformer} from './services';

const confidenceThresholdLSTM = 0.5
const confidenceThresholdTransformer = 0.5
const googleProgrammableSearchEngineURL = 'https://google.com'

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    if (message.includes('hola')) {
      actions.handleHello();
    } else {
      askLSTM(message).then((response) => {
        if (response.confidence > confidenceThresholdLSTM){
          actions.handleAnswer(response.answer);
        } else {
          askTransformer(message).then((response) => {
            if (response.confidence > confidenceThresholdTransformer){
              actions.handleAnswer(response.answer);
            } else {
              actions.handleAnswer(
                'Te sugiero utilizar el siguiente buscador personalizado de Google: ' + googleProgrammableSearchEngineURL
              );
            }
          });
        }
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
      />
    </div>
  );
}

export default Chat;
