import React, { Component } from "react";
import { callOpenAI } from '../openAI';

import "../style/Tip.css";


interface State {
  compact: boolean;
  text: string;
  emoji: string;
  chatInput: string;
  conversation: string[];
}

interface Props {
  onConfirm: (comment: { text: string; emoji: string }) => void;
  onOpen: () => void;
  onToolTipClick: () => void;
  onUpdate?: () => void;
  selection?: string;
}

export class Tip extends Component<Props, State> {
  state: State = {
    compact: true,
    text: "",
    emoji: "",
    chatInput: "",
    conversation: [],
  };

  // for TipContainer
  componentDidUpdate(_nextProps: Props, nextState: State) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  getSelectedText = () => {
    const selection = this.props.selection;
    return selection ? selection.toString() : '';
  };

  // Updated onClick handler for the "Add highlight" button
  handleAddHighlightClick = () => {
    const selectedText = this.getSelectedText();
    console.log('Selected text:', selectedText);
    // DISABLING THE TOOL TIP EXPANSION, NOT NEEDED ANYMORE
    this.setState({ text: selectedText, compact: true });
    this.props.onOpen();

    // Now if the ChatBox is handled elsewhere
    this.props.onToolTipClick();
  };

  handleChatInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ chatInput: event.target.value });
  };

  handleChatSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { chatInput, conversation } = this.state;
    const prompt = "Make a reference to this specific highlighted text: " + this.state.text + "\n" + chatInput;
    console.log('Prompt:', prompt);
    console.log('Chat input:', chatInput);
    console.log('Text:', this.state.text);
    this.setState({ chatInput: "" }); // Clear input field

    try {
      const response = await callOpenAI(prompt);
      this.setState({
        conversation: [...conversation, `You: ${chatInput}`, `AI: ${response}`],
      });
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      // Handle error appropriately
    }
  };

  render() {
    const { compact, chatInput, conversation } = this.state;

    return (
      <div className="Tip">
        {compact ? (
          <div
            className="Tip__compact"
            onClick={() => {
              this.handleAddHighlightClick()
            }}
          >
            Add highlight
          </div>
        ) : (
          <div className="Tip__card">
          <div>
            {conversation.map((message, index) => (
              <div key={index} style={{ color: 'black', backgroundColor: 'white' }}>{message}</div>
            ))}
          </div>
          <form onSubmit={this.handleChatSubmit}>
            <textarea
              placeholder="Type your message and press Enter"
              autoFocus
              value={chatInput}
              onChange={this.handleChatInputChange}
            />
            <input type="submit" value="Send" />
          </form>
        </div>
      )}
      </div>
    );
  }
}

export default Tip;
