import PostSkeleton from '@/component/home/PostSkeleton'
import React from 'react'

export default function page() {
  return (
    <div className='justify-center items-center flex flex-col'>
        <PostSkeleton/>
        <PostSkeleton/>
    </div>
  )
}
