import { ScaledPosition } from '../react-pdf-highlighter';

// In App.tsx, make that Position into CBPosition just because there could be 
// confusion with the Position from react-pdf-highlighter
interface CBPosition {
    x: number;
    y: number;
}

// Keeping _pageHeight mechanism in params and App.tsx in case we need it to deal with resize. boundingRect should be fine though 
export function calculateChatBoxPosition(position: ScaledPosition, _pageHeight: number): { x: number, y: number } {
    const boundingOffset = (position.pageNumber - 1) * position.boundingRect.height;
  
    // Ignoring a known issue with the centering of the chat box and especially the tool tip for now
    // TODO: these arbritrary resizing numbers will change, and dynamic resize with window
    // See branch center-positioning-bug if curious
  
    const rightX = (position.boundingRect.width/2) + 700;
    const leftX = (position.boundingRect.width/2) - 200;

    // This looks a little better but I still think the initial demo looks best where it is relative or same place
    // That you move around. To be cleaned
    const chosenX = (Math.random() < 0.5 ? leftX : rightX)

    const centerY = position.boundingRect.y1 - 100;
  
    console.log(`The pageNumber is: ${position.pageNumber}, The pageHeight inferred from boundingRectHeight is: ${position.boundingRect.height}, The boundingOffset is: ${boundingOffset}`);
  
    return { x: chosenX, y: (centerY + boundingOffset) } as CBPosition;
  }