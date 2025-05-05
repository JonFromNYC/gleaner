// get_datasource_config.js
require('dotenv').config();
const axios = require('axios');

const BEARER_TOKEN = process.env.BEARER_TOKEN;
const GET_CONFIG_URL = 'https://support-lab-be.glean.com/api/index/v1/getdatasourceconfig';

async function getDatasourceConfig() {
  try {
    const response = await axios.post(
      GET_CONFIG_URL,
      { datasource: 'interviewds' },
      {
        headers: {
          Authorization: BEARER_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Datasource Config:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      'Error fetching datasource config:',
      error.response.data
    );
  }
}

getDatasourceConfig();