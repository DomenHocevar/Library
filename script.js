

const myLibrary = [];


function Book(name, pages, author, read, time) {
    this.name = name;
    this.pages = pages;
    this.author = author;
    this.read = read;
    this.time = time;
}

Book.prototype.toggleRead = function (params) {
    this.read = !this.read;
}

function addBookToLibrary() {

    const container = {};

    error = false;
    popupInputs.forEach(popupInput =>
    {
        console.log(popupInput);
        if (error) return;
        if (popupInput.type == "button") return;
        if (popupInput.type == "checkbox")
        {
            container[popupInput.dataset.variable] = popupInput.checked;
        } else
        {
            let res = popupInput.value;
            if (!res) {
                alert("The entry for " + popupInput.dataset.variable + " was left empty!");
                console.log("oj");
                error = true;
                return;
            }
            container[popupInput.dataset.variable] = popupInput.value;
        }
    })


    if (error) return;

    resetPopupForm();

    myLibrary.push(new Book(container.name, container.pages, container.author, container.read, (new Date()).getTime()));

    resetTable();
    turnOnOverview();
}

function turnOnOverview(params) {
    overview.style.display = "block";
    popupForm.style.display = "none";    
}

function turnOnPopupForm(params) {
    overview.style.display = "none";
    popupForm.style.display = "flex";
}

function removeBook(params) {

    const row = this.parentNode.parentNode.parentNode;
    console.log(myLibrary);
    console.log(row.getAttribute("data-index"));
    myLibrary.splice(row.getAttribute("data-index"), 1);
    console.log(myLibrary);
    
    resetTable();
}

function makeRow(book, ind) {

    function makeCellWithText(text) {
        const cell = document.createElement("td");
        cell.textContent = text;
        return cell;
    }

    const row = document.createElement("tr");
    row.dataset.index = ind;

    row.appendChild(makeCellWithText(book.name));

    row.appendChild(makeCellWithText(book.author));

    row.appendChild(makeCellWithText(book.pages));

    return row;
}

function resetTable(params) {
    table.querySelectorAll("table tbody > *").forEach(child =>
    {
        console.log("oj");
        console.log(child);
        if (child.dataset.index != undefined) child.remove();
    })

    for (let i = 0; i < myLibrary.length; i++) {
        const row = makeRow(myLibrary[i], i);
        console.log(row);
        table.querySelector("tbody").appendChild(row);
    }  
    
}

function resetPopupForm(params) {
    popupInputs.forEach(popupInput =>
    {
        
        if (popupInput.type == "button") return;
        if (popupInput.type == "checkbox")
        {
            popupInput.checked = false;
        } else
        {
            popupInput.value = ""
        }
    })
}



const addBookButton = document.querySelector("#addBookButton");
addBookButton.addEventListener("click", turnOnPopupForm);

const popupAddBookButton = document.querySelector("#popupAddBookButton");
popupAddBookButton.addEventListener("click", addBookToLibrary);

const overview = document.querySelector("#overview");

const popupForm = document.querySelector("#popupForm");

const removeButtons = document.querySelectorAll(".removeButton");
removeButtons.forEach(removeButton => removeButton.addEventListener("click", removeBook));

const popupInputs = document.querySelectorAll(".popupInput");
console.log(popupInputs);

const table = document.querySelector("table");

resetTable();

