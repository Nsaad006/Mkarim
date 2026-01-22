import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3002;

app.use(express.json());

app.get('/test', (req, res) => {
    console.log('Test route hit!');
    res.json({ message: 'Minimal test successful' });
});

app.listen(PORT, () => {
    console.log(`🚀 Minimal server running on http://localhost:${PORT}`);
});
