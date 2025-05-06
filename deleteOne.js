require('dotenv').config();
const axios = require('axios');

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

    console.log(`
      Deleted document ID ${documentId} with status ${response.status}. 
      NOTE: Can be more than a minute to delete.
    `);
  } catch (error) {
    console.error(
      `Error during deleteDocument() when deleting document ID [${documentId}]:`,
      error.response ? JSON.stringify(error.response.data, null, 2) : error.message
    );
  }
}

/**
 * Main function to delete a specific document (e.g., Alabama).
 */
async function main() {
  try {
    const TARGET_DOC_ID = 'arizona'; // The document ID's are lower case names
    console.log(`Attempting to delete doc-ID [${TARGET_DOC_ID}]...`);
    await deleteDocument(TARGET_DOC_ID);
    console.log(`Deletion of [${TARGET_DOC_ID}] completed.`);
  } catch (error) {
    console.error('Error - ', error.message);
  }
}

main();