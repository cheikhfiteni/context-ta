import { ScaledPosition } from '../react-pdf-highlighter';

// In App.tsx, make that Position into CBPosition just because there could be 
// confusion with the Position from react-pdf-highlighter
interface CBPosition {
    x: number;
    y: number;
}

// So the resizing isn't working rn to update pageHeight, and boundingRectHeight already does the trick, but keeping
// this general structure of pageHeight
export function calculateChatBoxPosition(position: ScaledPosition, _pageHeight: number): { x: number, y: number } {
  const boundingOffset = (position.pageNumber - 1) * position.boundingRect.height;

  const centerX = position.boundingRect.x1;
  const centerY = position.boundingRect.y1 - 100;
  console.log(`The pageNumber is: ${position.pageNumber}, The pageHeight inferred from boundingRectHeight is: ${position.boundingRect.height}, The boundingOffset is: ${boundingOffset}`);

  return { x: centerX, y: (centerY + boundingOffset) } as CBPosition;
}