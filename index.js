import fetch from 'node-fetch';
import express from 'express';

const publicPath = "public";
const port = 3000;

const app = express();
app.use(express.static(publicPath));

app.get('/url/*', async (req, res) => {
  const URL = req.params[0];

  try {
    const response = await fetch(URL);
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.startsWith('text')) {
      const data = await response.text();
      const rewritten = data + `<script src="/native.js"></script>`; // Element Rewriting
      res.setHeader('Content-Type', contentType);
      res.send(rewritten);

    } else { // Images
      const data = await response.arrayBuffer();
      const buffer = Buffer.from(data);
      res.setHeader('Content-Type', contentType);
      res.send(buffer);
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching URL');
  }
});

app.listen(port, () => { 
    console.log(`Server is running on port: ${port}`); 
});