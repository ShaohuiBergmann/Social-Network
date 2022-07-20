//// a mini/sub-reducer that handles change in global state

export default function friendsWannaBeReducer(friends = [], action) {
    //friends is a property inside glaobal state, we're using default params here
    if (action.type === "/friends-wannabees/accept") {
        
        const newFriendsWannabes = friends.map((friend) => {
            if (friend.id == action.payload.id) {
                return {
                    ...friend,
                    accepted: true,
                };
            } else {
                return friend;
            }
        });
        return newFriendsWannabes;
    }

    if (action.type == "/friends-wannabees/received") {
        friends = action.payload.friends;
    }

    if (action.type == "/friends-wannabees/unfriend") {
        friends = friends.filter((friend) => {
            if (friend.id != action.payload.id) {
                return friend;
            }
        });
    }
    return friends;
}

export function makeFriend(id) {
    return {
        type: "/friends-wannabees/accept",
        payload: { id },
    };
}

export function receivedFriend(friends) {
    return {
        type: "/friends-wannabees/received",
        payload: { friends },
    };
}

export function makeUnfriend(id) {
    return {
        type: "/friends-wannabees/unfriend",
        payload: { id },
    };
}
