const bookshelf = [];
const RENDER_EVENT = "render-bookshelf";

document.addEventListener("DOMContentLoaded", function () {
  const submitBook = document.getElementById("inputBook");
  submitBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadStorageData();
  }
});

function generateId() {
  return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isCompleted,
  };
}

const SAVED_BOOK = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser does not support local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_BOOK, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadStorageData() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (data !== null) {
    for (const book of data) {
      bookshelf.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const id = generateId();
  const title = document.getElementById("inputTitle").value;
  const author = document.getElementById("inputAuthor").value;
  const year = document.getElementById("inputYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;

  const bookObject = generateTodoObject(id, title, author, parseInt(year), isCompleted);
  bookshelf.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(RENDER_EVENT, function () {
  const unfinishedBookshelf = document.getElementById("incompleteBookshelfList");
  unfinishedBookshelf.innerHTML = "";

  const finishedBookshelf = document.getElementById("completeBookshelfList");
  finishedBookshelf.innerHTML = "";

  for (const book of bookshelf) {
    const bookItem = makeBook(book);

    if (!book.isCompleted) unfinishedBookshelf.append(bookItem);
    else finishedBookshelf.append(bookItem);
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement("p");
  textYear.innerHTML = bookObject.year;

  const bookContainer = document.createElement("div");
  bookContainer.classList.add("book_item");

  bookContainer.append(textTitle, textAuthor, textYear);

  const buttonAction = document.createElement("div");
  buttonAction.classList.add("action");

  if (bookObject.isCompleted) {
    const finishedBook = document.createElement("button");
    finishedBook.classList.add("green");
    finishedBook.innerHTML = "Unfinished";

    finishedBook.addEventListener("click", function () {
      addBookToUnfinished(bookObject.id);
    });

    buttonAction.append(finishedBook);
  } else {
    const unfinishedBook = document.createElement("button");
    unfinishedBook.classList.add("green");
    unfinishedBook.innerHTML = "Finieshed";

    unfinishedBook.addEventListener("click", function () {
      addBookToFinished(bookObject.id);
    });

    buttonAction.append(unfinishedBook);
  }

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  deleteButton.classList.add("red");
  deleteButton.addEventListener("click", function () {
    if (confirm("Are you sure?")) {
      deleteBook(bookObject.id);
    }
  });
  buttonAction.append(deleteButton);

  bookContainer.append(buttonAction);

  return bookContainer;
}

function addBookToFinished(idBook) {
  const book = findBook(idBook);

  if (book === null) return;

  book.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToUnfinished(idBook) {
  const book = findBook(idBook);

  if (book === null) return;

  book.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(idBook) {
  const bookIndex = findBook(idBook);

  if (bookIndex === -1) return;

  bookshelf.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(idBook) {
  for (const book of bookshelf) {
    if (book.id === idBook) return book;
  }
  return -1;
}

function saveData() {
  const parsed = JSON.stringify(bookshelf);
  localStorage.setItem("BOOKSHELF_APPS", parsed);
  document.dispatchEvent(new Event(SAVED_BOOK));
}
