const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY created_at DESC LIMIT 4;`);
}; // 

module.exports.uploadImage = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4) RETURNING id, url, username, title, description `,
        [url, username, title, description]
    );
};

module.exports.showMoreImages = () => {
    return db.query(
        `
            SELECT *, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
            ) AS "lowestId" FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 4;`,
    );
}; 
