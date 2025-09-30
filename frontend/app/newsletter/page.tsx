"use client"
import React from 'react';
import ArchiveList from '@/components/ArchiveList'
import DraftList from '@/components/DraftList';
import { useAppSelector } from '@/redux/store'


const NewslettersPage = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated)

  return (
    <div>
      {isAuth && (
        <DraftList/> 
      )}
      <ArchiveList/>
    </div>
  )
}

export default NewslettersPage