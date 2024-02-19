import { ScaledPosition } from '../react-pdf-highlighter';

// In App.tsx, make that Position into CBPosition just because there could be 
// confusion with the Position from react-pdf-highlighter
interface CBPosition {
    x: number;
    y: number;
}

// So the resizing isn't working rn to update pageHeight, and boundingRectHeight already does the trick, but keeping
// this general structure of pageHeight here just in case resizing does cause issues with boundingRectHeight in the future
export function calculateChatBoxPosition(position: ScaledPosition, _pageHeight: number): { x: number, y: number } {
  const boundingOffset = (position.pageNumber - 1) * position.boundingRect.height;

  // This will not give us for the where to put the thing but the center of the page
  const pageCenterX = position.boundingRect.width / 2;
  const pageCenterY = position.boundingRect.height / 2;
  // Which tells use that the issue is boundingRect is off AND boundingRect is now telling us

  // SO WE KNOW POSTION FROM ONSELECTIONFINISHED IS OFF

  const centerX = position.boundingRect.x2 + 350;
  const centerY = position.boundingRect.y1 - 100;

  console.log(`The pageNumber is: ${position.pageNumber}, The pageHeight inferred from boundingRectHeight is: ${position.boundingRect.height}, The boundingOffset is: ${boundingOffset}`);

  return { x: pageCenterX, y: (pageCenterY + boundingOffset) } as CBPosition;
}