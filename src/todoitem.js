const TodoItem = function (title, description, dueDate, priority, list, completed = false) {
    const getTitle = () => title;
    const setTitle = (newTitle) => title = newTitle;

    const getDescription = () => description;
    const setDescription = (newDescription) => description = newDescription;

    const getDueDate = () => dueDate;
    const setDueDate = (newDueDate) => dueDate = newDueDate;

    const getPriority = () => priority;
    const setPriority = (newPriority) => priority = newPriority;

    const getList = () => list;
    const setList = (newList) => list = newList;

    const getCompleted = () => completed;
    const toggleCompleted = () => completed = !completed;

    const stringify = () => {
        return JSON.stringify({
            title: getTitle(),
            description: getDescription(),
            dueDate: getDueDate(),
            priority: getPriority(),
            list: getList(),
            completed: getCompleted()
        });
    }

    return { getTitle, setTitle, getDescription, setDescription, getDueDate, setDueDate, getPriority, setPriority, getList, setList, getCompleted, toggleCompleted, stringify };
}

export default TodoItem;