import { Component } from "react";
import Logo from "./logo";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import FindPeople from "./findPeople";
import OtherProfile from "./otherProfile";
import FriendsAndWannaBe from "./friends-wannabe";
import Chat from "./chat";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            imageUrl: "",
            uploaderIsVisible: false,
            findPeopleIsVisibile: false,
            bio: "",
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
                    bio: data.bio,
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

    setBioInApp(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    render() {
        return (
            <div className="loggedIn">
                <BrowserRouter>
                    <div className="logoContainer">
                        <Logo />
                        <h2>Good to See You! {this.state.first} </h2>

                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.imageUrl}
                            toggleModal={() => this.toggleModal()}
                        />
                    </div>
                    <nav>
                        <Link to="/find">Find People</Link>
                        <Link to="/" className="myProfile">
                            My Profile
                        </Link>
                        <Link to="/friends">Friends</Link>
                        <Link to="/chat">My Chat</Link>
                    </nav>

                    <Switch>
                        <Route exact path="/">
                            {this.state.uploaderIsVisible && (
                                <Uploader
                                    handleSubmitInApp={(url) =>
                                        this.handleSubmitInApp(url)
                                    }
                                />
                            )}

                            {!this.state.uploaderIsVisible && (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    imageUrl={this.state.imageUrl}
                                    bio={this.state.bio}
                                    setBioInApp={(bio) => this.setBioInApp(bio)}
                                />
                            )}
                        </Route>
                        <Route path="/find">
                            <FindPeople />
                        </Route>
                        <Route path="/user/:otherUserId">
                            <OtherProfile />
                        </Route>
                        <Route path="/friends">
                            <FriendsAndWannaBe />
                        </Route>
                        <Route path="/chat">
                            <Chat />
                        </Route>
                    </Switch>
                </BrowserRouter>
                <footer>
                    <button>
                        <a href="/logout" className="links">
                            Log out
                        </a>
                    </button>
                </footer>
            </div>
        );
    }
}
