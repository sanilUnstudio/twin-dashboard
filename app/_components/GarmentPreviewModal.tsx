'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ExternalLink } from 'lucide-react';

export default function GarmentPreviewModal({
    isOpen,
    onClose,
    garment,
}: {
    isOpen: boolean;
    onClose: () => void;
    garment: {
        displayUrl: string;
        name: string;
        gender: string;
        type: string;
        price: string;
        brandName: string;
        merchCategories: any[];
        buyLink?: string;
    };
    }) {
    console.log("sanil",garment)
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <div className="fixed inset-0 bg-black bg-opacity-30" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-6">
                        <Dialog.Panel className="w-[80%] max-w-3xl transform overflow-hidden rounded-2xl bg-neutral-900 text-white p-6 shadow-xl transition-all">
                            <Dialog.Title className="text-2xl font-bold mb-6">Garment Preview</Dialog.Title>

                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Large Image */}
                                <div className="md:w-1/2 w-full flex justify-center ">
                                    <img
                                        src={garment.displayUrl}
                                        alt={garment.name}
                                        className="w-full max-w-md rounded-xl object-contain"
                                    />
                                </div>

                                {/* Info */}
                                <div className="md:w-1/2 w-full space-y-4 text-base">
                                    <div>
                                        <div className="text-sm text-gray-400">Name</div>
                                        <div>{garment.name}</div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div>
                                            <div className="text-sm text-gray-400">Gender</div>
                                            <div>{garment.gender}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Type</div>
                                            <div>{garment.type}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-400">Price</div>
                                        <div>{garment.price}</div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-400">Brand Name</div>
                                        <div>{garment.brandName}</div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-400">Categories</div>
                                        <div>{garment.merchCategories?.map((cat) => cat.merchCategory?.name).join(", ") || "Uncategorized"}</div>
                                    </div>

                                    {garment.buyLink && (
                                        <div>
                                            <div className="text-sm text-gray-400">Purchase Link</div>
                                            <a
                                                href={garment.buyLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400"
                                            >
                                               <ExternalLink size={14}/>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 text-right">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
