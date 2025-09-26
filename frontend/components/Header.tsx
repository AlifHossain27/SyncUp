"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Bot } from 'lucide-react';
import { toast } from "sonner"
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { logIn, logOut } from '@/redux/features/auth-slice'

const Header = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated)

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const logout = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    toast("Logged out")
    dispatch(logOut())
    setIsSheetOpen(false)
    router.push('/')
  }


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/user/me/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
        if (resp.ok) {
          dispatch(logIn())
        } else {
          dispatch(logOut())
        }
      } catch {
        console.log('connection failed')
      }
    })()
  }, [dispatch, API_BASE_URL])

  const navLinks = [
    { href: '/newsletter/', label: 'Newsletters' },
    { href: '/about', label: 'About Us' },
  ];

  const adminNavLinks = [
    { href: '/newsletter/', label: 'Newsletter' },
    { href: '/subscribers/', label: 'Subscribers' },
    { href: '/profile/', label: 'Profile' },
  ];

  const linksToShow = isAuth ? adminNavLinks : navLinks;

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-sm border-b border-border' : 'bg-transparent'}`}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
          <Bot className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold font-headline text-foreground">SyncUp</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {linksToShow.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
          {isAuth && (
            <Button variant="destructive" className="text-sm" onClick={logout}>
              Logout
            </Button>
          )}
        </nav>
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 mb-4" onClick={() => setIsSheetOpen(false)}>
                  <Bot className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold font-headline text-foreground">SyncUp</span>
                </Link>
                {linksToShow.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg font-medium text-foreground transition-colors hover:text-accent" onClick={() => setIsSheetOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                {isAuth && (
                  <Button variant="destructive" className="text-sm" onClick={logout}>
                    Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;