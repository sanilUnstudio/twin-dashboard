"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2 } from "lucide-react";
import CreateCategoryModal from "../_components/CreateCategoryModal";
import EditCategoryModal from "../_components/EditCategoryModal";

const fetchCategories = async () => {
  const response = await axios.get("/api/merch-categories");
  return response.data;
};

const deleteCategory = async (id: string) => {
  const response = await axios.delete(`/api/delete-merch-category?id=${id}`);
  return response.data;
};

const CategoryPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["merch-categories"],
    queryFn: fetchCategories,
  });

  const queryClient = useQueryClient();
  const { mutate: deleteCategory, isPending } = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id); // <- Set current deleting ID
      await axios.delete(`/api/delete-merch-category?id=${id}`);
    },
    onSuccess: () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['all-garments'] }),
        queryClient.refetchQueries({ queryKey: ['all-garments'], type: 'active' })
      ]);
    },
    onSettled: () => {
      setDeletingId(null); // <- Clear it regardless of success/fail
    },
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="p-6 text-white min-h-screen bg-black">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Categories</h1>
        <Button
          variant="outline"
          className="text-black"
          onClick={() => setCreateModalOpen(true)}
        >
          + Add Category
        </Button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Slug</th>
              <th className="text-left py-2">Garments</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={4} className="py-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              : data?.data?.map((cat: any) => (
                  <tr
                    key={cat.id}
                    className="border-b border-gray-800 hover:bg-gray-900"
                  >
                    <td className="py-3 font-medium">{cat.name}</td>
                    <td className="text-gray-400">{cat.slug}</td>
                    <td className="text-gray-300">{cat.garmentCount}</td>
                    <td className="flex gap-2 mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setEditModalOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === cat.id}
                        onClick={() => deleteCategory(cat.id)}
                      >
                        {deletingId === cat.id ? (
                          <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full mr-1" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <CreateCategoryModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <EditCategoryModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
};

export default CategoryPage;
