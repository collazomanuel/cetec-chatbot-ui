import axios from 'axios';

const askBot = async (question) => {

  try {
    const response = await axios.post(process.env.REACT_APP_BACK_URL + '/answer?prompt=' + question);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { askBot };
