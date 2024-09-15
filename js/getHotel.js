fetch('http://localhost:1337/api/hotels')
  .then((response) => response.json())
  .then((data) => {
    console.log(data.data)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
