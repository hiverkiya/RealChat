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
  const [formValue,setFormValue]=useState('');
  const sendMessage=async(e)=>{
    e.preventDefault();
    const {uid,photoURL}=auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
  }
return (
  <>
  <div>
    { messages && messages.map(msg => <ChatMessage key ={msg.id} message={msg}/>)}
  </div>
  <form onSubmit={sendMessage}>
    <input value ={formValue} onChange={(e)=> setFormValue(e.target.value)}/>
    <button type="submit"> * </button>
  </form>
  </>
)
}
function ChatMessage(props){
 const { text,uid,photoURL}= props.message;
 const messageClass= uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  )
}
export default App;
