import React, { useState, useRef, useEffect } from "react"
import { API } from 'aws-amplify';
import Layout from "../components/layout"
import Seo from "../components/seo"
import shortid from "shortid";

// Amplify for a single page
/*
  import { Amplify } from 'aws-amplify';
  import awsmobile from '../aws-exports';

  Amplify.configure(awsmobile);
*/

//types
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoArray {
  data: {
    getTodos: Todo[]
  }
}


// GQL Queries and mutation
const getTodos = `{
  query GetTodos{
    getTodos{
      id
      title
      completed
    }
  }
}`

const addTodo = `
  mutation AddTodo($todo: Todo!){
    addTodo(todo: $todo){
      id
      title
      completed
    }
  }
`

const IndexPage = () => {

  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<TodoArray | null>(null);
  const todoTitleRef = useRef<any>("")


  // Fetch data from API
  const fetchTodos = async () => {
    try {
      const data = await API.graphql({ query: getTodos });
      setTodos(data as TodoArray);
      setLoading(false)
    }
    catch (err) {
      console.log('error fetching queries: ', err)
    }
  }


  // Add a new todo
  const AddTodo = async () => {
    try {
      await API.graphql({
        query: addTodo, variables: {
          todo: {
            title: todoTitleRef.current.value, id: shortid.generate(), completed: false
          }
        }
      });
      todoTitleRef.current.value = "";
      fetchTodos();
    }
    catch (err) {
      console.log('error adding todos: ', err);
    }

    useEffect(() => {
      fetchTodos();
    }, [])

    return (
      <Layout>
        <Seo title="Home" />
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <h1>Todos</h1>
              {todos.data && todos.data.getTodos.map((todo: Todo, index: number) => (
                <div key={index}>
                  <h3>{todo.title}</h3>
                  <p>{todo.completed}</p>
                </div>
              ))}
          </div>
        )}
        < input type="text" ref={todoTitleRef} />
        <button onClick={() => AddTodo()}>Add Todo</button>
      </Layout>
    )
  }

}

export default IndexPage;
