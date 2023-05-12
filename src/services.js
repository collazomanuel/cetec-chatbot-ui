import axios from 'axios';
import { Wit } from 'node-wit';

const askLSTM = async (message) => {

  try {
    const witClient = new Wit({ accessToken: process.env.REACT_APP_WIT_ACCESS_TOKEN });
    const structure = await witClient.message(message.toLowerCase(), {});
    const response = await axios.get(process.env.REACT_APP_BACK_GPT_URL + '/nlu_assembly', { params: { nlus: structure }});
    return {
      answer: response.data,
      confidence: 1.0
    }
  } catch (error) {
    throw error;
  }
};

const askTransformer = async (message) => {

  if (true)
    return {answer: 'respuesta de Transformer', confidence: 0.4};

  try {
    const response = await axios.get('transformer-back');
    return {
      answer: response.data,
      confidence: 0.0
    }

  } catch (error) {
    console.error(error);
  }
};

const askGPT = async (message) => {

  try {
    const response = await axios.post(process.env.REACT_APP_BACK_GPT_URL + '/generate?prompt=' + message);
    return {
      answer: response.data,
      confidence: 1.0
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

/*
https://youtu.be/h1WLN9Gzbwc
*/