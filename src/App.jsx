import { useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';
import InboxCount from '@/components/my/InboxCount';
import { InboxCountProvider } from '@/components/my/InboxCountContext';
import { ProcessIdProvider } from '@/components/my/ProcessIdContext';
import { ProcessLogin } from '@/components/my/ProcessLogin';
import InboxBox from '@/components/my/InboxBox';
import NavBar from '@/components/my/NavBar';
import Footer from '@/components/my/Footer';
import { Analytics } from '@vercel/analytics/react';

import './App.css';

function App() {
  return (
    <>
      <ProcessIdProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <InboxCountProvider>
            <div
              id="body"
              className=" waves-background flex flex-col h-screen align-center "
            >
              <div
                id="wrapper"
                className=" flex flex-col align-baseline min-w-80 w-12/12 md:w-8/12 px-7"
              >
                <NavBar />
                <div id="wrap">
                  {/* <InboxCount /> */}
                </div>
                <InboxBox />
              </div>
            {/* <Footer /> */}
            </div>
            <Analytics />
          </InboxCountProvider>
        </ThemeProvider>
      </ProcessIdProvider>
    </>
  );
}

export default App;
