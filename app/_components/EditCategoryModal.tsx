'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const EditCategoryModal = ({
  isOpen,
  onClose,
  category,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: any;
}) => {
  const [name, setName] = useState(category?.name || '');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    setName(category?.name || '');
    setError('');
  }, [category]);

  const { mutate: updateCategory, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.put('/api/edit-merch-category', {
        id: category?.id,
        name,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merch-categories'] });
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
          <DialogTitle className="text-xl mb-4">Edit Category</DialogTitle>
        </DialogHeader>

        <Input
          className="text-white bg-gray-900 border-gray-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <Button
          className="mt-4"
          disabled={isPending || name.trim().length === 0}
          onClick={() => updateCategory()}
        >
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;
