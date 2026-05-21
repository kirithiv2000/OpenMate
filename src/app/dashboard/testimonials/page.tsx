import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function TestimonialsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !(session.user as any)?.id) {
    return null;
  }
  
  const testimonials = await prisma.testimonial.findMany({
    where: { creatorId: (session.user as any).id },
    orderBy: { createdAt: 'desc' }
  });

  async function createTestimonial(formData: FormData) {
    "use server";
    
    const authorName = formData.get("authorName") as string;
    const authorInfo = formData.get("authorInfo") as string;
    const content = formData.get("content") as string;
    const rating = parseInt(formData.get("rating") as string, 10);
    
    try {
      await prisma.testimonial.create({
        data: {
          authorName,
          authorInfo,
          content,
          rating,
          creatorId: (session!.user as any).id
        }
      });
      revalidatePath("/dashboard/testimonials");
    } catch (error) {
      console.error("Failed to create testimonial:", error);
    }
  }

  async function deleteTestimonial(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    
    try {
      await prisma.testimonial.delete({
        where: { id }
      });
      revalidatePath("/dashboard/testimonials");
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Your Testimonials</h2>
        
        {testimonials.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>You haven&apos;t added any testimonials yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="card" style={{ border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{testimonial.authorName}</h3>
                  <span style={{ color: 'var(--primary)' }}>{"★".repeat(testimonial.rating)}{"☆".repeat(5 - testimonial.rating)}</span>
                </div>
                {testimonial.authorInfo && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>{testimonial.authorInfo}</p>
                )}
                <p style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontStyle: 'italic' }}>&quot;{testimonial.content}&quot;</p>
                
                <form action={deleteTestimonial}>
                  <input type="hidden" name="id" value={testimonial.id} />
                  <button type="submit" style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: '500' }}>Delete</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card max-w-2xl">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Add New Testimonial</h2>
        
        <form action={createTestimonial} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="authorName" style={{ fontWeight: '500' }}>Author Name</label>
            <input type="text" id="authorName" name="authorName" required style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="authorInfo" style={{ fontWeight: '500' }}>Author Info (Optional)</label>
            <input type="text" id="authorInfo" name="authorInfo" placeholder="e.g. CEO at TechCorp" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="rating" style={{ fontWeight: '500' }}>Rating</label>
            <select id="rating" name="rating" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="content" style={{ fontWeight: '500' }}>Testimonial Content</label>
            <textarea id="content" name="content" required rows={4} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }} />
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Add Testimonial</button>
        </form>
      </div>
    </div>
  );
}
