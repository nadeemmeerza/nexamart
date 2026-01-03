// app/profile.tsx
import { auth } from '../auth';
import ProfileContent from './ProfileContent';


export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please sign in to view your profile</h1>
        </div>
      </div>
    );
  }

  return <ProfileContent/>
}

