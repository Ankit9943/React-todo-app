import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { db } from "../firebase"; // Ensure this path is correct
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const Todo = () => {
  const [todo, setTodo] = useState("");
  const [items, setItems] = useState([]);

  // Fetch items from Firestore when the component mounts
  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "todos"));
      const todosArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(todosArray);
    };

    fetchItems();
  }, []);

  // Add a new item to Firestore
  const addItems = async () => {
    if (todo) {
      const newItem = { text: todo, completed: false };
      const docRef = await addDoc(collection(db, "todos"), newItem);
      setItems([...items, { id: docRef.id, ...newItem }]);
      setTodo("");
    }
  };

  // Delete a single item from Firestore
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    setItems(items.filter((item) => item.id !== id));
  };

  // Delete all items (optional)
  const deleteAll = async () => {
    const querySnapshot = await getDocs(collection(db, "todos"));
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, "todos", docSnapshot.id));
    });
    setItems([]);
  };

  return (
    <>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 max-h-screen bg-zinc-800 p-4 rounded-xl shadow-lg overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4 text-center text-white">
          Todo List
        </h1>

        <div className="flex justify-center space-x-2">
          <input
            type="text"
            className="bg-blue-200 p-2 w-4/5 rounded-md outline-blue-600"
            placeholder="Add a todo.."
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <button
            type="button"
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-600"
            onClick={addItems}
          >
            Add
          </button>
        </div>

        <ul className="flex flex-col space-y-2 mt-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between p-2 bg-gray-100 rounded-md hover:bg-gray-200 font-semibold"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="first"
                  className="h-5 w-5 text-blue-600 rounded-full"
                />
                <span className="text-gray-800">{item.text}</span>
              </div>
              <FaRegTrashAlt
                onClick={() => deleteItem(item.id)}
                className="cursor-pointer hover:text-red-700"
              />
            </li>
          ))}
        </ul>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={deleteAll}
            type="button"
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Remove All
          </button>
        </div>
      </div>
    </>
  );
};

export default Todo;
