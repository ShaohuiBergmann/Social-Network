const spicedPg = require("spiced-pg");
const database = "socialnetwork";
const username = "postgres";

const password = "postgres";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);

module.exports.registerUser = (first, last, email, passwd) => {
    const q = `INSERT INTO users (first, last, email, passwd)
            VALUES ($1, $2, $3, $4)
        RETURNING id`;
    const param = [first, last, email, passwd];
    return db.query(q, param);
};

module.exports.findUser = (email) => {
    const q = `SELECT * FROM users 
    WHERE email = $1;`;
    const param = [email];
    return db.query(q, param);
};

module.exports.insertCode = (email, code) => {
    const q = `INSERT INTO reset_codes (email, code)
            VALUES ($1, $2);
        `;
    const param = [email, code];
    return db.query(q, param);
};

module.exports.getCode = (email) => {
    return db.query(
        `SELECT *
        FROM reset_codes
        WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'
        AND email=$1
        ORDER BY id DESC
        LIMIT 1;`,
        [email]
    );
};

module.exports.resetPassword = (email, password) => {
    return db.query(
        `UPDATE users
    SET passwd = $2
    WHERE email = $1; `,
        [email, password]
    );
};

module.exports.getUserInfo = (id) => {
    return db.query(
        `SELECT * FROM users 
    WHERE id = $1;`,
        [id]
    );
};

module.exports.updateImg = (imageUrl, id) => {
    return db.query(
        `UPDATE users
    SET img_url = $1
    WHERE id = $2
    RETURNING img_url;`,
        [imageUrl, id]
    );
};

module.exports.updateBio = (id, bio) => {
    return db.query(
        `UPDATE users
    SET bio = $2
    WHERE id = $1 
    RETURNING bio;`,
        [id, bio]
    );
};

module.exports.getRecentUsers = () => {
    return db.query(`
    SELECT * FROM users
     ORDER BY id DESC
    LIMIT 3;`);
};

module.exports.searchUsers = (val) => {
    return db.query(
        `SELECT * 
        FROM users
        WHERE first ILIKE $1
        OR last ILIKE $1
        LIMIT 3;`,
        [val + "%"]
    );
};

module.exports.checkFriendship = (id, otherId) => {
    return db.query(
        `SELECT * FROM friendships 
        WHERE (recipient_id = $1 AND sender_id = $2) 
        OR (recipient_id = $2 AND sender_id = $1);`,
        [id, otherId]
    );
};

module.exports.addFriendship = (id, otherId) => {
    return db.query(
        `INSERT INTO friendships (sender_id, recipient_id)
        VALUES ( $1, $2);
        `,
        [id, otherId]
    );
};

module.exports.acceptFriendship = (id, otherId) => {
    return db.query(
        `UPDATE friendships
    SET accepted = true
    WHERE (recipient_id = $1 AND sender_id = $2) 
    ;`,
        [id, otherId]
    );
};

module.exports.deleteFriendship = (id, otherId) => {
    return db.query(
        `DELETE FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2) 
        OR (recipient_id = $2 AND sender_id = $1);`,
        [id, otherId]
    );
};

module.exports.getFriendsAndWannabes = (id) => {
    return db.query(
        `SELECT users.id, users.first, users.last, users.img_url, friendships.accepted
FROM friendships
JOIN users
ON (accepted = false AND recipient_id = $1 AND sender_id  = users.id)
OR (accepted = true AND recipient_id = $1 AND sender_id  = users.id)
OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
;`,
        [id]
    );
};

module.exports.addChats = (id, message) => {
    return db.query(
        `INSERT INTO chats (sender_id, message)
        VALUES ($1, $2)
        RETURNING *;`,
        [id, message]
    );
};

module.exports.receiveChats = () => {
    return db.query(
        `SELECT chats.id, chats.sender_id, chats.message, chats.timestamp, users.first, users.last, users.img_url
        FROM chats 
        LEFT JOIN users ON sender_id = users.id
        ORDER BY chats.id DESC
        LIMIT 10;`
    );
};
