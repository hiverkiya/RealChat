import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBNoJaHonsmAWV5dtpdZbbqvFhbJzpYymQ",
  authDomain: "realchat-df9cf.firebaseapp.com",
  projectId: "realchat-df9cf",
  storageBucket: "realchat-df9cf.appspot.com",
  messagingSenderId: "488645796861",
  appId: "1:488645796861:web:e4fba745b2d12c3ca22f94",
  measurementId: "G-8SYHXVMPXB"
})
const auth = firebase.auth();
const firestore = firebase.firestore();
const [user]= useAuthState(auth);
function App() {
  return (
    <div className="App">
      <header >
        
      </header>
      <section>
        {user ? <ChatRoom /> :<SignIn />}
      </section>
    </div>
  );
}
function SignIn(){
  const singInWithGoogle=()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);

  }
  return(
    <button onClick={singInWithGoogle}> Sign in with Google</button>
  )
}
function SignOut(){
  return auth.currentUser && (
    <button onClick={()=>auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom(){
  const messagesRef= firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages]=useCollectionData(query,{idField:'id'});
return (
  <>
  <div>
    { messages && messages.map(msg => <ChatMessage key ={msg.id} message={msg}/>)}
  </div>
  </>
)
}
function ChatMessage(props){
 const { text,uid}= props.message;
  return <p>{text}</p>
}
export default App;
