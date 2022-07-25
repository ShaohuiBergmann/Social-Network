export default function messageReducer(messages = [], action) {
    if (action.type == "messages/received") {
        messages = action.payload.messages;
    }

    if (action.type == "messages/added") {
        messages = [ action.payload.messages, ...messages];
    }
    return messages;
}

export function messagesReceived(messages) {
    return {
        type: "messages/received",
        payload: { messages },
    };
}

export function addNewMessages(messages) {
    return {
        type: "messages/added",
        payload: { messages },
    };
}
