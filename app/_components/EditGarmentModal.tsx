'use client'
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { toImageKitUrl } from '@/lib/toImageKitUrl';
import { toast } from '@/hooks/use-toast';
import { QueryClient } from '@tanstack/react-query'
import { Loader, Loader2 } from 'lucide-react';
import Select from 'react-select'
interface CategoryOption {
    value: string;
    label: string;
}

export default function EditGarmentModal({ isOpen, onClose, garment }: { isOpen: boolean; onClose: () => void, garment: any }) {

    const [name, setName] = useState(garment.name);
    const [gender, setGender] = useState(garment.gender);
    const [type, setType] = useState(garment.type);
    const [price, setPrice] = useState(garment.price);
    const [brandName, setBrandName] = useState(garment.brandName);
    const [buyLink, setBuyLink] = useState(garment.buyLink);
    const [newImage, setNewImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState(garment.displayUrl);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = new QueryClient();
    const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string }[]>([]);
    const [isLoadingFetchingCategories, setIsLoadingFetchingCategories] = useState(false)
  

    const [selectedOptions, setSelectedOptions] = useState<CategoryOption[]>([]);
    // Convert available categories to react-select format
    const categoryOptions: CategoryOption[] = availableCategories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    // Prefill when modal is opened
    useEffect(() => {
        const preselected = garment?.merchCategories?.map((cat: any) => ({
            value: cat.merchCategory.id,
            label: cat.merchCategory.name,
        })) ?? [];
        setSelectedOptions(preselected);
    }, [garment]);

    // Extract selected category IDs
    const selectedCategoryIds = selectedOptions.map((opt) => opt.value);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoadingFetchingCategories(true)
                const res = await fetch('/api/merch-categories');
                const data = await res.json();
                setAvailableCategories(data.data);
            } catch (err) {
                console.error("Failed to fetch merch categories", err);
            } finally {
                setIsLoadingFetchingCategories(false)
            }
        };

        fetchCategories();
    }, []);


    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            // If change then run this block
            if (newImage) {
                const presignRes = await fetch('/api/generate-presigned', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileType: newImage.type }),
                });

                if (!presignRes.ok) throw new Error('Failed to get presigned URL');
                const { uploadUrl, key } = await presignRes.json();

                // 2. Upload image to S3
                const s3UploadRes = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': newImage.type,
                    },
                    body: newImage,
                });

                if (!s3UploadRes.ok) throw new Error('Failed to upload image to S3');

                // 3. Generate image URL (public)
                const s3Url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
                const imageUrl = toImageKitUrl(s3Url);
                formData.append('imageUrl', imageUrl); // Use uploaded image URL or original
            } else {
                formData.append('imageUrl', imagePreview); // Use uploaded image URL or original
            }


            const categoryIdsOnly = selectedOptions.map(item => item.value);
            formData.append('merchCategoryIds', JSON.stringify(categoryIdsOnly));
            formData.append('gender', gender);
            formData.append('category', type);
            formData.append('brandName', brandName);
            formData.append('price', price.toString());
            formData.append('name', name);
            formData.append('buyLink', buyLink);

            console.log("form data edit", formData);
            const response = await axios.patch(`/api/garment/${garment.id}`, formData);

            if (response.data.success) {
                await queryClient.invalidateQueries({ queryKey: ['all-garments'] })
                console.log("Garment updated successfully", response.data.data);
                toast({
                    title: 'Success!',
                    description: 'Garment updated successfully.',
                })

                onClose();
            } else {
                console.error("Update failed", response.data.message);
                toast({
                    title: 'Failed!',
                    description: 'Garment updated failed.',
                })
            }
        } catch (error) {
            toast({
                title: 'Failed!',
                description: 'Garment updated failed.',
            })
            console.error("Error updating garment", error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-40" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-[#1A1A1A] text-white p-6 shadow-xl border border-gray-700">
                            <Dialog.Title className="text-lg font-semibold mb-4">Edit Garment</Dialog.Title>

                            <div className="flex items-center space-x-4">
                                <div className="relative group">
                                    <img
                                        src={imagePreview}
                                        alt="Garment Preview"
                                        className="w-32 h-32 object-cover rounded bg-gray-800 border border-gray-700"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 cursor-pointer rounded"
                                    >
                                        Change Image
                                    </label>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setNewImage(file);
                                                const reader = new FileReader();
                                                reader.onload = () => setImagePreview(reader.result as string);
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>

                                <div className="flex-1 space-y-3">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full bg-inherit text-white p-2 rounded border border-gray-700"
                                        placeholder="Name"
                                    />

                                    <div className="flex space-x-2">
                                        <select
                                            value={gender}
                                            onChange={e => setGender(e.target.value)}
                                            className="w-1/2 bg-inherit text-white p-2 rounded border border-gray-700"
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>

                                        <select
                                            value={type}
                                            onChange={e => setType(e.target.value)}
                                            className="w-1/2 bg-inherit text-white p-2 rounded border border-gray-700"
                                        >
                                            <option value="TOP">TOP</option>
                                            <option value="BOTTOM">BOTTOM</option>
                                            <option value="DRESS">DRESS</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                <input
                                    type="text"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    className="w-full bg-inherit text-white p-2 rounded border border-gray-700"
                                    placeholder="Price"
                                />
                                <input
                                    type="text"
                                    value={brandName}
                                    onChange={e => setBrandName(e.target.value)}
                                    className="w-full bg-inherit text-white p-2 rounded border border-gray-700"
                                    placeholder="Brand Name"
                                />
                                <input
                                    type="text"
                                    value={buyLink}
                                    onChange={e => setBuyLink(e.target.value)}
                                    className="w-full bg-inherit text-white p-2 rounded border border-gray-700"
                                    placeholder="Buy Link"
                                />

                               {!isLoadingFetchingCategories ?  <Select
                                    isMulti
                                    options={categoryOptions}
                                    value={selectedOptions}
                                    onChange={(newValue) => setSelectedOptions(newValue as CategoryOption[])}
                                    className="basic-multi-select text-black"
                                    classNamePrefix="select"
                                    placeholder="Select categories"
                                /> :
                                    <div className='flex items-center justify-center'>
                                        <Loader2 className='animate-spin' />
                                    </div>
                                }


                                <div className="text-sm text-gray-400 mt-1">
                                    Selected: {selectedCategoryIds.length > 0
                                        ? availableCategories
                                            .filter(cat => selectedCategoryIds.includes(cat.id))
                                            .map(cat => cat.name)
                                            .join(', ')
                                        : 'None'}
                                </div>

                            </div>

                            <div className="mt-6 flex justify-between items-center">
                                <button
                                    onClick={onClose}
                                    className=" px-4 py-2 rounded bg-inherit border text-white transition"
                                >
                                    Cancel
                                </button>

                                {isLoading ?
                                    <button

                                        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
                                    >
                                        <Loader className='animate-spin' />
                                    </button>
                                    : <button
                                        onClick={handleSubmit}
                                        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
                                    >
                                        Save Changes
                                    </button>}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
