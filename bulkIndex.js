require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { bulkIndexDocuments } = require('./api/indexer');

// Path to the single JSON file
const STATES_FILE = path.join(__dirname, 'documents', 'states.json');

/**
 * Main function to read and bulk index documents from states.json.
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

    await bulkIndexDocuments(documents);

    console.log('Bulk indexing completed.');
  } catch (error) {
    console.error(
        'Error during bulk indexing:', 
        error.response 
        ? JSON.stringify(error.response.data, null, 2) 
        : error.message
    );
  }
}

main();