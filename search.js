require('dotenv').config();
const axios = require('axios');

// Environment Variables
const SEARCH_API_URL = process.env.SEARCH_API_URL;
const CHAT_TOKEN = process.env.CHAT_TOKEN;

/**
 * Searches for documents in the interviewds datasource mentioning the Civil Rights Movement.
 */
async function searchDocuments() {
  try {
    const response = await axios.post(
      SEARCH_API_URL,
      {
        query: 'Civil Rights Movement',
        filters: {
          datasource: ['interviewds']
        },
        pageSize: 10 // My document title alabama is result 10
      },
      {
        headers: {
          Authorization: `Bearer ${CHAT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Search results for "Civil Rights Movement":');
    if (response.data.results && response.data.results.length > 0) {
      response.data.results.forEach((result, index) => {
        console.log(`Result ${index + 1}:`);
        console.log(`  Title: ${result.document.title}`);
        console.log(`  ID: ${result.document.id}`);
        console.log(`  Snippet: ${result.snippet || 'No snippet available'}`);
        console.log(`  View URL: ${result.document.viewUrl}`);
        console.log('');
      });
    } else {
      console.log('No documents found mentioning "Civil Rights Movement".');
    }
  } catch (error) {
    console.error(
      'Error searching documents:',
      error.response ? JSON.stringify(error.response.data, null, 2) : error.message
    );
  }
}

searchDocuments();