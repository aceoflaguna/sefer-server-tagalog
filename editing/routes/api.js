const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const router = express.Router();

const db = new sqlite3.Database("../sqlite/TagAngBiblia.db");

router.get("/books", (req, res) => {

    db.all(
        "SELECT id,name FROM TagAngBiblia_books WHERE id < 40 ORDER BY id",
        [],
        (err, rows) => {

            if (err)
                return res.status(500).json(err);

            res.json(rows);

        });

});

router.get("/search", (req, res) => {

    const keyword = req.query.keyword || "";
    const book = req.query.book || "all";

    let sql = `
    SELECT
        v.id,
        b.name book,
        v.chapter,
        v.verse,
        v.text
    FROM TagAngBiblia_verses v
    JOIN TagAngBiblia_books b
        ON b.id=v.book_id
    WHERE v.text LIKE ?
    AND v.book_id < 40
    `;

    const params = [`%${keyword}%`];

    if (book !== "all") {
        sql += " AND book_id=?";
        params.push(book);
    }

    sql += `
    ORDER BY
        book_id,
        chapter,
        verse
    LIMIT 500
    `;

    db.all(sql, params, (err, rows) => {

        if (err)
            return res.status(500).json(err);

        res.json(rows);

    });

});

router.post("/save", (req, res) => {

    db.run(
        `
        UPDATE TagAngBiblia_verses
        SET text=?
        WHERE id=?
        `,
        [req.body.text, req.body.id],
        function(err){

            if(err)
                return res.status(500).json(err);

            res.json({
                success:true
            });

        });

});

module.exports = router;