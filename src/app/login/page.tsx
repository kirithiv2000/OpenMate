"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn("credentials", {
        username,
        password: "password123", // Dummy password for MVP
        redirect: false,
      });
      
      if (result?.error) {
        alert("Login failed");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} card animate-fade-in`}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Enter your creator username to continue</p>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input 
              id="username"
              type="text" 
              className={styles.input}
              placeholder="e.g. johndoe" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={`btn-primary ${styles.submitBtn}`}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
