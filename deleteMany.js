require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Environment Variables
const DELETE_URL = process.env.DELETE_URL;
const BEARER_TOKEN = process.env.BEARER_TOKEN;

/**
 * Deletes a document from the interviewds datasource.
 * @param {string} documentId - The ID of the document to delete.
 */
async function deleteDocument(documentId) {
  try {
    const response = await axios.post(
      DELETE_URL,
      {datasource: 'interviewds',id: documentId},
      {headers: {Authorization: BEARER_TOKEN,'Content-Type': 'application/json'}}
    );

    console.log(`Deletion sent for document ID [${documentId}] with status ${response.status}. Note: Deletion may take several minutes.`);
  } catch (error) {
    console.error(
      `Error during deleteDocument() when deleting document ID [${documentId}]:`,
      error.response ? JSON.stringify(error.response.data, null, 2) : error.message
    );
  }
}

/**
 * Main function to delete all documents from states.json.
 */
async function main() {
  try {
    const STATES_FILE = path.join(__dirname, 'documents', 'states.json');
    const fileContent = await fs.readFile(STATES_FILE, 'utf-8');
    const documents = JSON.parse(fileContent);

    if (!Array.isArray(documents) || documents.length === 0) {
      console.log('No documents found in states.json.');
      return;
    }

    console.log(`Deleting [${documents.length}] documents from Glean...`);
    for (const doc of documents) {
      const documentId = doc.document.id;
      await deleteDocument(documentId);
    }
    console.log('Deletion request completed.');
  } catch (error) {
    console.error('Error in main:', error.message);
  }
}

main();