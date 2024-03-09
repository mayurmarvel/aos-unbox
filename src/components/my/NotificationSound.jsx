import React from 'react';

function NotificationSound({ enableNotifications, setEnableNotifications }) {
  const handleChange = (event) => {
    setEnableNotifications(event.target.checked);
  };

  return (
    <div>
      <label>
        Enable Notifications:
        <input
          type="checkbox"
          checked={enableNotifications}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}

export default NotificationSound;
