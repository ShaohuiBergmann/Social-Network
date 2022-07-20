import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    makeFriend,
    receivedFriend,
    makeUnfriend,
} from "./redux/Friends/slice";

export default function FriendsAndWannaBe() {
    const dispatch = useDispatch();
    const wannabes = useSelector((state) => {
        return state.friends.filter((friend) => !friend.accepted);
    });
    const friends = useSelector((state) => {
        return state.friends.filter((friend) => friend.accepted);
    });

    useEffect(() => {
        fetch("/friends-wannabes")
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data at f&b", data);
                dispatch(receivedFriend(data));
            })
            .catch((err) =>
                console.log("err at getting all friends&wannabes", err)
            );
    }, []);

    const handleAccept = (id) => {
        fetch("/accept-friend/" + id, {
            method: "POST",
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    dispatch(makeFriend(id));
                }
            })
            .catch((err) => console.log("err at accepting", err));
    };

    const handleUnfriend = (id) => {
        fetch("/unfriend/" + id, {
            method: "POST",
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    dispatch(makeUnfriend(id));
                }
            })
            .catch((err) => console.log("err at unfriend", err));
    };

    return (
        <section className="fandb">
            <h1>Friends </h1>
            <div className="friendsContainer">
                {friends
                    ? friends.map((friend) => {
                          return (
                              <div key={friend.id} className="friends">
                                  <img src={friend.img_url || "default.jpg"} />
                                  <button
                                      key={friend.id}
                                      onClick={() => handleUnfriend(friend.id)}
                                  >
                                      Unfriend
                                  </button>
                              </div>
                          );
                      })
                    : "Sorry, you have no more friends"}
            </div>

            <h1>Wannabes</h1>
            <div className="friendsContainer">
                {wannabes
                    ? wannabes.map((wannabe) => {
                          return (
                              <div key={wannabe.id} className="wannabes">
                                  <img src={wannabe.img_url || "default.jpg"} />
                                  <button
                                      key={wannabe.id}
                                      onClick={() => handleAccept(wannabe.id)}
                                  >
                                      Accept Friendship
                                  </button>
                              </div>
                          );
                      })
                    : "You have no new friends request"}
            </div>
        </section>
    );
}
