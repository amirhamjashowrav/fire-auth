import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
 
function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(result =>{
      const {displayName, email, photoURL} = result.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(displayName, email, photoURL);
    })
    .catch(error =>{
      console.log(error);
      console.log(error.message);
    })
  }

  const handleSignOut = () =>{
    firebase.auth().signOut()
    .then(result => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        error: '',
        success: false 
      }
      setUser(signedOutUser);
    })
    .catch(error =>{
      console.log(error)
    })
  }

  const handleBlur = (event) =>{
    console.log(event.target.name, event.target.value);
    let isFieldValid = true;
    if(event.target.name === 'email'){
      //Email validation checking using regular expression
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if (event.target.name === 'password'){
      //password validation checking
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasnumber = /\d{1}/.test(event.target.value);
      isFieldValid = isPasswordValid && passwordHasnumber;
    }
    if (isFieldValid){
      const newUserinfo = {...user};
      newUserinfo[event.target.name] = event.target.value;
      setUser(newUserinfo);
    }
  }

  const handleSubmit = (event) =>{
    if (newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
      // Signed in 
       const newUserInfo = {...user};
       newUserInfo.error = '';
       newUserInfo.success = true;
       setUser(newUserInfo);
       updateUserName(user.name);
      // ...
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
  
  }
  if (newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(res => {
    // Signed in
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    // ...
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
  }
    event.preventDefault();
  }

  const updateUserName = name =>{
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
  }).then(function() {
  // Update successful.
    }).catch(function(error) {
        console.log(error)
    });
  }


  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick= {handleSignOut}>Sign out</button> : 
        <button onClick= {handleSignIn}>Sign in</button>
      }
      {
        user.isSignedIn && <div>
          <p>welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }

      <h1>Our Own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input name='name' type='text' onBlur={handleBlur} placeholder='Your Name'/>}
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Email" required/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} placeholder="Password" required/>
        <br/>
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      {user.success && <p style={{color: 'green'}}>User {newUser? 'Created' : 'Loggid in'} Successfully</p>}
      
    </div>
  );
}

export default App;
