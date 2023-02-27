import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import React, { createContext, useEffect, useState } from 'react';
import app from '../../firebase/firebase.config';

export const AuthContext = createContext();
const auth = getAuth(app)

const AuthProvider = ({children}) => {

const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

const signup = (email, password) => {
  setLoading(true)
  return createUserWithEmailAndPassword(auth, email, password);
};

const login = (email, password) => {
  setLoading(true)
  return signInWithEmailAndPassword(auth, email, password);
};

const logout = () =>{
    return signOut(auth);
}

const updateUser = (userInfo) =>{
  return  updateProfile(auth.currentUser, userInfo)
}

useEffect(()=>{
    const unSubscribe = onAuthStateChanged(auth,currentUser=>{
        setUser(currentUser);
        setLoading(false);
    })
    return ()=> unSubscribe();
},[])

const authInfo = {
  signup,
  login,
  user,
  logout,
  updateUser,
  loading
};
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;