import axios from 'axios';

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjIwOTg1Mjc4OCwidWlkIjoxMjM1MTE2MCwiaWFkIjoiMjAyMi0xMi0xNlQxNDoxNDowMS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6NTU0OTk4OCwicmduIjoidXNlMSJ9.o73_nLLPlmYf2nxrGbrfJxSJOUm5KJ_dgVxfzFjx65s';

const items = [
    {
        name: "Juan", email: "juan@gmail.com"
    },
    {
        name: "Rafael", email: "rafael@gmail.com"
    }
]
const createRecord = async ( item) => {
  try {
    const response = await axios.post(
      `https://api.monday.com/v2/boards/sales-lol/items`,
      {
        item,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
