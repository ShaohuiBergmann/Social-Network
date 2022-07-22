import { useSelector } from "react-redux";
import { socket } from "./socket";
import { useEffect, useRef } from "react";

export default function Chat() {
    const messages = useSelector((state) => state.messages);
    const chatContainerRef = useRef();
    useEffect(() => {
        // console.log("chat just mounted");
        // console.log("chatContainerRef", chatContainerRef);
        // console.log("scrollTop", chatContainerRef.current.scrollTop);
        // console.log("clientHeight", chatContainerRef.current.clientHeight);
        // console.log("scrollHeight", chatContainerRef.current.scrollHeight);
        // on first mount and every time a new message gets added
        // we want to adjust our elements scrollTop to be the scrollHeight minus height
        // of the element, as that means we are scrolled to the bottom msg
        chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight -
            chatContainerRef.current.clientHeight;
    }, [messages]);

    const keyCheck = (e) => {
        console.log("key", e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("input field value", e.target.value);
            socket.emit("new-message", e.target.value);
            e.target.value = "";
        }
    };
    console.log("messages in chat ", messages);
    return (
        <>
            <section className="profile">
                <h3> We are Chatting</h3>
                <div className="chat-display-container" ref={chatContainerRef}>
                    {messages &&
                        messages.map((message) => {
                            return (
                                <p key={message.id}>
                                    {message.first} {message.last} says:
                                    {message.message}
                                </p>
                            );
                        })}
                </div>
                <textarea
                    onKeyDown={keyCheck}
                    placeholder="Come in, and start chatting"
                ></textarea>
            </section>
        </>
    );
}
