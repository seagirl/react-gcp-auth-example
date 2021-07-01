import React, { useEffect, useState } from "react";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';

type User = firebase.User

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

const Profile = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState("");

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      const token = await user?.getIdToken()
      if (token) {
        setIdToken(token)
      }

      setIsSignedIn(!!user);
      setUser(user)
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (isSignedIn && user) {
    return (
      <div>
        <h2>{user.displayName}</h2>
        <p>{user.email}</p>
        <h3>メールアドレス疎通確認</h3>
        <p>{user.emailVerified ? 'した' : 'まだ'}</p>
        <h3>IDトークン</h3>
        <p>{idToken}</p>
        <button onClick={() => firebase.auth().signOut()}>ログアウト</button>
      </div>
    );
  }

  return (
    <div>
      <p>Google Identity Platform Example</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
};

export default Profile;