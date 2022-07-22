import { io } from "socket.io-client";
export let socket;
import { messagesReceived, addNewMessages } from "./redux/messages/slice";
export const init = (store) => {
    if (!socket) {
        //only establish a socket once
        socket = io.connect();
    }
    socket.on("last-10-messages", (msgs) => {
        console.log("last -10-msgs", msgs);
        store.dispatch(messagesReceived(msgs.messages));
    });

    socket.on("add-new-message", (msgs) => {
        console.log("server just emitted a new msg to add", msgs);
        // time to dispatch an ection message/addNew would be a good one
        // pass to action the object containing the message, and the user info
        // of the author
        store.dispatch(addNewMessages(msgs));
    });
};
