// api/indexer.js
const axios = require('axios');

// Environment Variables
const GLEAN_URL = process.env.GLEAN_URL;
const BULK_INDEX_URL = process.env.BULK_INDEX_URL;
const BEARER_TOKEN = process.env.BEARER_TOKEN;

/**
 * Indexes a single document to the Glean API.
 * @param {Object} doc - The JSON document to index.
 */
async function indexDocument(doc) {
  try {
    // Set permissions inside document
    doc.document.permissions = {
      allowedUsers: [{ email: 'alex@glean-sandbox.com', datasourceUserId: 'alex@glean-sandbox.com', name: 'Alex' },{ email: 'rajeev.bector@glean.com', datasourceUserId: 'rajeev.bector@glean.com', name: 'Rajeev Bector' }],
      allowAnonymousAccess: true,
      allowAllDatasourceUsersAccess: true
    };

    const response = await axios.post(GLEAN_URL, doc, {
      headers: {
        Authorization: BEARER_TOKEN,
        'Content-Type': 'application/json'}
    });

    console.log(`Indexed document ID ${doc.document.id} with status ${response.status}`);
  } catch (error) {
    console.error(
      `Error indexing document ID ${doc.document.id || '<blank>'}:`,
      error.response ? JSON.stringify(error.response.data, null, 2) : error.message
    );
    throw error;
  }
}

/**
 * Bulk indexes multiple documents to the Glean API.
 * @param {Array} documents - Array of document objects.
 */
async function bulkIndexDocuments(documents) {
  try {
    // Add permissions to each document and extract the document object
    const formattedDocs = documents.map(doc => {
        // add permissions to each document
        doc.document.permissions = {
        allowedUsers: [
            { 
                email: 'alex@glean-sandbox.com', 
                datasourceUserId: 'alex@glean-sandbox.com', 
                name: 'Alex' 
            },
            { 
                email: 'rajeev.bector@glean.com', 
                datasourceUserId: 'rajeev.bector@glean.com', 
                name: 'Rajeev Bector' 
            }
        ],
        allowAnonymousAccess: true,
        allowAllDatasourceUsersAccess: true
      };
      return doc.document;
    });
    
    // Source: https://developers.glean.com/api-reference/indexing/documents/bulk-index-documents
    const response = await axios.post(
      BULK_INDEX_URL,
      {
        datasource: 'interviewds',
        documents: formattedDocs,
        // Bulk indexing won't work without these fields
        uploadId: `upload-${Date.now()}`,
        isFirstPage: true,
        isLastPage: true,
        forceRestartUpload: true,
        disableStaleDocumentDeletionCheck: true,
      },
      {
        headers: {
          Authorization: BEARER_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`Bulk indexing ended with status [${response.status}]`);
  } catch (error) {
    console.error(
      'Error in bulk indexing:',
      error.response ? JSON.stringify(error.response.data, null, 2) : error.message
    );
    throw error;
  }
}

module.exports = { indexDocument, bulkIndexDocuments };