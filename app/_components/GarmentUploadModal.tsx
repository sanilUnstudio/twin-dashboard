'use client';
import {
    QueryClient,
} from '@tanstack/react-query'
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { toImageKitUrl } from '@/lib/toImageKitUrl';

const categoryOptions = ['TOP', 'BOTTOM', 'DRESS'];
const genderOptions = ['MALE', 'FEMALE'];

export default function GarmentUploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {

    // Create a client
    const queryClient = new QueryClient()
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [category, setCategory] = useState('TOP');
    const [gender, setGender] = useState('FEMALE');
    const [price, setPrice] = useState('');
    const [name, setName] = useState('');
    const [brandName, setBrandName] = useState('');
    const [steps, setSteps] = useState(0);
    const [loading, setLoading] = useState(false);
    const [buyLink, setBuyLink] = useState('')

    const [loading1, setLoading1] = useState(false)

    const resetForm = () => {
        setSteps(0);
        setImageFile(null);
        setPreviewUrl(null);
        setCategory('TOP');
        setGender('FEMALE');
        setPrice('');
        setBrandName('');
        setName('');
        setBuyLink('');
    };

    const handleImageUpload = async (file: File) => {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = (reader.result as string).split(",")[1];
            setLoading1(true)
            try {
                const res = await axios.post("/api/analyze-garment", { base64Image: base64 });
                console.log("sanil",res)
                // setName(res.data.name);
                setCategory(res.data.type);
                setGender(res.data.gender);
                setSteps(1);
            } catch (err) {
                console.error("Upload error:", err);
            } finally {
                setLoading1(false)
            }
        };

        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!imageFile) return alert('Please upload an image.');

        setLoading(true);

        try {

            // 1. Get presigned URL from server
            const presignRes = await fetch('/api/generate-presigned', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileType: imageFile.type }),
            });

            if (!presignRes.ok) throw new Error('Failed to get presigned URL');
            const { uploadUrl, key } = await presignRes.json();

            // 2. Upload image to S3
            const s3UploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': imageFile.type,
                },
                body: imageFile,
            });

            if (!s3UploadRes.ok) throw new Error('Failed to upload image to S3');

            // 3. Generate image URL (public)
            const s3Url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
            const imageUrl = toImageKitUrl(s3Url);

            // 4. Upload metadata to your DB API
            const formData = new FormData();
            formData.append('imageUrl', imageUrl);
            formData.append('category', category);
            formData.append('gender', gender);
            formData.append('price', price);
            formData.append('brandName', brandName);
            formData.append('name', name);
            formData.append('buyLink', buyLink);

            const res = await fetch('/api/garment', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {

                toast({
                    title: 'Success!',
                    description: 'Garment uploaded successfully.',
                })
                resetForm();
                await queryClient.invalidateQueries({ queryKey: ['all-garments'] })
                onClose();
            } else {
                toast({
                    title: 'Failed!',
                    description: 'Failed to upload garment.',
                })
            }
        } catch (err) {
            console.error(err);
            toast({
                title: 'Failed!',
                description: 'Failed to upload garment.',
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => {
                    resetForm();
                    onClose();
                }}
            >
                <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
                        <Dialog.Title className="text-lg font-medium">Upload Garment</Dialog.Title>

                        {steps === 0 && (
                            !loading1 ? <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(file);
                                }}
                                className="w-full"
                            /> : <h1>Loading...</h1>
                        )}

                        {steps === 1 && (
                            <>
                                {previewUrl && (
                                    <div className="w-full h-64 relative mb-2">
                                        <Image
                                            src={previewUrl}
                                            alt="Preview"
                                            layout="fill"
                                            objectFit="contain"
                                            className="rounded border"
                                        />
                                    </div>
                                )}

                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-2 py-1">
                                    {categoryOptions.map((cat) => (
                                        <option key={cat}>{cat}</option>
                                    ))}
                                </select>

                                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border rounded px-2 py-1">
                                    {genderOptions.map((gen) => (
                                        <option key={gen}>{gen}</option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />

                                <input
                                    type="text"
                                    placeholder="Price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />

                                <input
                                    type="text"
                                    placeholder="Brand Name"
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />

                                <input
                                    type="text"
                                    placeholder="Buy Link"
                                    value={buyLink}
                                    onChange={(e) => setBuyLink(e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />

                                <div className="flex justify-between pt-4">
                                    <button
                                        onClick={resetForm}
                                        className="text-sm px-4 py-2 rounded bg-gray-200 text-black"
                                    >
                                        ← Back to Step 0
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="text-sm px-4 py-2 rounded bg-blue-600 text-white"
                                    >
                                        {loading ? 'Uploading...' : 'Upload'}
                                    </button>
                                </div>
                            </>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition>
    );
}
