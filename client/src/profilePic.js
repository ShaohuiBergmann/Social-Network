export default function ProfilePic({ first, last, imageUrl, toggleModal }) {
    // console.log("info being passed down from App: ", imageUrl);
    imageUrl = imageUrl || "/default.jpg";

    return (
        <>
            <img className="profile-pic" src={imageUrl} alt={first+last} onClick={() =>toggleModal()}/>
        </>
    );
}
