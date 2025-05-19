import React from 'react'
import LinkList from './LinkList'

export default function MobileBar() {
  return (
    <div className='fixed md:hidden bottom-0 left-0 w-screen bg-black z-50 px-4 py-2 border-t border-t-white/15'>
        <LinkList/>
    </div>
  )
}
