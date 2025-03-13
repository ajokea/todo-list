const TodoList = function (name) {
    const items = [];
    
    const getName = () => name;
    const setName = (newName) => name = newName;
    
    const getItems = () => items;
    const addItem = (item) => items.push(item);
    const removeItem = (item) => items.splice(items.indexOf(item), 1);

    return { getName, setName, getItems, addItem, removeItem };
}

export default TodoList;