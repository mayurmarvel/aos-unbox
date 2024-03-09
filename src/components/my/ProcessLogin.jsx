import React, { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProcessIdContext } from './ProcessIdContext';

export function ProcessLogin() {
  // State to store the process ID entered by the user
  const [processIdInput, setProcessIdInput] = useState('');
  // State to store the nickname entered by the user
  const [nickNameInput, setNickNameInput] = useState('');
  // State to store the checkbox status
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  // State to store process ID validity
  const [validProcessId, setValidProcessId] = useState(true);
  // State to store nickname validity
  const [validNickname, setValidNickname] = useState(true);
  // State to store login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Context to access the process ID and set it
  const { setProcessId } = useContext(ProcessIdContext);

  // Function to handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if process ID is valid
    if (processIdInput.length !== 43) {
      setValidProcessId(false);
      return;
    }
    // Set the process ID in the context
    setProcessId(processIdInput);
    // Reset the input fields
    setProcessIdInput('');
    setNickNameInput('');
    setValidProcessId(true);
    setValidNickname(true);
    setIsLoggedIn(true);
    // Store login status in local storage
    localStorage.setItem('isLoggedIn', 'true');
    // Reload the page
    window.location.reload();
  };

// Function to handle logout
const handleLogout = () => {
  // Clear local storage
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('processId');
  // Reset state
  setIsLoggedIn(false);
  setProcessIdInput('');
  setNickNameInput('');
  setValidProcessId(true);
  setValidNickname(true);
  // Reload the page
  window.location.reload();
};

  // Function to handle checkbox change
  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked); // Toggle checkbox state
  };

  // Check if user is logged in
  const isLoggedInLocalStorage = localStorage.getItem('isLoggedIn');
  if (isLoggedInLocalStorage === 'true' && !isLoggedIn) {
    setIsLoggedIn(true);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={isLoggedIn ? handleLogout : null}>
          {isLoggedIn ? 'Logout' : 'Login'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login to AOS Unbox</DialogTitle>
          <DialogDescription>
            Please load this{' '}
            <a href="https://github.com/mayurmarvel/aos-unbox/blob/main/README.md" className="font-bold">
              'inbox.lua'
            </a>{' '}
            file to start receiving Messages.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="processIDInput" className="text-right">
                Process ID
              </Label>
              <Input
                id="processIDInput"
                value={processIdInput}
                onChange={(e) => {
                  setProcessIdInput(e.target.value);
                  setValidProcessId(e.target.value.length === 43); // Validate process ID length
                }}
                className="col-span-3"
              />
              {!validProcessId && (
                <p className="text-red-500 col-span-4">⚠ Invalid Process ID</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nickNameInput" className="text-right">
                Nick Name
              </Label>
              <Input
                id="nickNameInput"
                value={nickNameInput}
                onChange={(e) => {
                  setNickNameInput(e.target.value);
                  setValidNickname(e.target.value.length > 0); // Validate nickname
                }}
                className="col-span-3"
                maxLength={10}
              />
              {!validNickname && (
                <p className="text-red-500 col-span-4">⚠ Invalid Nickname</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="items-top flex space-x-2 col-span-4 pl-4">
                <input
                  type="checkbox"
                  id="terms1"
                  className="self-start text-xl"
                  checked={checkboxChecked}
                  onChange={handleCheckboxChange}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I have loaded inbox.lua
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Instructions:{' '}
                    <a href="https://github.com/mayurmarvel/aos-unbox/blob/main/README.md" className=" font-bold">
                      Click Here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!checkboxChecked || !validProcessId || !validNickname}
            >
              Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
