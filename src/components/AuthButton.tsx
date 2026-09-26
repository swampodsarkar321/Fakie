"use client";
import { useEffect, useState } from "react";
import { auth, googleProvider, db } from "@/lib/firebase";
import { signInWithPopup, onAuthStateChanged, signOut, User } from "firebase/auth";
import { ref as dbRef, set } from "firebase/database";

declare global { interface Window { google?: any } }

export function saveUser(uid: string, data: any) {
  return set(dbRef(db, `users/${uid}`), { ...data, updatedAt: Date.now() });
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => onAuthStateChanged(auth, (u) => {
    setUser(u);
    if (u) saveUser(u.uid, { name: u.displayName, email: u.email, photo: u.photoURL }).catch(() => {});
  }), []);

  const login = async () => {
    const r = await signInWithPopup(auth, googleProvider);
    saveUser(r.user.uid, { name: r.user.displayName, email: r.user.email, photo: r.user.photoURL }).catch(() => {});
  };

  if (user) return (
    <div className="flex items-center gap-2">
      <img src={user.photoURL ?? ""} className="w-8 h-8 rounded-full" alt="" />
      <span className="text-[13px] font-semibold hidden sm:block">{user.displayName?.split(" ")[0]}</span>
      <button onClick={() => signOut(auth)} className="text-[13px] text-zinc-500 hover:text-black">Logout</button>
    </div>
  );
  return <button onClick={login} className="bg-black text-white text-[13px] font-bold px-4 py-2 rounded-full hover:bg-zinc-800">Login with Google</button>;
}
