const API_URL = '/api/todos';

/**
 
 * @param {string} 
 * @param {string} 
 * @param {object} 
 * @returns {Promise<any>} 
 */
const authenticatedFetch = async (url, token, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
  
    return Promise.reject(new Error("No authentication token found."));
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An API error occurred' }));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  if (response.status === 204) { 
    return null;
  }
  return response.json();
};

/**
 
 * @param {string} 
 * @returns {Promise<Array>} 
 */
export const getAll = (token) => {
  return authenticatedFetch(API_URL, token);
};

/**

 * @param {{text: string}} 
 * @param {string} 
 * @returns {Promise<object>} 
 */
export const create = (newTodo, token) => {
  return authenticatedFetch(API_URL, token, {
    method: 'POST',
    body: JSON.stringify(newTodo),
  });
};

/**
 
 * @param {number|string} 
 * @param {{text: string}} 
 * @param {string} 
 * @returns {Promise<object>} 
 */
export const update = (id, updatedTodo, token) => {
  return authenticatedFetch(`${API_URL}/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(updatedTodo),
  });
};

/**
 
 * @param {number|string} 
 * @param {string} 
 * @returns {Promise<null>}
 */
export const remove = (id, token) => {
  return authenticatedFetch(`${API_URL}/${id}`, token, {
    method: 'DELETE',
  });
};

const todoService = {
  getAll,
  create,
  update,
  remove,
};

export default todoService;

