const axios = require('axios');

const faker = require('Faker'); // let's hope this doesn't break again ;)

const serverURL = 'http://127.0.0.1:6400';

const amountOfData = 500;
let requests  = [];


function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}


for (let i = 0; i < amountOfData; i++) {
    const data = {
      'title': faker.commerce.productName(),
      'price': faker.commerce.price(),
      'description': faker.commerce.productDescription(),
      'image': faker.image.cats(),
      'category': faker.commerce.department(),
      'rating': between(1,100)
    }
    const req = axios.post(`${serverURL}/products`, data);

    requests.push(req);
}

axios.all(requests).then(res => {
    console.log("Saved data.");
  }).catch(err => {
    console.log(err);
  });