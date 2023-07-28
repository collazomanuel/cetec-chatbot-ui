
import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import fiubaLogo from './fiuba-logo.png'
import cetecLogo from './cetec-logo.png'
import './App.css';
import Chat from './Chat'

function App() {

  const [ user, setUser ] = useState(null);
  const [ profile, setProfile ] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed: ', error)
  });

  useEffect(
    () => {
      if (user) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
            }
          })
          .then((response) => {
            setProfile(response.data);
          })
          .catch((err) => console.log(err));
      }
    },
    [user]
  );

  return (
    <div className=' App'>
      {profile ? (
        <>
          <div className='chatbot'>
            <Chat userName={profile.given_name} userImage={profile.picture} botImage={cetecLogo}/>
          </div>
          {/*<button onClick={logout}>Cerrar sesión</button>*/}
        </>
      ) : (
        <>
          <button onClick={() => login()}>Iniciar sesión con Google</button>
          <div className='App-footer'>
            <img src={fiubaLogo} className='fiuba-logo' alt='fiuba-logo' />
          </div>
        </>        
      )}
    </div>
  );
}

export default App;
