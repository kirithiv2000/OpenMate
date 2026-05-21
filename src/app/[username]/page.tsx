import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      services: true,
      testimonials: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    notFound();
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <header className={styles.profileHeader}>
        <div className={`${styles.avatar} animate-fade-in`}>
          {user.name ? user.name.charAt(0).toUpperCase() : user.username?.charAt(0).toUpperCase()}
        </div>
        <h1 className={`${styles.name} animate-fade-in`} style={{ animationDelay: '0.1s' }}>{user.name || user.username}</h1>
        <p className={`${styles.bio} animate-fade-in`} style={{ animationDelay: '0.2s' }}>{user.bio || "No bio provided."}</p>
      </header>

      <main className={`${styles.servicesSection} animate-fade-in`} style={{ animationDelay: '0.3s' }}>
        <h2 className={styles.sectionTitle}>Available Services</h2>
        
        {user.services.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>This creator hasn&apos;t added any services yet.</p>
        ) : (
          <div className={styles.serviceList}>
            {user.services.map((service) => (
              <Link href={`/${user.username}/book/${service.id}`} key={service.id} className={styles.serviceCard}>
                <div className={styles.serviceInfo}>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDesc}>{service.description}</p>
                  <div className={styles.serviceMeta}>
                    <span>⏱️ {service.duration} mins</span>
                    <span>📞 {service.type === 'call' ? '1:1 Call' : 'Text Query'}</span>
                  </div>
                </div>
                <div className={styles.servicePrice}>
                  ${service.price}
                  <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Book</button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {user.testimonials && user.testimonials.length > 0 && (
        <section className={`${styles.servicesSection} animate-fade-in`} style={{ animationDelay: '0.4s', paddingTop: '0' }}>
          <h2 className={styles.sectionTitle}>What People Say</h2>
          <div className={styles.serviceList} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {user.testimonials.map((t) => (
              <div key={t.id} className={styles.serviceCard} style={{ cursor: 'default', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '600' }}>{t.authorName}</div>
                  <div style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>
                    {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                  </div>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', flex: '1' }}>
                  &quot;{t.content}&quot;
                </div>
                {t.authorInfo && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: '500' }}>
                    {t.authorInfo}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
