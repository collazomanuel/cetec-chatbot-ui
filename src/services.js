import axios from 'axios';
//import { Wit } from 'node-wit';

const askLSTM = async (message) => {

  if (true)
    return {answer: 'respuesta de LSTM', confidence: 0.7};

  try {
    //const witClient = new Wit({ accessToken: process.env.WIT_ACCESS_TOKEN });
    const witClient = '';
    const structure = await witClient.message(message.toLowerCase(), {});
    const response = await axios.get('lstm-back', { params: { nlus: structure }});
    return response.data;
  } catch (error) {
    throw error;
  }

};

const askTransformer = async (message) => {

  if (true)
    return {answer: 'respuesta de Transformer', confidence: 0.7};

  try {
    const response = await axios.get('transformer-back');
    return response.data;

  } catch (error) {
    console.error(error);
  }
};

export {askLSTM, askTransformer};
