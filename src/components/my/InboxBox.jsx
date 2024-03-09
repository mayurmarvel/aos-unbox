import React, { useState, useEffect, useContext } from 'react';
import { dryrun } from '@permaweb/aoconnect';
import { InboxCountContext } from '@/components/my/InboxCountContext';
import { ProcessIdContext } from '@/components/my/ProcessIdContext';
import InboxMessage from './InboxMessage'; // Import the InboxMessage component
import { Button } from '@/components/ui/button';

// Import your audio file
import audioFile from '@/assets/notify.mp3'; // Adjust the path accordingly

function InboxBox() {
  const { inboxCount } = useContext(InboxCountContext);
  const { processId } = useContext(ProcessIdContext);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);
  const [enableNotification, setEnableNotification] = useState(false);
  const [fetchingMessages, setFetchingMessages] = useState(false); // State to track message fetching status

  useEffect(() => {
    const storedValue = localStorage.getItem('enableNotification');
    if (storedValue !== null) {
      setEnableNotification(storedValue === 'true');
    }
  }, []);

  useEffect(() => {
    if (inboxCount !== null && processId) {
      setFetchingMessages(true); // Set fetching status to true when fetching starts
      async function fetchInboxMessages() {
        const messages = [];
        const startIndex = Math.max(1, inboxCount - 9);
        for (let i = startIndex; i <= inboxCount; i++) {
          const result = await dryrun({
            process: processId,
            tags: [
              {
                name: 'Target',
                value: processId,
              },
              { name: 'Action', value: 'CheckInbox' },
              { name: 'Index', value: String(i) },
            ],
          });
          const inboxMessage = getInboxMessage(result.Messages[0].Tags);
          messages.push(inboxMessage);
        }
        setInboxMessages(messages.reverse());
        if (messages.length > 0) {
          setLastMessageTimestamp(messages[0].timestamp);
          if (enableNotification) {
            playAudio();
          }
        }
        setFetchingMessages(false); // Set fetching status to false after fetching completes
      }

      fetchInboxMessages();
    }
  }, [inboxCount, processId]);

  const handleNotificationToggle = () => {
    const newValue = !enableNotification;
    setEnableNotification(newValue);
    localStorage.setItem('enableNotification', newValue.toString());
  };

  // Updated getInboxMessage function to return the entire JSON object
  function getInboxMessage(fullMsg) {
    let message = {};
    for (let i = 0; i < fullMsg.length; i++) {
      switch (fullMsg[i].name) {
        case 'MessageDetails':
          message = fullMsg[i].value;
          break;
        default:
          break;
      }
    }
    return message;
  }

  function formatDate(timestamp) {
    const currentTime = new Date();
    const messageTime = new Date(timestamp);
    const elapsedSeconds = Math.floor((currentTime - messageTime) / 1000);

    if (elapsedSeconds < 60) {
      return `${elapsedSeconds} seconds ago`;
    } else if (elapsedSeconds < 3600) {
      return `${Math.floor(elapsedSeconds / 60)} minutes ago`;
    } else if (elapsedSeconds < 86400) {
      return `${Math.floor(elapsedSeconds / 3600)} hours ago`;
    } else {
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      };
      return messageTime.toLocaleDateString(undefined, options);
    }
  }

  const playAudio = () => {
    const audio = new Audio(audioFile);
    audio.play();
  };

  return (
    <div className='flex flex-col gap-3'>
      <h1 className=" text-2xl md:text-4xl font-thin pl-1  mb-[-18px]">AOS UNBOX</h1>
      <h2 className="text-5xl font-medium md:text-7xl">MESSAGES</h2>
      <Button className="notification-toggle w-min" onClick={handleNotificationToggle}>
        {enableNotification ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7142857142857142" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell-ring w-6 h-6 md:w-8 md:h-8">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7142857142857142" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell-off w-6 h-6 md:w-8 md:h-8">
            <path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"/><path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="m2 2 20 20"/>
          </svg>
        )}
      </Button>
      {processId ? (
        fetchingMessages ? (
          <p>Loading...</p>
        ) : (
          <>
            <div>
              {inboxMessages.map((message, index) => (
                <InboxMessage
                  key={index} // Assign a unique key to each message
                  message={message}
                  index={index}
                  inboxCount={inboxCount}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </>
        )
      ) : (
        <p>Login with your Process ID</p>
      )}
    </div>
  );
}

export default InboxBox;
