'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const CreateCategoryModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { mutate: createCategory, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/create-merch-category', { name });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merch-categories'] });
      setName('');
      setError('');
      onClose();
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Something went wrong');
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black text-white border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">Add New Category</DialogTitle>
        </DialogHeader>

        <Input
          className="text-white bg-gray-900 border-gray-700"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <Button
          disabled={isPending || name.trim().length === 0}
          onClick={() => createCategory()}

          className="mt-4 bg-emerald-500 text-black hover:bg-emerald-400 cursor-pointer transition-all transition-duration-200"
        >
          {isPending ? 'Creating...' : 'Create'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;
