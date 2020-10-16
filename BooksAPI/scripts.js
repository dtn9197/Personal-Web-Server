
// let data = "";
let apiKey = "ZaysgnG4cc5mDwUeGGhBTaEqC6Av7IKr";
// let author;
// let publisher;
// let ageGroup;


/**extract user's inputs and use them to query New York Times to get a list of books
 */
function getBooks() {
    removeBooks();

    let author = document.querySelector("#author").value;
    let ageGroup = document.querySelector("#age-group").value;
    let publisher = getPublisher();
    let queryString = `https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=${apiKey}&author=${author}&age-group=${ageGroup}&publisher=${publisher}`;
   
    const request = new XMLHttpRequest();
    request.open("GET", queryString);
    request.onload = function() {
        let data = JSON.parse(this.response);
        if(request.status === 200) {
            if(data.results.length === 0)
                window.alert("sorry, no books found");
            else
                loadTable(data);
        } else {
            console.log("Something went wrong");
        }
    }

    request.send();
}

/**remove the books from the table before a new query */
function removeBooks() {
    let bookTable = document.querySelector("#booksTable");
    let tableHeader = bookTable.querySelector("tbody");
    while(tableHeader.nextElementSibling)
        bookTable.removeChild(tableHeader.nextElementSibling);
}

/**loop through radio buttons to find the checked button and return its value */
function getPublisher() {
    let buttons = document.querySelectorAll(".radio");
    let value = "";
    buttons.forEach(function(button) {
        if(button.checked) {
            console.log(button.value);
            value = button.value;
        }  
    });
    return value;

}

/**load the table with books data after first API call, for brevity sake we will only populate 10 records */
function loadTable(data) {
    let books = [];
    for(let i = 0; i < 10; i++) {
       if(data.results[i]) {
           books.push(data.results[i]);
       }
    }
    //for each book in the list, create a new record and add them to the table
    books.forEach(function(book) {
        let bookTable = document.querySelector("#booksTable");
        let bookRow = document.createElement("tr");


        //this huge chunk creates individual table cells
        let isbn10 = document.createElement("td");
        if(book.isbns[0]) 
            isbn10.innerHTML = book.isbns[0].isbn10;
         else 
            isbn10.innerHTML = "";
        let title = document.createElement("td");
        title.innerHTML = book.title;
        let author = document.createElement("td");
        author.innerHTML = book.author;
        let ageGroup = document.createElement("td");
        ageGroup.innerHTML = book.age_group;
        let publisher = document.createElement("td");
        publisher.innerHTML = book.publisher;
        let description = document.createElement("td");
        description.innerHTML = book.description;
        let bookCover = document.createElement("td");
        let image = document.createElement("img");
        bookCover.appendChild(image);
        image.alt = "sorry, no image available for this book";
        //this method will load the image into the table
        loadBookImage(isbn10.textContent, image);
        
       

     
        //add cells into a row then add row to the table
        bookRow.appendChild(title);
        bookRow.appendChild(author);
        bookRow.appendChild(bookCover);
        bookRow.appendChild(isbn10);
        bookRow.appendChild(description);
        bookRow.appendChild(publisher);
        bookRow.appendChild(ageGroup);
        bookTable.appendChild(bookRow);

    })
}


/**Query OpenLibrary API to get a book's image and load it into the using an ISBN10 number gotten from New York Times API*/
function loadBookImage(isbn10, image) {
    let request = new XMLHttpRequest();
    let query = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn10}&format=JSON`;
    request.open("GET", query);
    request.onload = function() {
       let info = JSON.parse(this.response);
       let key = `ISBN:${isbn10}`;
       
       try {
            let book = info[key];
            let newURL = book.thumbnail_url.replace("S", "M");
            image.src = newURL;
       } catch(e) {
            console.log("no image found");
       }
       
    };
    request.send();

}




