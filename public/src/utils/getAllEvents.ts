import axios from 'axios';
export const getAllEvents = async (userEmail) => {
  try {
    const response = await axios.get(
      'http://127.0.0.1:5001/events/user/' + userEmail,
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
