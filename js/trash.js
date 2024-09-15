fetch('http://localhost:8080/identity/users', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkZXZ0ZXJpYS5jb20iLCJzdWIiOiJhZG1pbiIsImV4cCI6MTcyNjM5MzY5NCwiaWF0IjoxNzI2MzkwMDk0LCJqdGkiOiIzZGI2NTEzMS1iNjUxLTQ3MmQtYTMxYS1jYjY5Y2EzYTEwMjUiLCJzY29wZSI6IlJPTEVfQURNSU4ifQ.LMkLNS5A1aoBfG8XJXTj5bG9Vyy1IJARRMHv70qoj6tCDBR01KNjqYdLBAhAb7zmhiGI75lyYo6_VlkfrKlrCg`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
