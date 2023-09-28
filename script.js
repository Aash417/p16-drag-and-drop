const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
	if (localStorage.getItem("backlogItems")) {
		backlogListArray = JSON.parse(localStorage.backlogItems);
		progressListArray = JSON.parse(localStorage.progressItems);
		completeListArray = JSON.parse(localStorage.completeItems);
		onHoldListArray = JSON.parse(localStorage.onHoldItems);
	} else {
		backlogListArray = ["Release the course", "Sit back and relax"];
		progressListArray = ["Work on projects", "Listen to music"];
		completeListArray = ["Being cool", "Getting stuff done"];
		onHoldListArray = ["Being uncool"];
	}
}

getSavedColumns();
updateSavedColumns();

// Set localStorage Arrays
function updateSavedColumns() {
	listArrays = [
		backlogListArray,
		progressListArray,
		completeListArray,
		onHoldListArray,
	];
	const arrayNames = ["backlog", "progress", "complete", "onHold"];

	arrayNames.forEach((e, index) => {
		localStorage.setItem(`${e}Items`, JSON.stringify(listArrays[index]));
	});
	// 	localStorage.setItem("backlogItems", JSON.stringify(backlogListArray));
	// 	localStorage.setItem("progressItems", JSON.stringify(progressListArray));
	// 	localStorage.setItem("completeItems", JSON.stringify(completeListArray));
	// 	localStorage.setItem("onHoldItems", JSON.stringify(onHoldListArray));
}

// Filter arrays to remove empty items
function filterArr(array) {
	const newArr = array.filter((e) => e !== null);
	return newArr;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
	// console.log("columnEl:", columnEl);
	// console.log("column:", column);
	// console.log("item:", item);
	// console.log("index:", index);
	// List Item
	const listEl = document.createElement("li");
	listEl.classList.add("drag-item");
	listEl.textContent = item;
	listEl.draggable = true;
	listEl.setAttribute("ondragstart", "drag(event)");
	listEl.contentEditable = true;
	listEl.id = index;
	listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
	// append
	columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
	// Check localStorage once
	if (!updateDOM) getSavedColumns();

	// Backlog Column
	backlogList.textContent = "";
	backlogListArray.forEach((e, index) => {
		createItemEl(backlogList, 0, e, index);
	});
	backlogListArray = filterArr(backlogListArray);

	// Progress Column
	progressList.textContent = "";
	progressListArray.forEach((e, index) => {
		createItemEl(progressList, 1, e, index);
	});
	// progressListArray = filterArr(progressListArray);

	// Complete Column
	completeList.textContent = "";
	completeListArray.forEach((e, index) => {
		createItemEl(completeList, 2, e, index);
	});
	// completeListArray = filterArr(completeListArray);

	// On Hold Column
	onHoldList.textContent = "";
	onHoldListArray.forEach((e, index) => {
		createItemEl(onHoldList, 3, e, index);
	});
	// onHoldListArray = filterArr(onHoldListArray);

	// Run getSavedColumns only once, Update Local Storage
	updatedOnLoad = true;
	updateSavedColumns();
}

// update item / delete if nessaary or update arr value
function updateItem(id, column) {
	// first select the currentColumn
	const selectedArray = listArrays[column];
	// then select the current element in the col
	const selectedColEl = listColumns[column].children;
	// console.log(selectedColEl[id].textContent);

	if (dragging) return;

	if (!selectedColEl[id].textContent) delete selectedArray[id];
	else selectedArray[id] = selectedColEl[id].textContent;

	updateDOM();
}

// Add to column list , reset the text box
function addToCol(col) {
	const itemText = addItems[col].textContent;
	const selectedArray = listArrays[col];
	selectedArray.push(itemText);
	addItems[col].textContent = "";
	if (itemText) updateDOM();
}

// Show add item to box
function showInputBox(col) {
	addBtns[col].style.visibility = "hidden";
	saveItemBtns[col].style.display = "flex";
	addItemContainers[col].style.display = "flex";
}
// Hide item input box
function hideInputBox(col) {
	addBtns[col].style.visibility = "visible";
	saveItemBtns[col].style.display = "none";
	addItemContainers[col].style.display = "none";
	addToCol(col);
}

// allow array to update on ls
function rebuildArrays() {
	backlogListArray = Array.from(backlogList.children).map((e) => e.textContent);

	progressListArray = Array.from(progressList.children).map(
		(e) => e.textContent
	);

	completeListArray = Array.from(completeList.children).map(
		(e) => e.textContent
	);

	onHoldListArray = Array.from(onHoldList.children).map((e) => e.textContent);

	updateDOM();
	// backlogListArray = [];
	// for (let i = 0; i < backlogList.children.length; i++) {
	// 	backlogListArray.push(backlogList.children[i].textContent);
	// }
	// progressListArray = [];
	// for (let i = 0; i < progressList.children.length; i++) {
	// 	progressListArray.push(progressList.children[i].textContent);
	// }
	// completeListArray = [];
	// for (let i = 0; i < completeList.children.length; i++) {
	// 	completeListArray.push(completeList.children[i].textContent);
	// }
	// onHoldListArray = [];
	// for (let i = 0; i < onHoldList.children.length; i++) {
	// 	onHoldListArray.push(onHoldList.children[i].textContent);
	// }
	// updateDOM();
}

// When item start drag
function drag(e) {
	draggedItem = e.target;
	dragging = true;
	// console.log(draggedItem);
}

// column allows for items to drop
function allowDrop(e) {
	e.preventDefault();
}

// when item enter column area
function dragEnter(col) {
	// console.log(listColumns[col]);
	listColumns[col].classList.add("over");
	currentColumn = col;
}

// droping item in column
function drop(e) {
	e.preventDefault();
	// remove background color/padding
	listColumns.forEach((col) => {
		col.classList.remove("over");
	});
	// add item to column
	const parent = listColumns[currentColumn];
	parent.appendChild(draggedItem);
	// draging complete
	dragging = false;
	rebuildArrays();
}

// on load
updateDOM();
