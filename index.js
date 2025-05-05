// Node Modules
require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Environment Variables
const GLEAN_URL = process.env.GLEAN_URL;
const BEARER_TOKEN = process.env.BEARER_TOKEN;

// Path to the single JSON file
const STATES_FILE = path.join(__dirname, 'documents', 'states.json');

/**
 * Indexes a single document to the Glean API.
 * @param {Object} doc - The JSON document to index.
 */
async function indexDocument(doc) {
  try {
    // doc.document.viewURL = "https://en.wikipedia.org/wiki/"
    // Set permissions inside document
    doc.document.permissions = {
      allowedUsers: [
        { email: 'alex@glean-sandbox.com', datasourceUserId: 'alex@glean-sandbox.com', name: 'Alex' },
        { email: 'rajeev.bector@glean.com', datasourceUserId: 'rajeev.bector@glean.com', name: 'Rajeev Bector' }
      ],
      allowAnonymousAccess: true,
      allowAllDatasourceUsersAccess: true
    };

    const response = await axios.post(GLEAN_URL, doc, {
      headers: {
        Authorization: BEARER_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Indexed document ID ${doc.document.id} with status ${response.status}`);
  } catch (error) {
    console.error(
        `Error indexing document ID ${doc.document.id || '<blank>'}:`,
        error.response ? `HTTP:[${error.response.status}] - ${error.response.data.msg || error.response.data}` : error.message
      );
  }
}

/**
 * Main function to read and index all documents from states.json.
 */
async function main() {
  try {
    const fileContent = await fs.readFile(STATES_FILE, 'utf-8');
    const documents = JSON.parse(fileContent);

    if (!Array.isArray(documents) || documents.length === 0) {
      console.log('No documents found in states.json.');
      return;
    }

    console.log(`Found ${documents.length} documents to index.`);

    for (const doc of documents) {
      await indexDocument(doc);
    }

    console.log('Indexing completed.');
  } catch (error) {
    console.error('Error in main:', error.message);
  }
}

// Run the main function
main();