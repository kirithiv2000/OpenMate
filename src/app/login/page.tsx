"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function Login({ searchParams }: { searchParams: { registered?: string, error?: string } }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        setError("Invalid username or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} card animate-fade-in`}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Enter your details to sign in</p>
        
        {searchParams.registered === 'true' && (
          <div style={{ color: '#10b981', marginBottom: '1rem', fontSize: '0.875rem', backgroundColor: '#ecfdf5', padding: '0.5rem', borderRadius: '4px' }}>
            Account created successfully! You can now log in.
          </div>
        )}
        
        {searchParams.error && (
          <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {searchParams.error}
          </div>
        )}
        
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

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

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input 
              id="password"
              type="password" 
              className={styles.input}
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={`btn-primary ${styles.submitBtn}`}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don&apos;t have an account? <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: '500' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
