import express from 'express';

const app = express();
app.use(express.static("public"));

const handleResponse = async (response, res, req) => {
    const contentType = response.headers.get('Content-Type');
    res.setHeader('Content-Type', contentType);

    if (contentType && contentType.startsWith('text/html')) {
        const data = await response.text();
        const rewritten = data.replace(
            /<\/head>/i,
            `<script src="/n.init.js" type="module" defer></script></head>`
        );

        res.send(rewritten);
    } else if (contentType && contentType.startsWith('text/css')) {
        const data = await response.text();
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const rewritenCss = data.replace(
            /(?<=url\("?'?)[^"'][\S]*[^"'](?="?'?\);?)/g,
            (match) => {
                const encodedUrl = Buffer.from(match).toString('base64');
                return `${baseUrl}/url/${encodedUrl}`;
            }
        );

        res.send(rewritenCss);
    } else {
        const data = await response.arrayBuffer();
        const buffer = Buffer.from(data);

        res.send(buffer);
    }
};

app.get('/url/*', async (req, res) => {
    let URL;
    try {
        URL = atob(req.params[0]);
    } catch (error) {
        console.error(error);
        return res.status(400).send('Invalid URL');
    }

    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${URL}`);
        }
        await handleResponse(response, res, req);
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).send('Error fetching URL');
        }
    }
});

app.listen(3000, () => {
    console.log(`Server is running on port: 3000`);
});