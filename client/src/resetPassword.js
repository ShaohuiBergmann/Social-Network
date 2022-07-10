import { Component } from "react";
import { Link } from "react-router-dom";

export default class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            view: 1,
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

    resetStart() {
        console.log("submitting");
        fetch("/password/reset/start ", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from post/start", data);
                if (data.success) {
                    this.setState({ view: 2 });
                } else {
                    this.setState({ error: true });
                }
            })
            .catch((err) => {
                console.log("err at handling submit /reset", err);
                this.setState({
                    error: true,
                });
            });
    }

    resetVerify() {
        fetch("/password/reset/verify ", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from post/verify", data);
                if (data.success) {
                    this.setState({ view: 3 });
                } else {
                    this.setState({ error: true });
                }
            })
            .catch((err) => {
                console.log("err at handling submit /reset", err);
                this.setState({
                    error: true,
                });
            });
    }

    determineViewToRender() {
        // this method determines what the render!
        if (this.state.view === 1) {
            return (
                <div className="container">
                    {this.state.error && (
                        <p>Something is wrong, please try again again</p>
                    )}
                    <label className="info">
                        <span className="label-text">Email</span>
                        <input
                            type="email"
                            name="email"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                    </label>
                    <button
                        className="submit"
                        onClick={() => this.resetStart()}
                    >
                        Submit
                    </button>
                </div>
            );
        } else if (this.state.view === 2) {
            return (
                <div className="container">
                    {this.state.error && (
                        <p>Something is wrong, please try again again</p>
                    )}
                    <label className="info">
                        <span className="label-text">Verification Code</span>
                        <input
                            type="text"
                            name="code"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                    </label>
                    <label className="info">
                        <span className="label-text">New Password</span>
                        <input
                            type="password"
                            name="newPwd"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                    </label>
                    <button
                        className="submit"
                        onClick={() => this.resetVerify()}
                    >
                        Reset
                    </button>
                </div>
            );
        } else if (this.state.view === 3) {
            // remember to also add a link to login ;)
            return (
                <div className="container">
                    <h1>Password successfully Reset</h1>
                    <Link to="/login"> Log in Again</Link>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {/* call the method */}
                {this.determineViewToRender()}
            </div>
        );
    }
}
