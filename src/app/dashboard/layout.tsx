import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./layout.module.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>OpenMate</div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}>Overview</Link>
          <Link href="/dashboard/services" className={styles.navLink}>Services</Link>
          <Link href="/dashboard/testimonials" className={styles.navLink}>Testimonials</Link>
          <Link href="/dashboard/profile" className={styles.navLink}>Profile</Link>
        </nav>
        <div className={styles.user}>
          <div className={styles.avatar}>{(session.user as any)?.username?.charAt(0).toUpperCase()}</div>
          <div className={styles.userInfo}>
            <div className={styles.username}>{(session.user as any)?.username}</div>
            <a href={`/${(session.user as any)?.username}`} target="_blank" className={styles.publicLink}>View Public Page</a>
          </div>
        </div>
      </aside>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
