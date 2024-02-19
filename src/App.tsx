import React, { Component, ChangeEvent } from "react";

import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
} from "./react-pdf-highlighter";

import type { IHighlight, NewHighlight } from "./react-pdf-highlighter";

import { testHighlights as _testHighlights } from "./test-highlights";
import { Spinner } from "./Spinner";
// import { Sidebar } from "./Sidebar";

import { ChatBox } from "./components/chatBox";
import Dock from "./components/Dock";

import "./style/App.css";

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}


interface ChatBoxPositionalState {
  selection?: string;
  position: Position;
  size: Size;
}

interface State {
  url: string;
  highlights: Array<IHighlight>;
  isPopupOpen: boolean;
  chatBoxes: Array<ChatBoxPositionalState>;
}

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
// const PRIMARY_PDF_URL = "https://cors-anywhere.herokuapp.com/https://www.cs.cmu.edu/~sandholm/Expressive%20commerce.aimag07.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;
let initialTitle = searchParams.get("title") || "Fast and Precise Type Checking for JavaScript";

class App extends Component<{}, State> {
  state = {
    url: initialUrl,
    isPopupOpen: false,
    highlights: testHighlights[initialUrl]
      ? [...testHighlights[initialUrl]]
      : [],
    chatBoxes: [] as Array<ChatBoxPositionalState>,
  };

  fileInputRef = React.createRef<HTMLInputElement>();

  onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileURL = URL.createObjectURL(file);
      initialTitle = file.name;
      this.setState({
        url: fileURL,
        highlights: [],
        chatBoxes: [],
        isPopupOpen: false,
      });
    }
  };

  resetHighlights = () => {
    this.setState({
      highlights: [],
    });
  };

  toggleDocument = () => {
    const newUrl =
      this.state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    this.setState({
      url: newUrl,
      highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : [],
    });
  };

  // Not sure why this function is here. I think it is to do a scroll animation
  // but putting the component id hash in the url already causes a jump. TODO: fix
  scrollViewerTo = (_highlight: any) => {};

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {
    // When I don't want to use the test highlights
    this.resetHighlights();
    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }


  handleKeyDown = (event: KeyboardEvent) => {
    if (event.metaKey && event.key === 'k') {
      event.preventDefault();
      this.openChatWithHighlightedText();
    }
  };

  // TODO: Finish these with cursor like dyanmic chat input
  openChatWithHighlightedText = () => {
    const selectedText = this.getSelectedText();
    console.log('Selected text:', selectedText);
    // Open chat with selected text
  };


  // The selected text thing actually happens in the Tip component.
  // which is passed content.text as the selection. So...
  // TODO: need to use statehook to store the selected text and then pass it to the chat
  // on hotkey.
  getSelectedText = () => {
    return "This is the selected text";
  };

  getHighlightById(id: string) {
    const { highlights } = this.state;

    return highlights.find((highlight) => highlight.id === id);
  }

  addHighlight(highlight: NewHighlight) {
    const { highlights } = this.state;

    console.log("Saving highlight", highlight);

    this.setState({
      highlights: [{ ...highlight, id: getNextId() }, ...highlights],
    });
  }

  updateHighlight(highlightId: string, position: Object, content: Object) {
    console.log("Updating highlight", highlightId, position, content);

    this.setState({
      highlights: this.state.highlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      }),
    });
  }

  handleToolTipClick = (selection: string, position: Position) => {
    this.setState((prevState) => ({
      chatBoxes: [...prevState.chatBoxes, { position, size: { width: 320, height: 200 }, selection }],
    }));
  };

  render() {
    const { url, highlights } = this.state;

    return (
      <>
      <input
        type="file"
        ref={this.fileInputRef}
        style={{ display: 'none' }}
        onChange={this.onFileChange}
        accept="application/pdf"
      />
      <Dock
        title={null|| initialTitle}
        onMenuClick={() => this.fileInputRef.current?.click()}
        onZoomIn={() => console.log('Zoom in clicked')}
        onZoomOut={() => console.log('Zoom out clicked')}
        // onFitToPage={() => console.log('Fit to page clicked')}
        // onRotate={() => console.log('Rotate clicked')}
        onPrint={() => console.log('Print clicked')}
        onMoreActions={() => console.log('More actions clicked')}
        onDownload={() => console.log('Download clicked')}
        handlePageChange={() => console.log('Page change clicked')}
        pageNumber={1000}
      />
      <div className="App" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        {/* <Sidebar
          highlights={highlights}
          resetHighlights={this.resetHighlights}
          toggleDocument={this.toggleDocument}
        /> */}
        {/* <ChatBox
          position={{ x: window.innerWidth - 350, y: 240 }}
          size={{ width: 320, height: 200 }}
          onResizeStop={(size) => console.log('Size:', size)}
          onDragStop={(position) => console.log('Position:', position)}
          onSubmit={(message) => console.log('Message:', message)}
        /> */}
        <div
          style={{
            height: "100vh",
            width: "100vw",
            position: "relative",
          }}
        >
          <PdfLoader url={url} beforeLoad={<Spinner />}>
            {(pdfDocument) => (
              <PdfHighlighter
                chatBoxes={this.state.chatBoxes}
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}
                pdfScaleValue="page-actual"
                scrollRef={(scrollTo) => {
                  this.scrollViewerTo = scrollTo;

                  this.scrollToHighlightFromHash();
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => (
                  <Tip
                    selection={content.text}
                    onOpen={transformSelection}
                    // Eventually need to convert scaledPosition to Position using a lib function
                    onToolTipClick={() => this.handleToolTipClick(content.text || "no text selected", { x: position.boundingRect.x1, y: position.boundingRect.y1 })}
                    onConfirm={(comment) => {
                      this.addHighlight({ content, position, comment });
                      hideTipAndSelection();
                    }}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  const isTextHighlight = !Boolean(
                    highlight.content && highlight.content.image
                  );

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={(boundingRect) => {
                        this.updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                    />
                  );

                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, () => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                      children={component}
                    />
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
          {/* <ChatBox
            position={{ x: window.innerWidth - 350, y: 240 }}
            size={{ width: 320, height: 200 }}
            onResizeStop={(size) => console.log('Size:', size)}
            onDragStop={(position) => console.log('Position:', position)}
            onSubmit={(message) => console.log('Message:', message)}
          /> */}
          {/* {this.state.chatBoxes.map((chatBox, index) => (
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
      </div>
      </>
    );
  }
}

export default App;
