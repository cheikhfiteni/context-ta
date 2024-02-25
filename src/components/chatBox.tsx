import React, { Component } from 'react';
import { Rnd } from 'react-rnd';;

import "../style/ChatBox.css";

import Message from './Message';
import { callOpenAIStream } from '../../react-pdf-highlighter-fork/openAI';

interface Position {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

interface State {
    isTextAreaFocused: boolean;
    isChatBoxFocused: boolean;
    chatBoxRef: React.RefObject<HTMLDivElement>;
    chatInput: string;
    conversation: string[];
}

// write a function in main to take as a prop to know which chatbox is active, and 
// eventually be able to use that for 1) minorly locking RND and 2) knowing where to send
// an existing to for a text selection. This is a bit more complicated then you think

// consider blurring the outer chatbox when the user clicks the textarea or 
// have the shadow highlihgt like one of those mazdas

// Also for performance eventually remove the listener for global click when the chatbox is made inactive
// and add it back when it is made active again
  
interface Props {
    selection?: string;
    onDragStop: (position: Position) => void;
    onResizeStop: (size: Size) => void;
    onSubmit: (message: string) => void;
    lastActive?: (eitherBoxOrAreaFocused: boolean) => void;
    position: Position;
    size: Size;
}

export class ChatBox extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isTextAreaFocused: false,
            isChatBoxFocused: false,
            chatBoxRef: React.createRef<HTMLDivElement>(),
            chatInput: '',
            conversation: [],
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.handleGlobalClick);
    }
    
    componentWillUnmount() {
        document.removeEventListener('click', this.handleGlobalClick);
    }

    handleChatBoxFocus = () => {
        if (!this.state.isTextAreaFocused) {
            console.log('Chatbox focused sigh');
            this.setState({ isChatBoxFocused: true });
        } else {
            console.log('Chatbox attempted focused, but text area is already focused');
        }
    }

    handleChatBoxBlur = () => {
        console.log('Chatbox blurred');
        this.setState({ isChatBoxFocused: false });
    }

    handleGlobalClick = (event: MouseEvent) => {
        // Check if the click is outside the chatbox container
        if (this.state.chatBoxRef.current && !this.state.chatBoxRef.current.contains(event.target as Node)) {
            this.handleChatBoxBlur();
        }
    }
    handleFocus = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.stopPropagation();
        this.setState({ isTextAreaFocused: true, isChatBoxFocused: false });
      };
      
      handleBlur = () => {
        this.setState({ isTextAreaFocused: false });
      };

    handleChatInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ chatInput: event.target.value });
    }

    handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
          event.preventDefault(); // Prevents the default action of Enter which is to insert a newline
          if (this.state.isTextAreaFocused && this.state.chatInput.trim() !== '') {
            this.handleChatSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
          }
        } else if (event.key === 'Enter' && (event.shiftKey || event.metaKey)) {
            event.preventDefault();
            const { chatInput } = this.state;
            const cursorPosition = event.currentTarget.selectionStart;
            const newText = chatInput.slice(0, cursorPosition) + '\n' + chatInput.slice(cursorPosition);
            this.setState({ chatInput: newText });
            // Move the cursor to the next line after the inserted newline
            setTimeout(() => {
                event.currentTarget.selectionStart = cursorPosition + 1;
                event.currentTarget.selectionEnd = cursorPosition + 1;
            }, 0);
        }
      };


    getSelectedText = () => {
        const selection = this.props.selection;
        return selection ? selection.toString() : '';
    }

    // This is where relooping should be handled. Conditional on conversation length (to check if first prompt),
    // then you loop through everything. Create a token  budget? See what API thinks
    handleChatSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { chatInput } = this.state;
        const prompt = this.state.conversation.length === 0 ? "Make a reference to this specific highlighted text: " + this.getSelectedText() + "\n\n" + chatInput : chatInput;
        console.log('Prompt:', prompt);
        this.setState(prevState => ({
            conversation: [...prevState.conversation, `You: ${prompt}`],
            chatInput: ''
          }), async () => {
            // This code will be executed after the state update is applied
            const conversation = this.state.conversation;
            const messages = conversation.map((message, index) => {
                message = message.startsWith('Y') ? message.replace(/^You: /, '') : message.replace(/^AI: /, '');
              return { role: index % 2 === 0 ? "user" : "assistant", content: message };
            });
            console.log('Messages:', messages);
            try {
              await callOpenAIStream(messages, (chunk) => {
                this.setState(prevState => {
                    let newConversation = [...prevState.conversation];
                    if (newConversation.length === 0 || !newConversation[newConversation.length - 1].startsWith('AI:')) {
                        // First response chunk creates new AI message
                        newConversation.push(`AI: ${chunk}`);
                      } else {
                        // Otherwise, append the chunk to the last AI message
                        newConversation[newConversation.length - 1] += chunk;
                    }
                  
                    return { conversation: newConversation };
                  });
              });
            } catch (error) {
              console.error('Error calling OpenAI:', error);
              // Handle error appropriately
            }
          });
      };

    render() {
        return (
            <Rnd
                enableResizing={
                    this.state.isTextAreaFocused 
                    ? { top: false, bottom: false, left: false, right: false, topRight: false, topLeft: false, bottomRight: false, bottomLeft: false } 
                    : { top: true, bottom: true, left: true, right: true, topRight: true, topLeft: true, bottomRight: true, bottomLeft: true }
                }
                disableDragging={this.state.isTextAreaFocused}
                minWidth={320}
                minHeight={200}
                maxWidth={800}
                maxHeight={600}
                default={{
                    x: this.props.position.x,
                    y: this.props.position.y,
                    width: this.props.size.width,
                    height: this.props.size.height,
                }}
                onDrag={this.handleChatBoxBlur}
                onDragStop={(_, data) => this.props.onDragStop({ x: data.x, y: data.y })}
                onResizeStop={(_, __, ref) => this.props.onResizeStop({ width: ref.offsetWidth, height: ref.offsetHeight })}
                style={{ zIndex: 1000 }}
            >
                <div ref={this.state.chatBoxRef} onClick={this.handleChatBoxFocus} className={`ChatBox__card ${this.state.isChatBoxFocused ? 'ChatBox__card--focused' : ''}`}>
                    <div>
                        {this.state.conversation.map((message, index) => (
                            <>
                            <Message key={index} message={message} />
                            <br />
                            </>
                        ))}
                    </div>
                    <form className = "ChatBox__card__inputalignment" onSubmit={this.handleChatSubmit}>
                        <textarea
                        placeholder="Type your message and press Enter"
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        //autoFocus
                        value={this.state.chatInput}
                        onChange={this.handleChatInputChange}
                        onKeyDown={this.handleKeyDown}
                        style={{width: "100%", height: "100px"}}
                        />
                        <input type="submit" value="Send" style={{width: "100px"}}/>
                    </form>
                </div>
            </Rnd>
        );
    }
}