import { Component } from 'react';
import { Rnd } from 'react-rnd';;

import { callOpenAI } from '../lib/openAI';
import "../style/ChatBox.css";

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
    text: string;
    chatInput: string;
    conversation: string[];
}
  
interface Props {
    selection?: string;
    onDragStop: (position: Position) => void;
    onResizeStop: (size: Size) => void;
    onSubmit: (message: string) => void;
    position: Position;
    size: Size;
}

export class ChatBox extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isTextAreaFocused: false,
            text: '',
            chatInput: '',
            conversation: [],
        };
    }

    handleFocus = () => {
        this.setState({ isTextAreaFocused: true });
      };
      
      handleBlur = () => {
        this.setState({ isTextAreaFocused: false });
      };

    handleChatInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ chatInput: event.target.value });
    }

    // This is where relooping should be handled. Conditional on conversation length (to check if first prompt),
    // then you loop through everything. Create a token  budget? See what API thinks
    handleChatSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { chatInput, conversation } = this.state;
        const prompt = "Make a reference to this specific highlighted text: " + this.state.text + "\n" + chatInput;
        console.log('Prompt:', prompt);
        console.log('Chat input:', chatInput);
        console.log('Text:', this.state.text);
        this.setState(prevState => ({
            conversation: [...prevState.conversation, this.state.chatInput],
            chatInput: ''
        }));
    
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
                default={{
                    x: this.props.position.x,
                    y: this.props.position.y,
                    width: this.props.size.width,
                    height: this.props.size.height,
                }}
                onDragStop={(_, data) => this.props.onDragStop({ x: data.x, y: data.y })}
                onResizeStop={(_, __, ref) => this.props.onResizeStop({ width: ref.offsetWidth, height: ref.offsetHeight })}
                style={{ zIndex: 1000 }}
            >
                <div className="ChatBox__card">
                    <div>
                        {this.state.conversation.map((message, index) => (
                            <div key={index} style={{ color: 'black', backgroundColor: 'white' }}>{message}</div>
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
                        style={{width: "100%", height: "100px"}}
                        />
                        <input type="submit" value="Send" style={{width: "100px"}}/>
                    </form>
                </div>
            </Rnd>
        );
    }
}