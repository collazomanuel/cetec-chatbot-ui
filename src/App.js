import fiubaLogo from './fiuba-logo.png'
import './App.css';
import Chat from './Chat'

function App() {
  return (
    <div className=' App'>
      <div className='App-header'>
        <h2><code>CETEC Chatbot</code></h2>
      </div>
      <div className='chatbot'>
        <Chat />
      </div>
      <div className='App-footer'>
        <img src={fiubaLogo} className='fiuba-logo' alt='fiuba-logo' />
      </div>
    </div>
  );
}

export default App;
