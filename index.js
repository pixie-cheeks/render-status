require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.RENDER_API_KEY;
const SERVICE_ID = process.env.RENDER_SERVICE_ID;

async function getDeployStatus() {
  try {
    const response = await axios.get(
      `https://api.render.com/v1/services/${SERVICE_ID}/deploys?limit=1`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    const latestDeploy = response.data[0].deploy;
    return latestDeploy.status; 
  } catch (error) {
    console.error('Error fetching deploy status:', error.message);
    return 'unknown';
  }
}


async function generateBadgeUrl() {
  const status = await getDeployStatus();
  const statusMap = {
    created: { label: 'Deploying', color: 'blue' },
    queued: { label: 'Deploying', color: 'blue' },
    build_in_progress: { label: 'Deploying', color: 'blue' },
    update_in_progress: { label: 'Deploying', color: 'blue' },
    live: { label: 'Live', color: 'brightgreen' },
    deactivated: { label: 'Canceled', color: 'grey' },
    build_failed: { label: 'Failed', color: 'red' },
    update_failed: { label: 'Failed', color: 'red' },
    canceled: { label: 'Canceled', color: 'grey' },
    pre_deploy_in_progress: { label: 'Deploying', color: 'blue' },
    pre_deploy_failed: { label: 'Failed', color: 'red' },
    unknown: { label: 'Unknown', color: 'lightgrey' }
  };

  const { label, color } = statusMap[status] || statusMap.unknown;
  return `https://img.shields.io/badge/Render-${encodeURIComponent(label)}-${color}?logo=render&style=for-the-badge`;
}

generateBadgeUrl().then(console.log);