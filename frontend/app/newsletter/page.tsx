"use client"
import React, { useState, useEffect } from 'react';
import ArchiveList from '@/components/ArchiveList'
import DraftList from '@/components/DraftList';


const NewslettersPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  useEffect(() => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    }, []);

  return (
    <div>
      {isLoggedIn && (
        <DraftList/> 
      )}
      <ArchiveList/>
    </div>
  )
}

export default NewslettersPage