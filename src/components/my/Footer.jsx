import React from 'react';

function Footer() {
  return (
    <footer
      id="footer-wrapper"
      className='flex flex-col items-center bg-gray-900 p-1'
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
      }}
    >
      <p>Made with ❤ by <a href="https://github.com/mayurmarvel">Mayur</a></p>
    </footer>
  );
}

export default Footer;
