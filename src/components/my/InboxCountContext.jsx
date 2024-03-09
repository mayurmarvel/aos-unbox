import React, { createContext, useState, useEffect, useContext } from 'react';
import { dryrun } from '@permaweb/aoconnect';
import { ProcessIdContext } from './ProcessIdContext'; // Import ProcessIdContext

export const InboxCountContext = createContext();

export const InboxCountProvider = ({ children }) => {
  const [inboxCount, setInboxCount] = useState(null);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);
  const { processId } = useContext(ProcessIdContext); // Use useContext to access processId from ProcessIdContext

  useEffect(() => {
    async function fetchData() {
      try {
        if (!processId) return; // Return if processId is not yet initialized

        const result = await dryrun({
          process: processId, // Use the processId from the context
          tags: [
            {
              name: 'Target',
              value: processId, // Use the processId from the context
            },
            { name: 'Action', value: '#Inbox' },
          ],
          data: '#Inbox',
        });

        if (
          result &&
          result.Messages &&
          result.Messages.length > 0 &&
          result.Messages[0].Tags
        ) {
          const count = retrieveCounts(result.Messages[0].Tags);
          console.log('count: ', count);
          setInboxCount(count);

          // Fetch the latest message timestamp
          const latestMessageTimestamp = getLatestMessageTimestamp(
            result.Messages
          );
          if (
            latestMessageTimestamp &&
            lastMessageTimestamp !== latestMessageTimestamp
          ) {
            setLastMessageTimestamp(latestMessageTimestamp);
            // Trigger a refresh if the count is incremented or reaches 1000
            if (count !== null && (count > inboxCount || count >= 1000)) {
              refreshMessages();
            }
          }
        } else {
          console.error(
            'Unable to retrieve inbox count. Result structure is not as expected.'
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    // Fetch data every 2 seconds
    const interval = setInterval(fetchData, 2000);

    // Cleanup function to clear interval on component unmount
    return () => clearInterval(interval);
  }, [inboxCount, lastMessageTimestamp, processId]); // Ensure useEffect runs when processId changes

  function retrieveCounts(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].name === 'InboxCount') {
        return data[i].value;
      }
    }
    // If 'InboxCount' not found, return a default value (null in this case)
    return null;
  }

  function getLatestMessageTimestamp(messages) {
    if (messages && messages.length > 0 && messages[0].Tags) {
      const messageDetails = messages[0].Tags.find(
        (tag) => tag.name === 'MessageDetails'
      );
      if (messageDetails) {
        return messageDetails.value.Timestamp;
      }
    }
    return null;
  }

  async function refreshMessages() {
    // Implement refresh logic here, e.g., refetching messages
    console.log('Refreshing messages...');
    try {
      // Perform necessary actions to refresh messages
    } catch (error) {
      console.error('Error refreshing messages:', error);
    }
  }

  return (
    <InboxCountContext.Provider value={{ inboxCount, setInboxCount }}>
      {children}
    </InboxCountContext.Provider>
  );
};
