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

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
	console.log("columnEl:", columnEl);
	console.log("column:", column);
	console.log("item:", item);
	console.log("index:", index);
	// List Item
	const listEl = document.createElement("li");
	listEl.classList.add("drag-item");
	listEl.textContent = item;
	listEl.draggable = true;
	listEl.setAttribute("ondragstart", "drag(event)");

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

	// Progress Column
	progressList.textContent = "";
	progressListArray.forEach((e, index) => {
		createItemEl(progressList, 1, e, index);
	});

	// Complete Column
	completeList.textContent = "";
	completeListArray.forEach((e, index) => {
		createItemEl(completeList, 2, e, index);
	});

	// On Hold Column
	onHoldList.textContent = "";
	onHoldListArray.forEach((e, index) => {
		createItemEl(onHoldList, 3, e, index);
	});

	// Run getSavedColumns only once, Update Local Storage
}
// allow array to update on ls
function rebuildArrays() {
	for (let i = 0; i < backlogList.children.length; i++) {
		backlogListArray.puch(backlogList.children[i].textContent);
	}
}

// When item start drag
function drag(e) {
	draggedItem = e.target;
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
	rebuildArrays();
}

// on load
updateDOM();
