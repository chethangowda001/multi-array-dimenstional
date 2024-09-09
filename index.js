const express = require('express');
const app = express();
const port = 4000;

app.use(express.urlencoded({ extended: true }));


let array = Array.from({ length: 10 }, (_, i) => Array.from({ length: 10 }, (_, j) => i * 10 + j + 1));
let shuffledArray = shuffle2DArray(array);

function shuffle2DArray(arr) {
  const flatArray = arr.flat(); 
  for (let i = flatArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flatArray[i], flatArray[j]] = [flatArray[j], flatArray[i]];
  }
  
  return Array.from({ length: arr.length }, (_, i) => flatArray.slice(i * arr[0].length, (i + 1) * arr[0].length));
}

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shuffled Array</title>
    </head>
    <body>
      <h1>Array Shuffling with Fisher-Yates Algorithm</h1>
      <p><strong>Original Array:</strong> ${JSON.stringify(array)}</p>
      <p><strong>Shuffled Array:</strong> ${JSON.stringify(shuffledArray)}</p>

      <form action="/shuffle" method="POST">
        <button type="submit">Shuffle Again</button>
      </form>

      <!-- Form to get element at a specific index -->
      <form action="/get-element" method="POST">
        <label for="row">Enter the row of the element you want to see: </label>
        <input type="number" id="row" name="row" min="0" max="${shuffledArray.length - 1}" required>
        <label for="col">Enter the column of the element you want to see : </label>
        <input type="number" id="col" name="col" min="0" max="${shuffledArray[0].length - 1}" required>
        <button type="submit">Get Element</button>
      </form>
    </body>
    </html>
  `);
});

app.post('/shuffle', (req, res) => {
  shuffledArray = shuffle2DArray(array);
  res.redirect('/');
});

app.post('/get-element', (req, res) => {
  const row = parseInt(req.body.row, 10);
  const col = parseInt(req.body.col, 10);
  let element;

  if (row >= 0 && row < shuffledArray.length && col >= 0 && col < shuffledArray[0].length) {
    element = shuffledArray[row][col];
  } else {
    element = 'Invalid index. Please enter numbers within the valid range.';
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shuffled Array - Element Display</title>
    </head>
    <body>
      <h1>Element at Row ${row}, Column ${col}</h1>
      <p><strong>Requested Element:</strong> ${element}</p>
      <a href="/">Back to Shuffle</a>
    </body>
    </html>
  `);
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
