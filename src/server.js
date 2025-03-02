const axios = require('axios');

// Make a GET request
axios.get('https://api.github.com/users/brdnvo')
  .then(response => {
    console.log(response.data); // Logs the data from the API
  })
  .catch(error => {
    console.error('Error:', error);
  });