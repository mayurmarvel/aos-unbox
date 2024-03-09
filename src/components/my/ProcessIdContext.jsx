import React, { createContext, useState, useEffect } from 'react';

// Create context
export const ProcessIdContext = createContext();

// Provider component
export const ProcessIdProvider = ({ children }) => {
  // State to store process ID
  const [processId, setProcessId] = useState('');

  // Function to set process ID
  const setProcessIdValue = (value) => {
    setProcessId(value);
    // Store process ID in local storage
    localStorage.setItem('processId', value);
  };

  // Retrieve process ID from local storage on component mount
  useEffect(() => {
    const storedProcessId = localStorage.getItem('processId');
    if (storedProcessId) {
      setProcessId(storedProcessId);
    }
  }, []);

  return (
    <ProcessIdContext.Provider
      value={{ processId, setProcessId: setProcessIdValue }}
    >
      {children}
    </ProcessIdContext.Provider>
  );
};
