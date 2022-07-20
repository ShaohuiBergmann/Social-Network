import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        let abort = false;
        (async () => {
            try {
                const respBody = await fetch("/findusers/" + searchInput);
                const data = await respBody.json();
                console.log("data at find user", data);
                if (!abort) {
                    setUsers(data);
                } else {
                    console.log("ignore don't run a a state update");
                }
            } catch (err) {
                console.log("err at catching", err);
            }
        })();
        return () => {
            console.log("cleanup running");
            abort = true;
        };
    }, [searchInput]);

    return (
        <>
            <section className="profile">
                <h3>Find Other People</h3>
                <input
                    placeholder="Search"
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                    }}
                ></input>
                <ul>
                    {users?.map((users, i) => {
                        return (
                            <li key={i}>
                                <Link to={`user/${users.id}`}>
                                    <img
                                        src={users.img_url || "/default.jpg"}
                                    ></img>
                                    <h4>
                                        {users.first} {users.last}
                                    </h4>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </>
    );
}
