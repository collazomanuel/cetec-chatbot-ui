import axios from 'axios';

const askLSTM = async () => {
  try {

    if (true)
      return {answer: 'LSTM answer', confidence: 0.7};

    const response = await axios.get(`lstm-back`);
    return response.data;

  } catch (error) {
    console.error(error);
  }
};

const askTransformer = async () => {
  try {

    if (true)
      return {answer: 'Transformer answer', confidence: 0.7};

    const response = await axios.get(`transformer-back`);
    return response.data;

  } catch (error) {
    console.error(error);
  }
};

export {askLSTM, askTransformer};
