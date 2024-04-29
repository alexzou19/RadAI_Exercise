// Import components from React and HubSpot UI Extensions
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Alert,
  Button,
  DescriptionList,
  DescriptionListItem,
  Input,
  Link,
  LoadingSpinner,
  Text,
  Flex,
  hubspot,
  type Context,
  type ServerlessFuncRunner,
} from '@hubspot/ui-extensions';
import { hubspot } from '@hubspot/ui-extensions';

// Define the extension to be run in server
hubspot.extend(({ runServerlessFunction }) => (
  <NewAssociatedDeal runServerless={runServerlessFunction} />
));

const NewAssociatedDeal = ({ runServerless }) => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [dealAmount, setDealAmount] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Request statistics data from serverless function
    runServerless({
      name: 'get-data',
      propertiesToSend: ['hs_object_id'],
    })
      .then((serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          const { response } = serverlessResponse;
          setDealAmount(response.dealAmount);
          setDuration(response.duration);
        } else {
          setErrorMessage(serverlessResponse.message);
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [runServerless]);

  if (loading) {
    // If loading, show a spinner
    return <LoadingSpinner />;
  }
  if (errorMessage) {
    // If there's an error, show an alert
    return (
      <Alert title="Unable to create new associated deal" variant="error">
        {errorMessage}
      </Alert>
    );
  }

  return (
    <div>
      <h3>Create Associated Deal</h3>
      <label>
        Select Pipeline:
        <input
          type="text"
          value={selectedPipeline}
          onChange={(e) => setSelectedPipeline(e.target.value)}
        />
      </label>
      <button onClick={NewAssociatedDeal}>Create Associated Deal</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default NewAssociatedDeal;

  
