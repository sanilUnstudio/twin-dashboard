'use client';

import { useAvatars, useDeleteAvatar } from '@/hooks/use-avatars';

export default function Page() {
    const { data: avatars, isLoading, error } = useAvatars();
    const deleteMutation = useDeleteAvatar();

    if (isLoading) return (
        <div className='w-screen h-screen flex justify-center items-center bg-gray-900 text-white'>
            <p>Loading...</p>
        </div>
    );
    if (error) return <p>Error loading avatars</p>;

    return (
        <div className="bg-gray-900 min-h-screen text-white py-4">
            <h1 className="text-2xl font-bold mb-6 text-center text-white">Avatar Dashboard</h1>

            <table className="table-auto border-collapse w-[95%] mx-auto text-left">
                <thead>
                    <tr className="bg-gray-800 text-gray-300">
                        <th className="border border-gray-700 p-2">User ID</th>
                        <th className="border border-gray-700 p-2">Email</th>
                        <th className="border border-gray-700 p-2">Gender</th>
                        <th className="border border-gray-700 p-2">No. of Images</th>
                        <th className="border border-gray-700 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {avatars.map((avatar: any) => (
                        <tr key={avatar.id} className="hover:bg-gray-800">
                            <td className="border border-gray-700 p-2">{avatar.userId}</td>
                            <td className="border border-gray-700 p-2">{avatar.email}</td>
                            <td className="border border-gray-700 p-2">{avatar.gender}</td>
                            <td className="border border-gray-700 p-2">{avatar.numberOfImages}</td>
                            <td className="border border-gray-700 p-2">
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                    onClick={() => deleteMutation.mutate(avatar.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
