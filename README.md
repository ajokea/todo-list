In this project, I used my knowledge of factory functions, objects, JSON, ES6 modules, npm, and Webpack to create a small Todo List app.

Todos are categorized into different lists. Users can create new lists, as well as edit the name of a list and delete it altogether. List names cannot be blank or duplicated. Clicking on the name of a list will display all of its todos. Note: deleting a list will delete all the todos categorized in the list because each todo is associated with a list. Similarly, a user can only create a todo if there is a list to categorize it in, so the "new to-do" button will be disabled unless there is a list available. All todos will be categorized into the General list by default upon opening the app.

Users can create new todos, as well as edit and delete them. Todos can be checked off to be marked complete. Todos must have a title and a list to be valid. Optionally, the user can add a description, due date, and priority to the todo. Todos will be marked low priority (!) by default. 

I utilized the date-fns library to format the date/time and sort the todos in order of due date via the formatRelative and compareAsc functions, respectively.

I utilized the localStorage property in the Web Storage API so that data can stay persistent when a user refreshes the page.