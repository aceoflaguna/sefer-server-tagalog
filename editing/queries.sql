
SELECT id, name
FROM TagAngBiblia_books;

SELECT id, book_id, chapter, verse, "text"
FROM TagAngBiblia_verses WHERE text like "%At kanilang didinggin ang iyong tinig: at ikaw ay paroroon, ikaw at%"

SELECT id, book_id, chapter, verse, "text"
FROM TagAngBiblia_verses WHERE text like "%ang panginoon%"

SELECT count(id)
FROM TagAngBiblia_verses WHERE text like "%panginoon%"


DELETE FROM TagAngBiblia_verses
WHERE id NOT IN (
    SELECT MIN(id)
    FROM TagAngBiblia_verses
    GROUP BY
        book_id,
        chapter,
        verse,
        text
);


DELETE FROM TagAngBiblia_verses
WHERE id=63802;

--check duplicates
SELECT
    book_id,
    chapter,
    verse,
    text,
    COUNT(*) AS total
FROM TagAngBiblia_verses
GROUP BY
    book_id,
    chapter,
    verse,
    text
HAVING COUNT(*) > 1;