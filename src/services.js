import axios from 'axios';
//import { Wit } from 'node-wit';

const askLSTM = async (message) => {


  if (true)
    return {answer: 'respuesta de LSTM', confidence: 0.4};

  /*
  try {
    const witClient = new Wit({ accessToken: process.env.WIT_ACCESS_TOKEN });
    const structure = await witClient.message(message.toLowerCase(), {});
    const response = await axios.get('lstm-back', { params: { nlus: structure }});
    return response.data;
  } catch (error) {
    throw error;
  }
  */

};

const askTransformer = async (message) => {

  if (true)
    return {answer: 'respuesta de Transformer', confidence: 0.4};

  try {
    const response = await axios.get('transformer-back');
    return response.data;

  } catch (error) {
    console.error(error);
  }
};

const askGPT = async (message) => {

  try {
    const response = await axios.post('http://localhost:8000/generate?prompt=' + message);
    return {
      answer: response.data
    }
  } catch (error) {
    console.error(error);
  }
};

export {askLSTM, askTransformer, askGPT};

/*
fetch(`http://localhost:8000/generate?prompt=${encodeURIComponent(prompt)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        generatedText = data.generated_text;
        error = "";
      })
      .catch((err) => {
        generatedText = "";
        error = err.message;
      });

*/