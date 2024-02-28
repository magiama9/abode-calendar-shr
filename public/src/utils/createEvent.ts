import axios from 'axios';
export const createEvent = async (event) => {
  try {
    const response = await axios.post('http://127.0.0.1:5001/events', event);
    console.log(response);
    // return response.data.event.id;
  } catch (error) {
    console.log(error);
  }
};
