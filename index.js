const {initializeDatabase} = require("./db/db.connect")
const express = require("express")

const Books = require("./models/books.models")

const app = express();

app.use(express.json())

const cors = require("cors");
app.use(cors());

initializeDatabase();

// create or add new book

app.post("/books", async (req, res) => {
    try{
    const newBookData = req.body
    if(!newBookData.title || !newBookData.author || !newBookData.publishedYear || !newBookData.genre || !newBookData.country){
        res.status(400).json({error: "Title, author, published year, genre, country are required."})
    }
    else{
        const newBook = new Books(newBookData)
        await newBook.save();
        res.status(201).json({message: "Book created successfully."})
    }
}catch(error){
    res.status(500).json({error: "An error occured while creating book Object."})
}

})

// Read all books

async function readAllBooks(){
    try{
        const books = await Books.find()
        return books
    }
    catch(error){
        console.log(error)
    }
}

app.get("/books", async (req, res) =>{
    try{
        const books = await readAllBooks();
        if(books.length !=0){
            res.json(books)
        }else{
            res.status(400).json({error: "Books not found."})
        }
    }
    catch(error){
        res.status(500).json({error: "An error while reading books."})
    }
})


// read book by title

async function readBookByTitle(bookTitle){
    try{
        const book = await Books.findOne({title: bookTitle})
        return book
    }
    catch(error){
        console.log(error)
    }
}

app.get("/books/:bookTitle", async (req, res) => {
    try{
        const book = await readBookByTitle(req.params.bookTitle)
        if(book){
            res.json(book)
        }else{
            res.json(404).json({error: "Book not found"})
        }
    }
    catch(error){
        res.status(500).json({error: "An error occured while fetching book data."})
    }
})

const PORT=3000

app.listen(PORT, () => {
    console.log("Successfully connected to port", PORT)
})

// read all books by author

async function readBooksByAuthor(authorName){
    try{
        const books = await Books.find({author: authorName})
        return books
    }
    catch(error){console.log(error)}
}

app.get("/books/author/:authorName", async(req, res) => {
    try{
        const books = await readBooksByAuthor(req.params.authorName)
        if(books.length != 0){
            res.json(books)
        }
        else{
            res.status(404).json({error: "Books not found"})
        }
    }
    catch(error){
        res.status(500).json({error: "An error occured while fetching data"})
        
    }
})

// read books by genre

async function readBooksByGenre(bookGenre){
        try{
            const books = await Books.find({genre: bookGenre})
            return books
        }
        catch(error){console.log(error)}
}

app.get("/books/genre/:bookGenre", async(req, res) => {
    try{
        const books = await readBooksByGenre(req.params.bookGenre)
        if(books.length != 0){
            res.json(books)
        }
        else{
            res.status(404).json({error: "Books not found."})
        }
    }
    catch(error){
        res.status(500).json({error: "An error occured while fetching data."})
    }
})


// read books by released Year

async function readBooksByReleasedYear(year){
    try{
        const books = await Books.find({publishedYear: year})
        return books
    }
    catch(error){
        console.log(error)
    }
}

app.get("/books/publishedyear/:year", async(req, res) => {
    try{
        const books = await readBooksByReleasedYear(parseInt(req.params.year))
        if(books.length != 0){
            res.json(books)
        }else{
            res.status(404).json({error: "Books not found."})
        }
    }
    catch(error){
        res.status(500).json({error: "An error occured while fetching data."})
    }
})


//update books rating

async function updateBookRating(bookId, dataToUpdate){
    try{
        const updatedBook = await Books.findByIdAndUpdate(bookId, dataToUpdate, {new: true})
        return updatedBook
    }
    catch(error){console.log(error)}
}

app.post("/books/:bookId", async(req, res) => {
    try{
        const updatedBook = await updateBookRating(req.params.bookId, req.body)
        if (!updatedBook){
            res.status(404).json({error: "Book not found"})
        }
        else{
            res.status(200).json({message: "Book updated successfully", updatedBook: updatedBook})
        }
    }
    catch(error){
        res.json(500).json({error: "An error occured while updating data."})
    }
})


// update book by rating

async function updateBookDataByTitle(bookTitle, dataToUpdate){
    try{
        const updatedBook = await Books.findOneAndUpdate({title: bookTitle}, dataToUpdate, {new: true})
        return updatedBook
    }
    catch(error){console.log(error)}
}

app.post("/books/title/:bookTitle", async (req, res) => {
    try{
        const updatedBook = await updateBookDataByTitle(req.params.bookTitle, req.body, {new: true})
        if (!updatedBook){
            res.status(404).json({error: "No book found."})
        }
        else{
            res.status(200).json({message: "Book updated successfully", updatedBook: updatedBook})
        }
    }
    catch(error){
        res.status(500).json({error: "An error occured while updating data."})
    }
})

//delete a book by book Id

async function deleteBookById(bookId){
    try{
        const deletedBook = await Books.findByIdAndDelete(bookId)
        return deletedBook
    }
    catch(error){console.log(error)}
}

app.delete("/books/:bookId", async (req, res) => {
    try{
        const deletedBook = await deleteBookById(req.params.bookId)
        if(!deletedBook){
            res.status(404).json({error: "Book not found"})
        }else{
            res.status(200).json({message: "Book deleted successfully"})
        }
    }
    catch(error){
        res.status(500).json({error: "An error occured while deleting data."})
    }

})