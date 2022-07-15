import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";

export default function OtherProfile() {
    const [user, setUser] = useState({});
    const { otherUserId } = useParams();
    const history = useHistory();
    useEffect(() => {
        let abort = false;
        if (!abort) {
            (async () => {
                try {
                    const respBody = await fetch("/user/" + otherUserId);
                    const data = await respBody.json();
                    if (data.selfLoggedIn) {
                        history.push("/");
                    } else if (!abort) {
                        setUser(data);
                    } else {
                        console.log(
                            console.log("ignore don't run a a state update")
                        );
                    }
                } catch (err) {
                    console.log("err at getting other ptofile", err);
                }
            })();
        }
        return () => {
            abort = true;
        };
    }, []);
    return (
        <>
            <section className="otherProfile">
                {(user && (
                    <h1>
                        {user.first} {user.last}
                    </h1>
                )) || <h1>User Not Found</h1>}

                {user && (
                    <img src={user.img_url || "/default.jpg"} alt={`{user.first + user.last}`}/>    
                )}

                {(user && user.bio && (
                    <p>Bio: {user.bio}</p>
                )) || (
                    user && (
                        <p>No bio yet</p>
                    )
                )}
            </section>
        </>
    );
}
