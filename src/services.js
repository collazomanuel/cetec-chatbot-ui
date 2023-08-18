import axios from 'axios';

const askGPT = async (message) => {

  try {
    const response = await axios.post(process.env.REACT_APP_BACK_URL + '/gpt?prompt=' + message);
    return {
      answer: response.data,
      confidence: 1.0
    }
  } catch (error) {
    console.error(error);
  }
};

const askLSTM = async (message) => {

  try {
    const response = await axios.post(process.env.REACT_APP_BACK_URL + '/lstm?prompt=' + message);
    return {
      answer: response.data,
      confidence: 1.0
    }
  } catch (error) {
    console.error(error);
  }
};

export { askGPT, askLSTM };
