import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !(session.user as any)?.id) {
    return null;
  }
  
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      services: true,
    }
  });
  
  const bookings = await prisma.booking.findMany({
    where: { service: { creatorId: (session.user as any).id } },
    include: { service: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 className="text-secondary" style={{ color: 'var(--text-secondary)' }}>Total Bookings</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{bookings.length}</p>
        </div>
        <div className="card">
          <h3 className="text-secondary" style={{ color: 'var(--text-secondary)' }}>Active Services</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{user?.services.length || 0}</p>
        </div>
        <div className="card">
          <h3 className="text-secondary" style={{ color: 'var(--text-secondary)' }}>Profile Views</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Recent Bookings</h2>
        {bookings.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No bookings yet.</p>
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map((booking) => (
              <li key={booking.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{booking.guestName} ({booking.guestEmail})</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '500' }}>{booking.service.title}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <span>{new Date(booking.startTime).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
