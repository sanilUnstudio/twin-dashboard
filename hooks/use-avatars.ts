// hooks/useAvatars.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export const useAvatars = () =>
    useQuery({
        queryKey: ['avatars'],
        queryFn: async () => {
            const res = await fetch('/api/avatar');
            if (!res.ok) throw new Error('Failed to fetch avatars');
            return res.json();
        },
    });

export const useDeleteAvatar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/avatar/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete avatar');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['avatars'] });
            toast({
                title: 'Success!',
                description: 'User Deleted successfully.',
            });
        },
    });
};
