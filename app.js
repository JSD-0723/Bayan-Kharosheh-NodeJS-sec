const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Use a Custom Template Engine (Pug)
app.set("view engine", "pug");

// Set the Views Directory to the "dist" folder
app.set("views", path.resolve(__dirname, "dist"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/books", (req, res) => {
  const books = getBooks();
  res.render("books", { books });
});

app.get("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = getBookById(id);
  if (!book) {
    return res.status(404).send("Book not found");
  }
  res.render("book", { book });
});

app.post("/books", (req, res) => {
  const { id, name } = req.body;
  console.log(id, name);
  if (!id || !name) {
    return res.status(400).send("Invalid request");
  }
  const books = getBooks();
  addBook([...books, { id: Number(id), name: name }]);
  res.render("books", { books });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

const getBooks = () => {
  try {
    const data = fs.readFileSync("books.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const getBookById = (id) => {
  const books = getBooks();
  return books.find((book) => book.id === id);
};

function addBook(books) {
  fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
}