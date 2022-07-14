import { Link } from "react-router-dom";
import { Component } from "react";
export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleChange(e) {
        console.log(e.target.value);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state", this.state)
        );
    }

    handleSubmit() {
        console.log("submitting");
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from post/login", data);
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    location.reload();
                }
            })
            .catch((err) => {
                console.log("err at handling submit", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div className="container">
                <h1>Log in</h1>
                {this.state.error && (
                    <p>Something is wrong, please try again</p>
                )}
                <label className="info">
                    <span className="label-text">Email</span>
                    <input
                        type="email"
                        name="email"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                </label>
                <label className="password">
                    <span className="label-text">Password</span>
                    <input
                        type="password"
                        name="pwd"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                </label>
                <div className="login">
                    <button
                        className="submit"
                        onClick={() => this.handleSubmit()}
                    >
                        Log in
                    </button>

                    <Link to="/reset" className="links">
                        Forget Password? Click here to reset!
                    </Link>

                    <Link to="/" className="links">
                        Not a member? Click here to register!
                    </Link>
                </div>
            </div>
        );
    }
}
