/// Importing necessary libraries
const axios = require('axios');

exports.main = async (context = {}, sendRequest) => {
//assuming every deal has an object_id
  const { object_id } = context.propertiesToSend;
  const { associations } = context.parameters;
  const token = process.env['HUBSPOT_ACCESS_TOKEN'];

  const dealDetails = await fetchDealDetails(token, object_id);
  const newDeal = await createAssociatedDeal(token, dealDetails, associations);

  return newDeal;
};

// Function to fetch existing deal details
const fetchDealDetails = async (token, id) => {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/deals/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
};

// Function to create a new associated deal
const createAssociatedDeal = async (token, dealDetails, associations) => {
  try {
    const { associatedCompany, lineItems } = dealDetails.properties;

    // Prompt user to select a pipeline for the new deal
    const selectedPipeline = prompt('Enter the pipeline ID for the new deal:');
    if (!selectedPipeline) {
      return null; // User cancelled
    }

    // Construct payload for creating new deal
    const newDealPayload = {
      properties: {
        associatedcompanyid: associatedCompany,
        line_item_ids: lineItems,
        pipeline: selectedPipeline
      }
    };

    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/objects/deals',
      newDealPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (err.response && err.response.status === 401) {
      throw new Error('You do not have permission to make a new associated deal');
    } else {
      throw err;
  }
};
