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
