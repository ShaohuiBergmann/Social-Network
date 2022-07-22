
import { combineReducers } from "redux";
import friendsWannaBeReducer from "./Friends/slice";
import messageReducer from "./messages/slice";

const rootReducer = combineReducers({
    ///friends is the prop we defined in the global state
    friends: friendsWannaBeReducer,
    messages: messageReducer,
});

export default rootReducer;
