// array to store books for now
let books = [
  {id: 1, title: "The Alchemist", price: 25},
  {id: 2, title: "The Power of Now", price: 30}
];

// GET books
export const getAllBooks = (req, res) =>{
  res.status(200).json(books);
}

// GET book/:id

export const getBookById = (req, res) =>{
  const book = books.find(b => b.id === Number(req.params.id));

  if(!book){
    return res.status(400).json({message: "Book not found!"});
  }

  res.status(200).json(book);
};

// POST books
export const createBook = (req, res) =>{

  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    price: req.body.price,
  };

  books.push(newBook);

  res.status(201).json(newBook);
};