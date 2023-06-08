import axios from 'axios';
import { accessToken } from './token';
import { SERVER_URL } from '@src/constants/constants';

// type FormDataType = {
//   nickname: string;
//   profileImage: File;
// };

export const getUser = async (id: number) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/users/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = async ([formData, id]: [FormData, number]) => {
  console.log(id);
  try {
    const response = await axios.patch(`${SERVER_URL}/api/users/${id}`, formData, {
      headers: {
        Authorization: accessToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    await axios.delete(`${SERVER_URL}/api/users/${id}`, {
      headers: {
        Authorization: accessToken,
      },
    });
    console.log('User account deleted');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePassword = async ([passwordData, id]: [object, number]) => {
  try {
    await axios.put(`${SERVER_URL}/api/users/${id}/password`, passwordData, {
      headers: {
        Authorization: accessToken,
      },
    });
    console.log('Password updated successfully');
  } catch (error) {
    console.error(error);
    throw error;
  }
};
