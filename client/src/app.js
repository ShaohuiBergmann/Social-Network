import { Component } from "react";
import Logo from "./logo";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            imageUrl: "",
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        console.log("App mounted!");
        fetch("/user")
            .then((resp) => resp.json())
            .then((data) => {
                //console.log("user", data);
                this.setState({
                    first: data.first,
                    last: data.last,
                    imageUrl: data.img_url,
                });
            })
            .catch((err) => console.log("err at /user", err));
    }

    toggleModal() {
        // console.log("toggleModal fn is running!");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    handleSubmitInApp(imageUrl) {
        //console.log("imageurl", imageUrl)
        this.setState({
            imageUrl: imageUrl,
            uploaderIsVisible: false,
        });
    }

    render() {
        return (
            <div className="logoContainer">
                <Logo />
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                    toggleModal={() => this.toggleModal()}
                />
                <h2>Hi, {this.state.first}</h2>

                {this.state.uploaderIsVisible && (
                    <Uploader
                        handleSubmitInApp={(url) => this.handleSubmitInApp(url)}
                    />
                )}
                <button>
                    <a href="/logout">Log out</a>
                </button>
            </div>
        );
    }
}
