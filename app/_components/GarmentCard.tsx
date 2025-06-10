import React, { useState } from "react";
import axios from "axios";
import { Trash2 } from 'lucide-react';
import { Loader } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
    QueryClient,
} from '@tanstack/react-query'
import { Eye } from 'lucide-react';

import { SquarePen } from 'lucide-react';
import EditGarmentModal from "./EditGarmentModal";
import GarmentPreviewModal from "./GarmentPreviewModal";
type Garment = {
    id: string;
    displayUrl: string;
    url: string;
    name: string;
    gender: string;
    type: string;
    buyLink: string;
    price: number;
    brandName: string;
};

type GarmentCardProps = {
    garments: Garment[];
};

const GarmentCard: React.FC<GarmentCardProps> = ({ garments }) => {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6 p-4 max-w-[95%] mx-auto">
            {garments.map((garment) => {
                return (<Card key={garment.id} garment={garment} />)
            })}
        </div>
    );
};

export default GarmentCard;


const Card = (garments: any) => {
    let garment = garments.garment;
    const [loading, setLoading] = useState(false);
    const queryClient = new QueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenPreview, setIsOpenPreview] = useState(false);

    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            const res = await axios.delete("/api/garment", {
                params: { id },
            })
            toast({
                title: "Deleted",
                description: 'Garment Deleted.',
            })
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['all-garments'] }),
                queryClient.refetchQueries({ queryKey: ['all-garments'], type: 'active' })
            ]);
        } catch (err) {
            console.log("sanil", err)
            toast({
                title: "Failed",
                description: 'Failed to delete garment.',
            })
        } finally {
            setLoading(false);
        }
    }
    return (
        <div
            key={garment.id}
            className="rounded-xl shadow-md overflow-hidden border-[0.5px] hover:shadow-lg transition bg-black bg-opacity-70 p-1"
        >

            <img
                src={garment.url}
                alt={garment.name}
                className="w-full h-44 object-contain "
            />

            <div className="p-2">
                <div className="flex items-center justify-end gap-2">
                    {!loading ? <Trash2 size={16} onClick={() => handleDelete(garment.id)} color="red" className="cursor-pointer" /> :
                        <Loader size={16} color="red" className="animate-spin" />}
                    <SquarePen onClick={() => setIsOpen(true)} size={16} className="cursor-pointer" />
                    <Eye onClick={() => setIsOpenPreview(true)} size={16} className="cursor-pointer" />
                </div>

                <h2 className="text-sm font-semibold mt-1">{garment.name}</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 capitalize">{garment.type}</p>
                        <p className="text-sm text-gray-500 capitalize">{garment.gender}</p>
                    </div>

                    <p className="text-sm mb-2"> ₹{garment.price || "N/A"}</p>
                </div>
                <p className="text-sm mt-1">Brand: {garment.brandName || "N/A"}</p>

              
            </div>
            {isOpen && <EditGarmentModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                garment={garment}
            />}

            {isOpenPreview && <GarmentPreviewModal
                isOpen={isOpenPreview}
                onClose={() => setIsOpenPreview(false)}
                garment={garment}
            />}
        </div>
    )
}
