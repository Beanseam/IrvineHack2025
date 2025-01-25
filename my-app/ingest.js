const axios = require('axios');

axios.get('http://127.0.0.1:8000/hello')
  .then(response => {
    console.log('Data:', response.data);  // Handle successful response
  })
  .catch(error => {
    console.error('Error:', error);  // Handle error
  });