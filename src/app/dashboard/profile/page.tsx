import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function ProfileSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !(session.user as any)?.id) {
    return null;
  }
  
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id }
  });

  async function updateProfile(formData: FormData) {
    "use server";
    
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const username = formData.get("username") as string;
    
    try {
      await prisma.user.update({
        where: { id: (session?.user as any)?.id },
        data: { name, bio, username: username.toLowerCase().replace(/[^a-z0-9]/g, '') }
      });
      revalidatePath("/dashboard/profile");
      revalidatePath(`/${username}`);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  }

  return (
    <div className="card max-w-2xl">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Profile Settings</h2>
      
      <form action={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="username" style={{ fontWeight: '500' }}>Username (Public URL slug)</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            defaultValue={user?.username || ""} 
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="name" style={{ fontWeight: '500' }}>Display Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            defaultValue={user?.name || ""} 
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="bio" style={{ fontWeight: '500' }}>Bio</label>
          <textarea 
            id="bio" 
            name="bio" 
            defaultValue={user?.bio || ""} 
            rows={4}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
      </form>
    </div>
  );
}
