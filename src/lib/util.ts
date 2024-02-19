import { ScaledPosition } from '../react-pdf-highlighter';

// In App.tsx, make that Position into CBPosition just because there could be 
// confusion with the Position from react-pdf-highlighter
interface CBPosition {
    x: number;
    y: number;
}

export function calculateChatBoxPosition(position: ScaledPosition, pageHeight: number): { x: number, y: number } {
  const centerX = (position.boundingRect.x1 + position.boundingRect.x2) / 2;
  const centerY = (position.boundingRect.y1 + position.boundingRect.y2) / 2;
  const verticalOffset = (position.pageNumber - 1) * pageHeight;
  console.log(`The pageNumber is: ${position.pageNumber}, The pageHeight is: ${pageHeight}, The verticalOffset is: ${verticalOffset}`);

  return { x: centerX, y: (centerY + verticalOffset) } as CBPosition;
}