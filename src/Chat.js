import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { createChatBotMessage } from 'react-chatbot-kit';
import { askGPT } from './services';


//const googleProgrammableSearchEngineURL = 'https://google.com'

const Loader = () => {
  return (
    <div className="chatbot-loader-container">
      <svg
        id="dots"
        width="50px"
        height="21px"
        viewBox="0 0 132 58"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="none" fill="none">
          <g id="chatbot-loader" fill="#fff">
            <circle id="chatbot-loader-dot1" cx="25" cy="30" r="13"></circle>
            <circle id="chatbot-loader-dot2" cx="65" cy="30" r="13"></circle>
            <circle id="chatbot-loader-dot3" cx="105" cy="30" r="13"></circle>
          </g>
        </g>
      </svg>
    </div>
  );
};

function Chat(props) {

  const MessageParser = ({ children, actions }) => {
    const parse = (message) => {
      if (message.includes('hola')) {
        actions.handleHello();
      } else {
        actions.handleQuestion(message);
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
    const handleQuestion = (message) => {
      const loadingMessage = createChatBotMessage(Loader());
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, loadingMessage],
      }));
      askGPT(message).then((response) => {
        let botMessage = createChatBotMessage(response.answer);
        botMessage.loading = false;
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages.slice(0, -1), botMessage],
        }));
      });
    };
    return (
      <div>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            actions: {handleHello, handleQuestion}
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
