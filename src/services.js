import axios from 'axios';

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

export { askGPT };
