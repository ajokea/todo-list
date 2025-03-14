import "./style.css";
import TodoItem from "./todoitem";
import TodoList from "./todolist";
import { formatRelative, compareAsc } from "date-fns";

const updateStorage = () => {
    localStorage.myLists = JSON.stringify(myLists, (key, value) => value instanceof Array ? value : value.stringify());
    localStorage.currentList = currentList ? currentList.stringify() : null;
}

const retrieveStorage = () => {
    let myListsData = JSON.parse(localStorage.myLists);
    let currentListData = JSON.parse(localStorage.currentList);

    let lists = []
    myListsData.forEach((obj) => {
        let listData = JSON.parse(obj);
        let list = TodoList(listData.name);
        listData.items.forEach((item) => {
            let todoData = JSON.parse(item)
            let todo = TodoItem(todoData.title, todoData.description, todoData.dueDate, todoData.priority, list, todoData.completed);
            list.addItem(todo);
        })
        lists.push(list)
    });

    return [lists, lists.find((list) => list.getName() === currentListData.name)]
}
let storedValues = localStorage.length === 0 ? null : retrieveStorage();

const myLists = storedValues ? storedValues[0] : [TodoList("General")];
let currentList = storedValues ? storedValues[1] : myLists[0];

const body = document.body;
const newListButton = document.getElementById('new-list');
const newToDoButton = document.getElementById('new-todo');
const ulLists = document.getElementById('lists');
const ulTodos = document.getElementById('todos');
const listsDiv = document.getElementsByClassName('lists')[0];
const todosDiv = document.getElementsByClassName('todos')[0];
const emptyListText = document.createElement("p");
emptyListText.textContent = "This list is empty.";
const noListsText = document.createElement('p');
noListsText.textContent = "No lists selected.";
const createListText = document.createElement('p');
createListText.textContent = "Create a new list.";

const listPopup = (oldList) => {
    // create modal for creating a new list/updating list name

    let backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    
    let popup = document.createElement('div');
    popup.className = 'list-popup';

    let form = document.createElement('form');
    form.id = "list-form";
    
    let nameDiv = document.createElement('div');
    nameDiv.className = "name";
    let nameLabel = document.createElement('label');
    nameLabel.textContent = "List Name";
    let nameInput = document.createElement('input');
    nameInput.name = 'name';
    nameInput.value = !oldList || oldList instanceof PointerEvent ? "" : oldList.getName();
    nameDiv.append(nameLabel, nameInput);
    
    let buttonDiv = document.createElement('div');
    // adding a new list
    if (!oldList || oldList instanceof PointerEvent) {
        let addListButton = document.createElement('button');
        addListButton.textContent = "Add List";
        addListButton.type = "submit";
        buttonDiv.appendChild(addListButton);

        addListButton.addEventListener('click', () => {
            let formData = new FormData(form);
            let listName = Object.fromEntries(formData)['name'];
            if (listName && !myLists.map((list) => list.getName()).includes(listName)) {
                let newList = TodoList(listName);
                myLists.push(newList);
                currentList = newList;
                updateStorage();
            }
            body.removeChild(backdrop);
            body.removeChild(popup);
            displayLists();
            displayTodos();
        });
    } else {
        // updating list name
        let saveListButton = document.createElement('button');
        saveListButton.textContent = "Save List";
        saveListButton.type = "submit";
        buttonDiv.appendChild(saveListButton);

        saveListButton.addEventListener('click', () => {
            let formData = new FormData(form);
            let newListName = Object.fromEntries(formData)['name'];
            if (newListName && !myLists.map((list) => list.getName()).includes(newListName)) {
                oldList.setName(newListName);
                updateStorage();
            }
            body.removeChild(backdrop);
            body.removeChild(popup);
            displayLists();
            displayTodos();
        });
    }

    let cancelButton = document.createElement('button');
    cancelButton.textContent = "Cancel";
    cancelButton.type = "button";
    buttonDiv.appendChild(cancelButton);
    
    form.append(nameDiv, buttonDiv);
    popup.appendChild(form);

    cancelButton.addEventListener('click', () => {
        body.removeChild(backdrop);
        body.removeChild(popup);
    });

    body.append(backdrop, popup);
}
newListButton.addEventListener('click', listPopup);

const todoPopup = (oldTodo) => {
    // create modal for creating a new/updating todo

    let backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    
    let popup = document.createElement('div');
    popup.className = 'todo-popup';

    let form = document.createElement('form');
    form.id = "todo-form";

    let titleDiv = document.createElement('div');
    titleDiv.className = "title";
    let titleLabel = document.createElement('label');
    titleLabel.textContent = "Title";
    let titleInput = document.createElement('input');
    titleInput.name = "title";
    titleInput.value = !oldTodo || oldTodo instanceof PointerEvent ? "" : oldTodo.getTitle();
    titleDiv.append(titleLabel, titleInput);

    let descriptionDiv = document.createElement('div');
    descriptionDiv.className = "description";
    let descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = "Description";
    let descriptionInput = document.createElement('textarea');
    descriptionInput.name = "description";
    descriptionInput.rows = 8;
    descriptionInput.textContent = !oldTodo || oldTodo instanceof PointerEvent ? "" : oldTodo.getDescription();
    descriptionDiv.append(descriptionLabel, descriptionInput);

    let dueDateDiv = document.createElement('div');
    dueDateDiv.className = "due-date";
    let dueDateLabel = document.createElement('label');
    dueDateLabel.textContent = "Due Date";
    let dueDateInput = document.createElement('input');
    dueDateInput.type = "datetime-local";
    dueDateInput.name = "due-date";
    dueDateInput.value = !oldTodo || oldTodo instanceof PointerEvent ? "" : oldTodo.getDueDate();
    dueDateDiv.append(dueDateLabel, dueDateInput);

    let priorityDiv = document.createElement('div');
    priorityDiv.className = "priority";
    let priorityLabel = document.createElement('label');
    priorityLabel.textContent = "Priority";
    let prioritySelect = document.createElement('select');
    prioritySelect.name = "priority";
    let lowPriorityOption = document.createElement('option');
    lowPriorityOption.text = "!";
    lowPriorityOption.value = "!";
    lowPriorityOption.selected = !oldTodo || oldTodo instanceof PointerEvent || oldTodo.getPriority() !== lowPriorityOption.value ? false : true;
    let medPriorityOption = document.createElement('option');
    medPriorityOption.text = "!!";
    medPriorityOption.value = "!!";
    medPriorityOption.selected = !oldTodo || oldTodo instanceof PointerEvent || oldTodo.getPriority() !== medPriorityOption.value ? false : true;
    let highPriorityOption = document.createElement('option');
    highPriorityOption.text = "!!!";
    highPriorityOption.value = "!!!";
    highPriorityOption.selected = !oldTodo || oldTodo instanceof PointerEvent || oldTodo.getPriority() !== highPriorityOption.value ? false : true;
    prioritySelect.append(lowPriorityOption, medPriorityOption, highPriorityOption);
    priorityDiv.append(priorityLabel, prioritySelect);

    let listDiv = document.createElement('div');
    listDiv.className = "list";
    let listLabel = document.createElement('label');
    listLabel.textContent = "List";
    let listSelect = document.createElement('select');
    listSelect.name = "list"
    myLists.forEach((list) => {
        let listOption = document.createElement('option');
        listOption.text = list.getName();
        listOption.value = list.getName();
        listSelect.append(listOption);
        listOption.selected = list !== currentList ? false : true;
    });
    listDiv.append(listLabel, listSelect);

    let buttonDiv = document.createElement('div');
    if (!oldTodo || oldTodo instanceof PointerEvent) {
        let addTodoButton = document.createElement('button');
        addTodoButton.textContent = "Add To-Do";
        addTodoButton.type = "submit";
        buttonDiv.appendChild(addTodoButton);

        addTodoButton.addEventListener('click', () => {
            let formData = new FormData(form);
            let todoInfo = Object.fromEntries(formData);
            let todoTitle = todoInfo['title'];
            let todoDescription = todoInfo['description'];
            let todoDate = todoInfo['due-date'];
            let todoPriority = todoInfo['priority'];
            let todoList;
            myLists.forEach((list) => {
                if (list.getName() === todoInfo['list']) {
                    todoList = list;
                }
            })
            if (todoTitle && todoList && !todoList.getItems().map((todo) => todo.getTitle()).includes(todoTitle)) {
                let todo = TodoItem(todoTitle, todoDescription, todoDate, todoPriority, todoList);
                todoList.addItem(todo);
                currentList = todoList;
                updateStorage();
            }
            body.removeChild(backdrop);
            body.removeChild(popup);
            displayTodos();
        });
    } else {
        let saveTodoButton = document.createElement('button');
        saveTodoButton.textContent = "Save Todo";
        saveTodoButton.type = "submit";
        buttonDiv.appendChild(saveTodoButton);

        saveTodoButton.addEventListener('click', () => {
            let formData = new FormData(form);
            let todoInfo = Object.fromEntries(formData);
            let todoTitle = todoInfo['title'];
            let todoDescription = todoInfo['description'];
            let todoDate = todoInfo['due-date'];
            let todoPriority = todoInfo['priority'];
            let todoList;
            myLists.forEach((list) => {
                if (list.getName() === todoInfo['list']) {
                    todoList = list;
                }
            })
            if (todoList && todoTitle && (todoTitle === oldTodo.getTitle() || !todoList.getItems().map((todo) => todo.getTitle()).includes(todoTitle))) {
                if (todoList === oldTodo.getList()) {
                    oldTodo.setTitle(todoTitle);
                    oldTodo.setDescription(todoDescription);
                    oldTodo.setDueDate(todoDate);
                    oldTodo.setPriority(todoPriority);
                } else {
                    let todo = TodoItem(todoTitle, todoDescription, todoDate, todoPriority, todoList);
                    oldTodo.getList().removeItem(oldTodo);
                    todoList.addItem(todo);
                }
                currentList = todoList;
                updateStorage();
            }
            body.removeChild(backdrop);
            body.removeChild(popup);
            displayTodos();
        });
    }
    let cancelButton = document.createElement('button');
    cancelButton.textContent = "Cancel";
    cancelButton.type = "button";
    buttonDiv.appendChild(cancelButton);
    
    form.append(titleDiv, descriptionDiv, dueDateDiv, priorityDiv, listDiv, buttonDiv);
    popup.appendChild(form);

    cancelButton.addEventListener('click', () => {
        body.removeChild(backdrop);
        body.removeChild(popup);
    });

    body.append(backdrop, popup);
}
newToDoButton.addEventListener('click', todoPopup);

const displayLists = () => {
    ulLists.innerHTML = "";
    if (myLists.length === 0) {
        listsDiv.insertBefore(createListText, newListButton);
    } else {
        if (listsDiv.querySelector('p')) listsDiv.removeChild(createListText);
        myLists.forEach((list) => {
            let listDiv = document.createElement('div');
            let listName = document.createElement('li');
            listName.textContent = list.getName();
            let buttonDiv = document.createElement('div');
            let editListNameButton = document.createElement('button');
            editListNameButton.textContent = "Edit";
            let deleteListButton = document.createElement('button');
            deleteListButton.textContent = "Delete";
            buttonDiv.append(editListNameButton, deleteListButton);
            listDiv.append(listName, buttonDiv);
            ulLists.appendChild(listDiv);
        });
    } 
}
displayLists();

const displayTodos = () => {
    ulTodos.innerHTML = "";
    const todosListName = todosDiv.getElementsByTagName('h1')[0];
    if (myLists.length !== 0) {
        newToDoButton.disabled = false;
        todosListName.textContent = currentList.getName();
        if (currentList.getItems().length === 0) {
            if (todosDiv.querySelector('p') !== null && todosDiv.querySelector('p') != emptyListText) todosDiv.removeChild(noListsText);
            todosDiv.insertBefore(emptyListText, newToDoButton);
        } else {
            if (todosDiv.children.length > 3) todosDiv.removeChild(emptyListText);
            currentList.getItems().sort((todo1, todo2) => {
                return compareAsc(todo1.getDueDate(), todo2.getDueDate());
            });
            currentList.getItems().forEach((todo) => {
                let li = document.createElement('li');
                let checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.checked = todo.getCompleted() ? true : false;
                let todoDiv = document.createElement('div');
                todoDiv.className = "todo-div";
                let todoTitle = document.createElement('h3');
                todoTitle.textContent = todo.getTitle();
                todoTitle.className = todo.getCompleted() ? "completed" : "";
                let todoDate = document.createElement('p')
                todoDate.textContent = todo.getDueDate() ? `Due: ${formatRelative(todo.getDueDate(), new Date())}` : "";
                todoDate.className = todo.getCompleted() ? "completed" : "";
                let todoPriority = document.createElement('p');
                todoPriority.textContent = `${todo.getPriority()}`;
                todoPriority.style.color = todo.getPriority() === "!" ? "yellow" : todo.getPriority() === "!!" ? "orange" : "red";
                todoPriority.className = todo.getCompleted() ? "completed" : "";
                todoDiv.append(todoTitle, todoDate, todoPriority);
                let buttonDiv = document.createElement('div');
                let editTodoButton = document.createElement('button');
                editTodoButton.textContent = "Edit";
                let deleteTodoButton = document.createElement('button');
                deleteTodoButton.textContent = "Delete";
                buttonDiv.append(editTodoButton, deleteTodoButton);
                li.append(checkbox, todoDiv, buttonDiv);
                ulTodos.appendChild(li);
            })
        }   
    } else {
        todosListName.textContent = "";
        if (todosDiv.querySelector('p') !== null) todosDiv.removeChild(emptyListText);
        todosDiv.insertBefore(noListsText, newToDoButton);
        newToDoButton.disabled = true;
    }
}
displayTodos();

// display a list's todos
ulLists.addEventListener("click", (event) => {
    if (event.target.matches("li")) {
        let listName  = event.target.textContent;
        currentList = myLists.find((list) => list.getName() === listName);
        displayTodos();
    }
});

// edit or delete list
ulLists.addEventListener("click", (event) => {
    if (event.target.matches("button")) {
        let listDiv = event.target.parentElement.parentElement;
        let listName = listDiv.querySelector('li').textContent;
        let list = myLists.find((list) => list.getName() === listName);
        if (event.target.textContent === "Delete") {
            let changeCurrent = currentList === list ? true : false;
            let listIndex = myLists.indexOf(list);
            myLists.splice(listIndex, 1);
            
            if (myLists.length === 0) currentList = null;
            if (changeCurrent && myLists.length !== 0) currentList = myLists[0];
            updateStorage();
            displayLists();
            displayTodos();
        } else {
            listPopup(list);
        }
    }
});

/// edit or delete todo
ulTodos.addEventListener("click", (event) => {
    if (event.target.matches("button")) {
        let todoDiv = event.target.parentElement.previousSibling;
        let todoTitle = todoDiv.querySelector('h3').textContent;
        let todo = currentList.getItems().find((todo) => todo.getTitle() === todoTitle);
        if (event.target.textContent === "Delete") {
            currentList.removeItem(todo);
            updateStorage();
            displayTodos();
        } else {
            todoPopup(todo);
        }
    }
});

// complete/check off todo
ulTodos.addEventListener("change", (event) => {
    if (event.target.matches("input")) {
        let todoListName = event.target.parentElement.parentElement.parentElement.querySelector('h1').textContent;
        let todoList = myLists.find((list) => list.getName() === todoListName);
        let todoDiv = event.target.nextSibling;
        let todoTitle = todoDiv.querySelector('h3').textContent;
        let todo = todoList.getItems().find((todo) => todo.getTitle() === todoTitle);
        todo.toggleCompleted();
        updateStorage();
        displayTodos();
    }
});