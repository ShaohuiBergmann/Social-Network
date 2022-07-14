import { Component } from "react";
import { Link } from "react-router-dom";

export default class Registration extends Component {
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
        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from /register", data);
                if (data.success) {
                    location.reload();
                } else {
                    this.setState({
                        error: true,
                    });
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
                <h1>Register</h1>
                {this.state.error && (
                    <p>Something is wrong, please try again again</p>
                )}
                <label className="info">
                    <span className="label-text">First Name</span>
                    <input
                        type="text"
                        name="first"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                </label>
                <label className="info">
                    <span className="label-text">Last Name</span>
                    <input
                        type="text"
                        name="last"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                </label>
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
                <div className="text-center">
                    <button
                        className="submit"
                        onClick={() => this.handleSubmit()}
                    >
                        Register
                    </button>
                </div>
                <Link to="/login" className="links">Already a member? Log in</Link>
            </div>
        );
    }
}
