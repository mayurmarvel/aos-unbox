import React, { useState, useEffect, useContext } from 'react';
import { dryrun } from '@permaweb/aoconnect';
import { InboxCountContext } from './InboxCountContext';

// Import your audio file
import audioFile from '../assets/notify.mp3'; // Adjust the path accordingly
import Avatar from './Avatar';

function InboxBox() {
  const { inboxCount } = useContext(InboxCountContext);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);
  const [enableNotification, setEnableNotification] = useState(false); // State to track notification sound enable/disable

  useEffect(() => {
    // Retrieve enableNotification value from local storage on component mount
    const storedValue = localStorage.getItem('enableNotification');
    if (storedValue !== null) {
      setEnableNotification(storedValue === 'true'); // Convert string to boolean
    }
  }, []);

  useEffect(() => {
    if (inboxCount !== null) {
      async function fetchInboxMessages() {
        const messages = [];
        const startIndex = Math.max(1, inboxCount - 9); // Calculate starting index for fetching the last 10 records
        for (let i = startIndex; i <= inboxCount; i++) {
          const result = await dryrun({
            process: 'FgU-RiEaLuC__SHZnI9pSIa_ZI8o-8hUVG9nPJvs92k',
            tags: [
              {
                name: 'Target',
                value: 'FgU-RiEaLuC__SHZnI9pSIa_ZI8o-8hUVG9nPJvs92k',
              },
              { name: 'Action', value: 'CheckInbox' },
              { name: 'Index', value: String(i) },
            ],
          });
          const inboxMessage = getInboxMessage(result.Messages[0].Tags);
          messages.push(inboxMessage);
        }
        setInboxMessages(messages.reverse()); // Reverse the order of messages
        if (messages.length > 0) {
          setLastMessageTimestamp(messages[0].timestamp);
          // Check if notification is enabled before playing audio
          if (enableNotification) {
            playAudio();
          }
        }
      }

      fetchInboxMessages();
    }
  }, [inboxCount, enableNotification]);

  // Function to handle checkbox change
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setEnableNotification(isChecked);
    // Store the value in local storage
    localStorage.setItem('enableNotification', isChecked.toString());
  };

  function getInboxMessage(fullMsg) {
    let timestamp = '';
    let from = '';
    let data = '';

    for (let i = 0; i < fullMsg.length; i++) {
      switch (fullMsg[i].name) {
        case 'MessageDetails':
          const messageDetails = fullMsg[i].value;
          timestamp = messageDetails.Timestamp;
          from = messageDetails.From || '';
          data = messageDetails.Data || '';
          break;
        // Add other cases if needed for additional properties
        default:
          break;
      }
    }

    return { timestamp, from, data };
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

  // Function to play the audio
  const playAudio = () => {
    const audio = new Audio(audioFile);
    audio.play();
  };

  return (
    <div>
      <h1>Inbox Messages</h1>
      <p>Last Message Timestamp: {lastMessageTimestamp}</p>
      {/* Checkbox to enable/disable notification sound */}
      <label>
        Enable Notification Sound
        <input
          type="checkbox"
          checked={enableNotification}
          onChange={handleCheckboxChange}
        />
      </label>
      <ul>
        {inboxMessages.map((message, index) => (
          <li key={index}>
            <Avatar seed={message.from} width="50" />
            <strong>Inb:</strong> {inboxCount - index} <br />
            <strong>Timestamp:</strong> {formatDate(message.timestamp)}
            <br />
            <strong>From:</strong> {message.from}
            <br />
            <strong>Data:</strong> {message.data}
            <br />
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InboxBox;
