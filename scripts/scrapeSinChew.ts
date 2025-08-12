fetch('https://www.sinchew.com.my/ajx-api/latest_posts/?page=2')
  .then(e => e.json())
  .then(data => {
    console.log(data)
  })
