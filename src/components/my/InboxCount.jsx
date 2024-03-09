import React, { useContext } from 'react';
import { InboxCountContext } from './InboxCountContext';

function InboxCount() {
  const { inboxCount } = useContext(InboxCountContext);

  return (
    <>
      <p>Inbox Count: {inboxCount !== null ? inboxCount : 'Loading...'}</p>
    </>
  );
}

export default InboxCount;
