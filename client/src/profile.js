import ProfilePic from "./profilePic";
import Bio from "./bioEditor";

export default function Profile({ first, last, imageUrl, bio, setBioInApp }) {
    return (
        <section className="profile">
            <ProfilePic first={first} last={last} imageUrl={imageUrl} />
            <h2>First Name: {first}</h2>
            <h2>Last Name: {last}</h2>

            <Bio bio={bio} setBioInApp={(bio) => setBioInApp(bio)} />
        </section>
    );
}
