
import { combineReducers } from "redux";
import friendsWannaBeReducer from "./Friends/slice";

const rootReducer = combineReducers({
    ///friends is the prop we defined in the global state
    friends: friendsWannaBeReducer,
});

export default rootReducer;
