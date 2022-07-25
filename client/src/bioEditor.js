import { Component } from "react";
export default class Bio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTextArea: false,
            draftBio: "",
        };
    }

    handleChange(e) {
        console.log(e.target.value);
        this.setState(
            {
                draftBio: e.target.value,
            },
            () => console.log("this.state", this.state)
        );
    }

    addBio() {
        this.setState({
            draftBio: this.props.bio,
        });
    }

    toggleBioEditor() {
        this.setState({
            showTextArea: !this.state.showTextArea,
        });
    }

    saveBio() {
        fetch("/add/bio", {
            method: "POST",
            body: JSON.stringify({
                bio: this.state.draftBio,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                this.props.setBioInApp(data.bio);
            })
            .catch((err) => console.log("err at /add/bio", err));

        this.setState({
            showTextArea: false,
        });
    }

    render() {
        return (
            <>
                {(this.state.showTextArea && (
                    <section className="bioInput">
                        <textarea
                            name="bio"
                            rows="6"
                            cols="48"
                            defaultValue={this.props.bio}
                            onChange={(e) => this.handleChange(e)}
                        ></textarea>
                        <button
                            className="saveBio"
                            onClick={() => this.saveBio()}
                        >
                            Save Bio
                        </button>
                    </section>
                )) ||
                    (this.props.bio && (
                        <section className="bioInput">
                            <h2>Bio: {this.props.bio}</h2>
                            <button
                                className="submit"
                                onClick={() => {
                                    this.toggleBioEditor();
                                    this.addBio();
                                }}
                            >
                                Edit Bio
                            </button>
                        </section>
                    )) || (
                        <section className="bioInput">
                            <button
                                onClick={() => {
                                    this.toggleBioEditor();
                                }}
                            >
                                Add Bio
                            </button>
                        </section>
                    )}
            </>
        );
    }
}
