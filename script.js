
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj));
}
Storage.prototype.getObj = function(key) {
    if (this.getItem(key) == null) return null;
    return JSON.parse(this.getItem(key));
}

let myLibrary = [];

if (localStorage.getObj("myLibrary"))
{
    myLibrary = localStorage.getObj("myLibrary");
}



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
                error = true;
                return;
            }
            if (popupInput.type == "number" && !isPositiveInteger(res))
            {
                alert("The entry for pages" + " must contain a positive integer!");
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

function isPositiveInteger(str) {
    let n = Math.floor(Number(str));
    return String(n) === str && n > 0;
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
    myLibrary.splice(this.dataset.bookIndex, 1);
    

    resetTable();
}


function checkReadStatus(params) {
    const row = this.parentNode.parentNode.parentNode;
    myLibrary[row.dataset.index].read = this.checked;
    
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

    const checkboxCell  = document.createElement("td");
    const centerDiv = document.createElement("div");
    centerDiv.classList.add("centerItemsInContainer");
    const checkbox = document.createElement("input");
    checkbox.checked = book.read;
    checkbox.type = "checkbox";
    checkboxCell.appendChild(centerDiv);
    centerDiv.appendChild(checkbox);
    row.appendChild(checkboxCell);
    checkbox.addEventListener("input", checkReadStatus);

    const removeCell = document.createElement("td");
    const centerDiv2 = document.createElement("div");
    centerDiv2.classList.add("centerItemsInContainer");
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("removeButton");
    removeCell.appendChild(centerDiv2);
    centerDiv2.appendChild(removeButton);
    row.appendChild(removeCell);
    removeButton.dataset.bookIndex = row.dataset.index;
    removeButton.addEventListener("click", removeBook);

    return row;
}

function sortBookBy(book1, book2) {
    parameter = sortSelection.value;
    if (parameter == "pages")
    {
        if (Number(book1[parameter]) < Number(book2[parameter])) return -1;
        if (Number(book1[parameter]) == Number(book2[parameter])) return 0;
        return 1;
    }
    if (book1[parameter] < book2[parameter]) return -1;
    if (book1[parameter] == book2[parameter]) return 0;
    return 1;
}

function resetTable(params) {
    myLibrary.sort(sortBookBy);
    

    table.querySelectorAll("table tbody > *").forEach(child =>
    {
        if (child.dataset.index != undefined) child.remove();
    })

    for (let i = 0; i < myLibrary.length; i++) {
        const row = makeRow(myLibrary[i], i);
        table.querySelector("tbody").appendChild(row);
    }  
    
    localStorage.setObj("myLibrary", myLibrary);
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

const table = document.querySelector("table");

const sortSelection = document.querySelector("#sortSelection");
sortSelection.addEventListener("click", resetTable);

resetTable();

