"use client";

import Header from '@/Components/Header'
import JobForm from '@/Components/JobPost/JobForm'
import { useGlobalContext } from '@/context/globalContext';
import router, { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function page() {

  const { isAuthenticated, loading} = useGlobalContext();
  const router = useRouter();

  //Redirect to login page if user is not authenticated
  useEffect(() => {
    if(!loading && !isAuthenticated){
      router.push('http://localhost:8080/login');
    }
  }, [isAuthenticated]);
    

  return (
    <div>
        <Header />

        <h2 className='flex-1 pt-8 mx-auto w-[90%] text-3xl font-bold text-black'>
          Create a Job Post
        </h2>

        <div className='flex-1 pt-8 mx-auto w-[90%] flex justify-center items-center'>
          <JobForm />
        </div>
    </div>
  )
}

export default page