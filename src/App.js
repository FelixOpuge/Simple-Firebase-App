import { useEffect, useState } from 'react';
import './App.css';
import {db} from './firebaseConfig'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { async } from '@firebase/util';

function App() {

  const [users, setUsers] = useState([])
  const [newName, setNewName] = useState('')
  const [newAge, setNewAge] = useState(0)

  const usersColloectionRef = collection(db, "users")

  const createUser = async () => {
    await addDoc(usersColloectionRef, {name: newName, age: Number(newAge)})
  }

  const updateUser = async (age, id) => {
    const userDoc = doc(db, "users", id)
    const newFields = { age: age + 1 }
    await updateDoc(userDoc, newFields)

  }

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id)

    await deleteDoc(userDoc)
  }

  useEffect(() => {
    const getUsers = async() => {
      const data = await getDocs(usersColloectionRef)
      setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }
    getUsers()
  },[])
  console.log(users)
  return (
    <div className="App">
      <input placeholder="Name..." onChange={(e) => setNewName(e.target.value)} />
      <input type='number' placeholder="Age..." onChange={(e) => setNewAge(e.target.value)} />
      <button onClick={createUser}> Create User </button>
      { users.map((user) => (
        <div key={user.id}>
          <h1>Name: <span>{user.name}</span></h1>
          <h1>Age: <span>{user.age}</span></h1>
          <button onClick={() => {updateUser(user.age, user.id)}}>Increase Age</button>
          <button onClick={() => {deleteUser(user.id)}}>Delete User</button>
        </div>
      )) }
    </div>
  );
}

export default App;
