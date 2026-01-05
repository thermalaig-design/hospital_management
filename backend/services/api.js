const API_URL = 'http://localhost:5000/api';

export const fetchMembersByType = async (type) => {
  const response = await fetch(`${API_URL}/members/type/${type}`);
  const data = await response.json();
  return data.data;
};

export const searchMembers = async (query, type) => {
  const url = type 
    ? `${API_URL}/members/search?query=${query}&type=${type}`
    : `${API_URL}/members/search?query=${query}`;
  
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
};
