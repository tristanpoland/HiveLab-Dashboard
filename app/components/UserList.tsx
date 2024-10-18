// app/components/UserList.tsx
interface User {
  username: string;
}

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  if (!Array.isArray(users)) {
    return <div>No users available</div>;
  }

  if (users.length === 0) {
    return <div>No users found</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <h2 className="text-xl font-semibold mb-4 px-4 py-5 sm:px-6">User List</h2>
      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <li key={user.username} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}