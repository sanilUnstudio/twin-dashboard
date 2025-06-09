'use client';
import {
  useQuery,
} from '@tanstack/react-query';
import axios from "axios";
import GarmentCard from '../_components/GarmentCard';
import React, { useState } from 'react'
import GarmentUploadModal from '../_components/GarmentUploadModal';
import { Button } from '@/components/ui/button';


const getGarment = async () => {
  const response = await axios('/api/garment');
  return response.data
}


const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['all-garments'], queryFn: getGarment })

  if (isLoading) {
    return (
      <div className='h-screen w-screen flex justify-center items-center bg-black  text-white'>
        <h1>Loading....</h1>
      </div>

    )
  }


  return (
    <div className='p-4 bg-black  text-white'>
      <div className='flex justify-between items-center'>
        <h1 className='text-center text-2xl' >Garments</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
        >Add Garment
        </Button>
      </div>

      <div className='h-[93vh]  overflow-auto'>
        {data && <GarmentCard garments={data.data} />}
      </div>

      <GarmentUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default Page