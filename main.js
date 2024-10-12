// Do your work here...
console.log("Hello, world!");

const STORAGE_KEY = "BOOKSHELF_APP";
let books = [];

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const bookForm = document.getElementById("bookForm");
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBooks();
  });
});

// Cek apakah localStorage tersedia
function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

// Simpan data buku ke localStorage
function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
}

// Muat data buku dari localStorage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData !== null) {
    books = JSON.parse(serializedData);
  }
  document.dispatchEvent(new Event("render-books"));
}

// Tambahkan buku baru
function addBook() {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = parseInt(document.getElementById("bookFormYear").value); // Ubah ke number
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const bookId = generateId();
  const bookObject = createBookObject(bookId, bookTitle, bookAuthor, bookYear, isComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event("render-books"));
  saveData();
}

// Buat objek buku
function createBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: Number(year), // Pastikan year adalah tipe number
    isComplete,
  };
}

// Generate ID unik untuk buku
function generateId() {
  return +new Date();
}

// Pindahkan buku antar rak
function toggleBookStatus(bookId) {
  const book = findBook(bookId);
  if (book === null) return;

  book.isComplete = !book.isComplete;
  document.dispatchEvent(new Event("render-books"));
  saveData();
}

// Hapus buku
function removeBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;

  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event("render-books"));
  saveData();
}

// Edit buku
function editBook(bookId) {
  const book = findBook(bookId);
  if (book == null) return;

  const newTitle = prompt("Masukkan judul baru:", book.title);
  const newAuthor = prompt("Masukkan penulis baru:", book.author);
  const newYear = prompt("Masukkan tahun baru:", book.year);

  if (newTitle && newAuthor && newYear) {
    book.title = newTitle;
    book.author = newAuthor;
    book.year = Number(newYear); // Pastikan year adalah tipe number

    document.dispatchEvent(new Event("render-books"));
    saveData();
  }
}

// Cari buku berdasarkan judul
function searchBooks() {
  const searchInput = document.getElementById("searchBookTitle").value.toLowerCase();
  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchInput));

  displayBooks(filteredBooks);
}

// Fungsi temukan buku berdasarkan ID
function findBook(bookId) {
  return books.find((book) => book.id === bookId);
}

// Fungsi temukan index buku berdasarkan ID
function findBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId);
}

// Render ulang daftar buku
document.addEventListener("render-books", function () {
  displayBooks(books);
});

// Tampilkan buku dalam rak
function displayBooks(bookList) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of bookList) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
}

// Buat elemen buku
function createBookElement(book) {
  const container = document.createElement("div");
  container.setAttribute("data-bookid", book.id);
  container.setAttribute("data-testid", "bookItem");

  const bookTitle = document.createElement("h3");
  bookTitle.innerText = book.title;
  bookTitle.setAttribute("data-testid", "bookItemTitle");

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${book.author}`;
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${book.year}`;
  bookYear.setAttribute("data-testid", "bookItemYear");

  const actionContainer = document.createElement("div");

  const toggleButton = document.createElement("button");
  toggleButton.innerText = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleButton.addEventListener("click", function () {
    toggleBookStatus(book.id);
  });

  const editButton = document.createElement("button");
  editButton.innerText = "Edit Buku";
  editButton.addEventListener("click", function () {
    editBook(book.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus Buku";
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.addEventListener("click", function () {
    removeBook(book.id);
  });

  actionContainer.append(toggleButton, editButton, deleteButton);

  container.append(bookTitle, bookAuthor, bookYear, actionContainer);
  return container;
}
