import axios from 'axios';
//////

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjIwOTg1Mjc4OCwidWlkIjoxMjM1MTE2MCwiaWFkIjoiMjAyMi0xMi0xNlQxNDoxNDowMS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6NTU0OTk4OCwicmduIjoidXNlMSJ9.o73_nLLPlmYf2nxrGbrfJxSJOUm5KJ_dgVxfzFjx65s';

export  async function insertMonday(customer_name, label, totalCost, timestamp, product_items, created_by, phone, patient_email, downP, remarks ) {
  const mutation1 = `
    mutation {
      create_item(
        board_id: 3970694330,
        item_name: "${customer_name}",
        column_values: "{
          \\"text0\\": \\"${remarks}\\",
          \\"color\\": {
            \\"label\\": \\"${label}\\"
          },
          \\"date\\": {
            \\"date\\": \\"${timestamp}\\"
          },
          \\"numeric\\": \\"${totalCost}\\",
          \\"text29\\": \\"${product_items}\\",
          \\"text54\\": \\"${phone}\\",
          \\"text7\\": \\"${created_by}\\",
          \\"text2\\": \\"${patient_email}\\",
          \\"numeric9\\": \\"${downP}\\"
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
