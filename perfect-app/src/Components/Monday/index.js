import axios from 'axios';

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjIwOTg1Mjc4OCwidWlkIjoxMjM1MTE2MCwiaWFkIjoiMjAyMi0xMi0xNlQxNDoxNDowMS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6NTU0OTk4OCwicmduIjoidXNlMSJ9.o73_nLLPlmYf2nxrGbrfJxSJOUm5KJ_dgVxfzFjx65s';

export  async function insertMonday(customer_name, label, totalCost ) {
  const mutation1 = `
    mutation {
      create_item(
        board_id: 3970694330,
        item_name: "${customer_name}",
        column_values: "{
          \\"text0\\": \\"Juan, te llevo una vida en programación\\",
          \\"color\\": {
            \\"label\\": \\"${label}\\"
          },
          \\"date\\": {
            \\"date\\": \\"1997-07-16\\"
          },
          \\"numeric\\": \\"${totalCost}\\",
          \\"text54\\": \\"+1434-987-6365\\",
          \\"text7\\": \\"rafael@perfectb.com\\"
        }"
      ) {
        id
      }
    }
  `;

  try {
    const response = await axios.post(
      "https://api.monday.com/v2",
      {
        query: mutation1,
        variables: {}
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: API_KEY
        }
      }
    );

    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(error);
  }
}
