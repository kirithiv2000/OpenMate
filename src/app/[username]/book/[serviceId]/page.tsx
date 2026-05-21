import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { notFound, redirect } from "next/navigation";
import styles from "./page.module.css";
import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: { username: string, serviceId: string } 
}): Promise<Metadata> {
  const service = await prisma.service.findUnique({
    where: { id: params.serviceId },
    include: { creator: true }
  });

  if (!service) {
    return { title: "Service Not Found" };
  }

  const title = `Book ${service.title} with ${service.creator.name || service.creator.username}`;
  const description = service.description || `Book a ${service.duration}-minute session with ${service.creator.name || service.creator.username} for $${service.price}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

export default async function BookServicePage({ 
  params 
}: { 
  params: { username: string, serviceId: string } 
}) {
  const { username, serviceId } = params;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) notFound();

  const service = await prisma.service.findUnique({
    where: { id: serviceId, creatorId: user.id },
  });

  if (!service) notFound();

  async function createBooking(formData: FormData) {
    "use server";
    
    const guestName = formData.get("name") as string;
    const guestEmail = formData.get("email") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + service!.duration * 60000);
    
    const booking = await prisma.booking.create({
      data: {
        serviceId: service!.id,
        guestName,
        guestEmail,
        startTime: startDateTime,
        endTime: endDateTime,
        status: service!.price > 0 ? "pending" : "confirmed"
      }
    });
    
    if (service!.price > 0) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2023-10-16" as any, // Bypass TS error for stripe apiVersion mismatch
      });
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: service!.title,
              description: `Booking with ${user!.name || user!.username}`
            },
            unit_amount: Math.round(service!.price * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${baseUrl}/${username}/book/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/${username}/book/${serviceId}`,
        client_reference_id: booking.id,
        customer_email: guestEmail
      });
      
      await prisma.booking.update({
        where: { id: booking.id },
        data: { stripeSessionId: session.id }
      });
      
      if (session.url) redirect(session.url);
    }
    
    redirect(`/${username}/book/success`);
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Book {service.title}</h1>
        <p className={styles.creator}>with {user.name || user.username}</p>
      </header>
      
      <div className={styles.layout}>
        <form action={createBooking} className={styles.formSection}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">Your Name</label>
            <input type="text" id="name" name="name" required className={styles.input} />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" required className={styles.input} />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="date">Date</label>
            <input type="date" id="date" name="date" required className={styles.input} min={new Date().toISOString().split('T')[0]} />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="time">Time</label>
            <input type="time" id="time" name="time" required className={styles.input} />
          </div>
          
          <button type="submit" className={`btn-primary ${styles.submitBtn}`}>Confirm Booking</button>
        </form>
        
        <aside>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Booking Summary</h2>
            
            <div className={styles.summaryRow}>
              <span>Service</span>
              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{service.title}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Duration</span>
              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{service.duration} mins</span>
            </div>
            
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>${service.price}</span>
            </div>
            
            <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {service.price > 0 ? "You will be redirected to Stripe to securely complete your payment (0% platform fees)." : "This service is free. No payment is required."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
