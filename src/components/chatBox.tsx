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
    compact: boolean;
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
            compact: false,
            text: '',
            chatInput: '',
            conversation: [],
        };
    }

    handleChatInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ chatInput: event.target.value });
    }

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
                    <form onSubmit={this.handleChatSubmit}>
                        <textarea
                        placeholder="Type your message and press Enter"
                        autoFocus
                        value={this.state.chatInput}
                        onChange={this.handleChatInputChange}
                        />
                        <input type="submit" value="Send" />
                    </form>
                </div>
            </Rnd>
        );
    }
}