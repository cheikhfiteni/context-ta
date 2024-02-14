import { Component } from 'react';
import { Rnd } from 'react-rnd';

// ...

interface State {
    compact: boolean;
    text: string;
    chatInput: string;
    conversation: string[];
    
}
  
interface Props {
    onConfirm: (comment: { text: string; emoji: string }) => void;
    onOpen: () => void;
    onUpdate?: () => void;
    selection?: string;
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

    handleChatSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.setState(prevState => ({
            conversation: [...prevState.conversation, this.state.chatInput],
            chatInput: ''
        }));
    }

    handleChatInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ chatInput: event.target.value });
    }

    render() {
        return (
            <Rnd
                default={{
                    x: this.props.position.x,
                    y: this.props.position.y,
                    width: this.props.size.width,
                    height: this.props.size.height,
                }}
            >
                <div className="ChatBox__card">
                    <div>
                        {this.state.conversation.map((message, index) => (
                            <div key={index} style={{ color: 'black', backgroundColor: 'white' }}>{message}</div>
                        ))}
                    </div>
                    <form onSubmit={this.handleChatSubmit}>
                        <input
                            type="text"
                            value={this.state.chatInput}
                            onChange={this.handleChatInputChange}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </Rnd>
        );
    }
}


render() {
  return (
    <Rnd
      default={{
        x: this.props.position.x,
        y: this.props.position.y,
        width: this.props.size.width,
        height: this.props.size.height,
      }}
    >
      {/* The chat box content goes here */}
    </Rnd>
  );
}