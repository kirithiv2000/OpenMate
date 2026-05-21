import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <h1 className={`${styles.title} animate-fade-in`}>
          Monetize your time, <span className="text-gradient">on your own terms.</span>
        </h1>
        <p className={`${styles.description} animate-fade-in`} style={{ animationDelay: "0.1s" }}>
          The open-source, self-hosted alternative to Topmate. Offer 1:1 calls, queries, and digital products with <strong>0% platform fees</strong>.
        </p>
        <div className={`${styles.actions} animate-fade-in`} style={{ animationDelay: "0.2s" }}>
          <Link href="/dashboard">
            <button className="btn-primary">Get Started for Free</button>
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <button className="btn-secondary">View on GitHub</button>
          </a>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={`${styles.featureCard} card`}>
            <div className={styles.featureIcon}>💸</div>
            <h3 className={styles.featureTitle}>0% Platform Fees</h3>
            <p className={styles.featureText}>Keep 100% of your earnings. You only pay standard payment processing fees.</p>
          </div>
          <div className={`${styles.featureCard} card`}>
            <div className={styles.featureIcon}>🛡️</div>
            <h3 className={styles.featureTitle}>Self-Hosted & Open Source</h3>
            <p className={styles.featureText}>Deploy it on your own domain. Own your data and fully customize the platform.</p>
          </div>
          <div className={`${styles.featureCard} card`}>
            <div className={styles.featureIcon}>🗓️</div>
            <h3 className={styles.featureTitle}>Seamless Scheduling</h3>
            <p className={styles.featureText}>Let clients book 1:1 calls and send queries effortlessly through your public profile.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
