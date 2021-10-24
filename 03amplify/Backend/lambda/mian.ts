import addTodo from "./addTodo";
import delTodo from "./delTodo";
import getTodos from "./getTodos";
import Todo from "./Todo";
import updateTodo from "./updateTodo";

type AppSyncEvent = {
    info: {
        fieldName: string
    },
    arguments: {
        todoId: string,
        todo: Todo
    }
}

exports.handler = async(event: AppSyncEvent) => {
    switch(event.info.fieldName) {
        case "addTodo":
            return await addTodo(event.arguments.todo);
        case "delTodo":
            return await delTodo(event.arguments.todoId);
        case "updateTodo":
            return await updateTodo(event.arguments.todo);
        case "getTodos":
            return await getTodos();
        default:
            return null;
    }
}