import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import styles from "../login/page.module.css";

export default function Signup({ searchParams }: { searchParams: { error?: string } }) {
  async function registerUser(formData: FormData) {
    "use server";
    
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;

    if (!username || !password || !email) {
      redirect("/signup?error=Missing+fields");
    }

    let destination = "";

    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email }
          ]
        }
      });

      if (existingUser) {
        destination = "/signup?error=Username+or+email+already+taken";
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
            name: username, // default name to username initially
          }
        });

        destination = "/login?registered=true";
      }
    } catch (error: any) {
      destination = "/signup?error=An+unexpected+error+occurred";
    }

    if (destination) {
      redirect(destination);
    }
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.card} card animate-fade-in`}>
        <h1 className={styles.title}>Create an Account</h1>
        <p className={styles.subtitle}>Join OpenMate to start monetizing</p>
        
        {searchParams.error && (
          <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {searchParams.error}
          </div>
        )}
        
        <form action={registerUser} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input 
              id="username"
              name="username"
              type="text" 
              className={styles.input}
              placeholder="e.g. johndoe" 
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input 
              id="email"
              name="email"
              type="email" 
              className={styles.input}
              placeholder="e.g. john@example.com" 
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input 
              id="password"
              name="password"
              type="password" 
              className={styles.input}
              placeholder="••••••••" 
              required
              minLength={8}
            />
          </div>
          
          <button 
            type="submit" 
            className={`btn-primary ${styles.submitBtn}`}
          >
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
