import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { createChatBotMessage } from 'react-chatbot-kit';
import { askGPT } from './services';


//const googleProgrammableSearchEngineURL = 'https://google.com'

function Chat(props) {

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
    initialMessages: [createChatBotMessage('Hola ' + props.userName + ', ¿en qué puedo ayudarte?')],
    botName: 'CETEC Chatbot',
    customComponents: {
      header: () => <div></div>,
      botAvatar: () => <img src={props.botImage} alt="user" className="react-chatbot-kit-bot-picture" />,
      userAvatar: () => <img src={props.userImage} alt="user" className="react-chatbot-kit-user-picture" />,
    }
  }

  return (
    <Chatbot
      config={config}
      messageParser={MessageParser}
      actionProvider={ActionProvider}
      placeholderText='Escriba su pregunta aquí'
    />
  );
}

export default Chat;
