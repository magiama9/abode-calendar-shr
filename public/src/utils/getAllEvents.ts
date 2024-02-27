import axios from 'axios';
export const getAllEvents = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:5001/events/');
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
