const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Proxy endpoint for Open Trivia DB
app.get('/api/trivia', async (req, res) => {
  try {
    const axios = require('axios');
    const response = await axios.get('https://opentdb.com/api.php?amount=1');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching trivia:', error);
    res.status(500).json({ error: 'Failed to fetch trivia' });
  }
});

app.listen(PORT, () => {
  console.log(`Minimal API Proxy Server running on port ${PORT}`);
});
