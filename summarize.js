// summarize.js
require('dotenv').config();
const axios = require('axios');

// Environment Variables
const CHAT_API_URL = process.env.CHAT_API_URL;
const CHAT_TOKEN = process.env.CHAT_TOKEN;

/**
 * Summarizes documents from the interviewds datasource using the Glean Chat API.
 */
async function summarizeDocuments() {
  try {
    const response = await axios.post(
      CHAT_API_URL,
      {
        query: 'Is there at least one document in the interviewds datasource mentioning the civil rights movement.',
        filters: {
          datasource: ['interviewds']
        }
      },
      {
        headers: {
          Authorization: `Bearer ${CHAT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Summary of documents:');
    console.log(response.data.summary || 'No summary returned.');
  } catch (error) {
    console.error(
      'Error summarizing documents:',
      error.response ? JSON.stringify(error.response.data, null, 2) : error.message
    );
  }
}

summarizeDocuments();