import React, { useState } from 'react';
import Avatar from './Avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import JsonView from '@uiw/react-json-view';
import { githubDarkTheme } from '@uiw/react-json-view/githubDark';

function InboxMessage({ message, index, inboxCount, formatDate }) {
  const [showDialog, setShowDialog] = useState(false);

  const handleDialogToggle = () => {
    setShowDialog(!showDialog);
  };

  return (
    <>
      <div id='mailMsg' className="max-w-md flex items-center rounded-lg bg-popover p-4 shadow-md my-3">
        <Avatar seed={message.from} width="50" />
        <div className="flex w-full flex-col">
          <div className="mb-2 flex items-center justify-between">
            <p id="senderID" className="font-semibold text-accent-foreground">
              {message && message.From ? `${message.From.substring(0, 5)}...${message.From.substring(message.From.length - 5)}` : 'Unknown'}
            </p>
            <p id="dateAndTime" className="ml-2 text-sm text-gray-500">
              {formatDate(message && message.Timestamp)}
            </p>
          </div>
          <div className="msgData flex justify-between">
            <p id="messageData" className="xs:w-60 w-40 truncate text-foreground sm:w-64 md:w-80">
              {message && message.Data ? message.Data : ''}
            </p>
            <Dialog>
              <DialogTrigger>
                <div id="Expand" className="text-foreground" onClick={handleDialogToggle}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-expand"
                  >
                    <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
                    <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
                    <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
                    <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
                  </svg>
                </div>
              </DialogTrigger>
              <DialogContent className=' max-h-[80vh] max-w-[70vw] overflow-y-auto overflow-x-visible py-4 scrollbar-hide '>
                <DialogHeader className='text-left'>
                  <DialogTitle>Full Message Details:</DialogTitle>
                  <DialogDescription>
                  <JsonView value={message} style={githubDarkTheme} displayDataTypes={false} />
                  </DialogDescription> 
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}

export default InboxMessage;
