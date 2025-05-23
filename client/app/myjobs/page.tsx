'use client'

import Header from '@/Components/Header'
import React, { useEffect } from 'react'
import { useJobsContext } from "@/context/jobsContext";
import { useGlobalContext } from '@/context/globalContext';
import { useRouter } from 'next/navigation';
import { Job } from '@/types/types';
import MyJob from '@/Components/JobItem/MyJob';
import Footer from '@/Components/Footer';

function page() {
  const { userJobs, jobs } = useJobsContext();
  const {isAuthenticated, loading, userProfile} = useGlobalContext();

  const [activeTab, setActiveTab] = React.useState('posts');

  const userId = userProfile?.userId;

  const router = useRouter();

  //Redirect to login page if user is not authenticated
  useEffect(() => {
    if(!loading && !isAuthenticated){
      router.push('http://localhost:8080/login');
    }
  }, [isAuthenticated]);

  const likedJobs = jobs.filter((job: Job) => {
    return job.likes.includes(userId);
  });

  if(loading) {
    return null;
  }

  return (
    <div>
        <Header />

        <div className='mt-8 w-[90%] mx-auto flex flex-col'>
          <div className='self-center flex items-center gap-6'>
          <button className={`border border-gray-400 px-8 py-2 rounded-full font-medium cursor-pointer
          ${
            activeTab === "posts"
              ? "border-transparent bg-[#7263F3] text-white"
              : "border-gray-400"
          }`} 
          onClick={() => setActiveTab('posts')}>
              My Job Posts
            </button>
            
            <button className={`border border-gray-400 px-8 py-2 rounded-full font-medium cursor-pointer
          ${
            activeTab === "likes"
              ? "border-transparent bg-[#7263F3] text-white"
              : "border-gray-400"
          }`} 
          onClick={() => setActiveTab('likes')}>
              Liked Jobs
            </button>
          </div>

          {activeTab === 'posts' && userJobs.length === 0 && (
            <div className='mt-8 flex items-center'>
              <p className='text-2xl font-bold'>
                No jobs posted yet.
              </p>
            </div>
          )}

{activeTab === 'likes' && likedJobs.length === 0 && (
            <div className='mt-8 flex items-center'>
              <p className='text-2xl font-bold'>
                No liked jobs yet.
              </p>
            </div>
          )}

          <div className='my-8 grid grid-cols-2 gap-6'>
            {activeTab === 'posts' && userJobs.map((job: Job) => (
              <MyJob key={job._id} job={job} />
            )
            )}

{activeTab === 'likes' && likedJobs.map((job: Job) => (
              <MyJob key={job._id} job={job} />
            )
            )}
          </div>
        </div>
        
        <Footer />
    </div>
  )
}

export default page
