import { viewportToScaled } from "../lib/coordinates";
import {
  IHighlight,
  LTWH,
  LTWHP,
  Position,
  Scaled,
  ScaledPosition,
} from "../types";

import { ChatBox } from "../../src/components/chatBox";

interface CBPosition {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

//NOTE THIS CHANGE. MAYBE FIX THE SCALING
interface ChatBoxPositionalState {
  selection?: string;
  position: CBPosition;
  size: Size;
}


interface HighlightLayerProps<T_HT> {
  chatBoxes: Array<ChatBoxPositionalState>;
  highlightsByPage: { [pageNumber: string]: Array<T_HT> };
  pageNumber: string;
  scrolledToHighlightId: string;
  highlightTransform: (
    highlight: any,
    index: number,
    setTip: (highlight: any, callback: (highlight: any) => JSX.Element) => void,
    hideTip: () => void,
    viewportToScaled: (rect: LTWHP) => Scaled,
    screenshot: (position: LTWH) => string,
    isScrolledTo: boolean
  ) => JSX.Element;
  tip: {
    highlight: any;
    callback: (highlight: any) => JSX.Element;
  } | null;
  scaledPositionToViewport: (scaledPosition: ScaledPosition) => Position;
  hideTipAndSelection: () => void;
  viewer: any;
  screenshot: (position: LTWH, pageNumber: number) => string;
  showTip: (highlight: any, content: JSX.Element) => void;
  setState: (state: any) => void;
}

export function HighlightLayer<T_HT extends IHighlight>({
  // chatBoxes,
  highlightsByPage,
  scaledPositionToViewport,
  pageNumber,
  scrolledToHighlightId,
  highlightTransform,
  tip,
  hideTipAndSelection,
  viewer,
  screenshot,
  showTip,
  setState,
}: HighlightLayerProps<T_HT>) {
  const currentHighlights = highlightsByPage[String(pageNumber)] || [];
  return (
    <div>
      {currentHighlights.map(({ position, id, ...highlight }, index) => {
        // @ts-ignore
        const viewportHighlight: any = {
          id,
          position: scaledPositionToViewport(position),
          ...highlight,
        };

        if (tip && tip.highlight.id === String(id)) {
          showTip(tip.highlight, tip.callback(viewportHighlight));
        }

        const isScrolledTo = Boolean(scrolledToHighlightId === id);

        return highlightTransform(
          viewportHighlight,
          index,
          (highlight, callback) => {
            setState({
              tip: { highlight, callback },
            });

            showTip(highlight, callback(highlight));
          },
          hideTipAndSelection,
          (rect) => {
            const viewport = viewer.getPageView(
              (rect.pageNumber || parseInt(pageNumber)) - 1
            ).viewport;

            return viewportToScaled(rect, viewport);
          },
          (boundingRect) => screenshot(boundingRect, parseInt(pageNumber)),
          isScrolledTo
        );
      })}
      {/* Note this is a functional component (finally ig lol) so destrcutured directly rather than with this */}
      {/* {chatBoxes.map((chatBox, index) => (
        <ChatBox
          key={index}
          position={chatBox.position}
          size={chatBox.size}
          onResizeStop={(size) => console.log('Size:', size)}
          onDragStop={(position) => console.log('Position:', position)}
          onSubmit={(message) => console.log('Message:', message)}
        />
      ))} */}
    </div>
  );
}
