import { useState, useEffect } from "react";

export default function FriendButton(props) {
    const { otherUserId } = props;
    const [buttonText, setButtonText] = useState(null);
    const [endPoint, setEndPoint] = useState("");
    useEffect(() => {
        (async () => {
            try {
                const respBody = await fetch("/friendship/" + otherUserId);
                const data = await respBody.json();
                console.log("data at friendshipp", data);
                if (data.friendship == false) {
                    setButtonText("Add Friend");
                    setEndPoint("add");
                } else if (data.accepted) {
                    setButtonText("End Friendship");
                    setEndPoint("end");
                } else if (!data.accepted && data.sender_id == otherUserId) {
                    setButtonText("Accept Friend Request");
                    setEndPoint("accept");
                } else {
                    setButtonText("Cancel Request");
                    setEndPoint("cancel");
                }
            } catch (err) {
                console.log("err at catching", err);
            }
        })();
    }, []);

    const handleButton = (previousButtonText) => {
        console.log("button is being handling");
        const currentButtonText =
            (previousButtonText === "Add Friend" && "Cancel Request") ||
            (previousButtonText === "End Friendship" && "Add Friend") ||
            (previousButtonText === "Cancel Request" && "Add Friend") ||
            (previousButtonText === "Accept Friend Request" &&
                "End Friendship");
        fetch("/friendship/" + otherUserId + "/" + endPoint, {
            method: "POST",
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data at adding", data);
                if (data.success) {
                    setButtonText(currentButtonText);
                }
            })
            .catch((err) => console.log("err in hndle button", err));
    };
    console.log("friend id", props);
    return (
        <button
            onClick={() => {
                handleButton(buttonText);
            }}
        >
            {buttonText}
        </button>
    );
}
