const BASE_URL = 'http://localhost:8080';

const fetcher = async (path, method, body = null, isFormData = false) => {
  const token = localStorage.getItem('token');
  let payload;

  if (token && body && !isFormData) {
    payload = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body,
    };
  } else if (token && body) {
    payload = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    };
  } else if (body) {
    payload = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    };
  } else if (token) {
    payload = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
  let result;
  let finalResult;

  try {
    result = await fetch(BASE_URL + path, payload);
    finalResult = await result.json();
    if (!(result.status === 200 || result.status === 201)) {
      throw new Error('Result status not OK in fetcher');
    }
    return finalResult;
  } catch (error) {
    console.log('Error in fetchWrapper: ', error);
  }
};

export default fetcher;
