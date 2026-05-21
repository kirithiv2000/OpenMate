import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import CopyLinkButton from "./CopyLinkButton";

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !(session.user as any)?.id) {
    return null;
  }
  
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { services: true }
  });
  
  if (!user) return null;
  const services = user.services;

  async function createService(formData: FormData) {
    "use server";
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const duration = parseInt(formData.get("duration") as string, 10);
    const type = formData.get("type") as string;
    
    try {
      await prisma.service.create({
        data: {
          title,
          description,
          price,
          duration,
          type,
          creatorId: (session?.user as any)?.id
        }
      });
      revalidatePath("/dashboard/services");
    } catch (error) {
      console.error("Failed to create service:", error);
    }
  }

  async function deleteService(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    
    try {
      await prisma.service.delete({
        where: { id }
      });
      revalidatePath("/dashboard/services");
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Your Offerings</h2>
        
        {services.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>You haven&apos;t created any services yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {services.map(service => (
              <div key={service.id} className="card" style={{ border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{service.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: '500' }}>{service.duration} mins</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>${service.price}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CopyLinkButton link={`/${user.username}/book/${service.id}`} />
                  <form action={deleteService}>
                    <input type="hidden" name="id" value={service.id} />
                    <button type="submit" style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Delete</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card max-w-2xl">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Create New Service</h2>
        
        <form action={createService} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="title" style={{ fontWeight: '500' }}>Title</label>
            <input type="text" id="title" name="title" required style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="description" style={{ fontWeight: '500' }}>Description</label>
            <textarea id="description" name="description" rows={3} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="price" style={{ fontWeight: '500' }}>Price ($)</label>
              <input type="number" id="price" name="price" defaultValue="0" min="0" step="0.01" required style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="duration" style={{ fontWeight: '500' }}>Duration (mins)</label>
              <input type="number" id="duration" name="duration" defaultValue="30" min="5" step="5" required style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="type" style={{ fontWeight: '500' }}>Type</label>
            <select id="type" name="type" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
              <option value="call">1:1 Call</option>
              <option value="query">Text Query</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Create Service</button>
        </form>
      </div>
    </div>
  );
}
