import React from 'react';

// Can do a lot here with markdown parsing
// + selection nice.

interface MessageProps {
  message: string;
}

const Message = ({ message }: MessageProps) => {
  const formattedMessage = message.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return <div style={{ color: 'black', backgroundColor: 'white' }}>{formattedMessage}</div>;
};

export default Message;