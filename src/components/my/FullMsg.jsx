import React from 'react';

function FullMsg({ enableNotifications, setEnableNotifications }) {
  const handleChange = (event) => {
    setEnableNotifications(event.target.checked);
  };

  return (
    <div>
      <label>
        Enable Notifications:
      </label>
    </div>
  );
}

export default FullMsg;
