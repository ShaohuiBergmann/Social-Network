import { Component } from "react";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };

        // this.handleChange = this.handleChange.bind(this);
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
            <div>
                <h1>This is the registration component</h1>
                {this.state.error && (
                    <p>Something is wrong, please try again again</p>
                )}
                <input
                    type="text"
                    name="first"
                    placeholder="firstname"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <input
                    type="text"
                    name="last"
                    placeholder="lasttname"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <input
                    type="email"
                    name="email"
                    placeholder="email"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <input
                    type="password"
                    name="pwd"
                    placeholder="password"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <button type="submit" onClick={() => this.handleSubmit()}>
                    Submit
                </button>
            </div>
        );
    }
}
