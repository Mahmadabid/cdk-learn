import Todo from "./Todo";

type AppSyncEvent = {
    info: {
        fieldName: String
    },
    arguments: {
        todo: Todo
    }
}