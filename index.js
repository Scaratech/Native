import express from 'express';

const publicPath = "public";
const port = 3000;

const blockList = ["https://www.google.com"];
const jsInjection = `console.log('native');`;

const app = express();
app.use(express.static(publicPath));

const handleResponse = async (response, res) => {
    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Type', contentType);

    if (contentType && contentType.startsWith('text')) {
        const data = await response.text();
        const rewritten = data + `<script src="/native.js"></script>` + `<script>${jsInjection}</script>`;

        res.send(rewritten);
    } else {
        const data = await response.arrayBuffer();
        const buffer = Buffer.from(data);

        res.send(buffer);
    }
    res.end();
};

app.get('/url/*', async (req, res) => {
    const URL = req.params[0];
    if (blockList.includes(URL)) {
        res.status(500).send('Blocked URL');
        return;
    }

    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${URL}`);
        }
        await handleResponse(response, res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching URL');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
