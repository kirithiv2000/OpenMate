import Link from "next/link";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export default async function BookingSuccessPage({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams: { session_id?: string };
}) {
  const { session_id } = searchParams;
  let isConfirmed = false;

  if (session_id) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2023-10-16",
      });
      
      const session = await stripe.checkout.sessions.retrieve(session_id);
      
      if (session.payment_status === "paid" && session.client_reference_id) {
        await prisma.booking.update({
          where: { id: session.client_reference_id },
          data: { status: "confirmed" }
        });
        isConfirmed = true;
      }
    } catch (error) {
      console.error("Error verifying Stripe session:", error);
    }
  } else {
    // For free bookings, they are confirmed immediately.
    isConfirmed = true;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backgroundColor: 'var(--bg-color)' }}>
      <div className="card animate-fade-in" style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
          {isConfirmed ? "Booking Confirmed!" : "Verifying Payment..."}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.125rem' }}>
          {isConfirmed 
            ? "Your booking has been received. The creator will reach out to you shortly with the meeting details."
            : "We are processing your payment. This page will update shortly or you can check your email for confirmation."}
        </p>
        
        <Link href={`/${params.username}`}>
          <button className="btn-primary" style={{ width: '100%' }}>Return to Profile</button>
        </Link>
      </div>
    </div>
  );
}
