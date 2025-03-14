const TodoList = function (name) {  
    const items = []

    const getName = () => name;
    const setName = (newName) => name = newName;
    
    const getItems = () => items;
    const addItem = (item) => items.push(item);
    const removeItem = (item) => items.splice(items.indexOf(item), 1);

    const stringify = () => {
        return JSON.stringify({
            name: getName(),
            items: getItems().map((item) => item.stringify())
        })
    }

    return { getName, setName, getItems, addItem, removeItem, stringify };
}

export default TodoList;