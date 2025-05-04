"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  LayoutDashboard,
  List,
  Menu,
  PanelLeft,
  Plus,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from '@/components/theme-toggle';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const { openAddTaskDialog } = useAppContext();
  const pathname = usePathname();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'List View', href: '/list', icon: List },
    { name: 'Board View', href: '/board', icon: PanelLeft },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="hidden md:flex">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/logo.svg" 
                alt="TaskFlow Logo" 
                width={32} 
                height={32} 
                className="rounded-lg"
              />
              <span className="text-xl font-bold">TaskFlow</span>
            </Link>
          </div>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:w-80">
              <div className="flex flex-col space-y-4 py-4">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 px-2"
                  onClick={() => document.body.classList.remove('overflow-hidden')}
                >
                  <Image 
                    src="/logo.svg" 
                    alt="TaskFlow Logo" 
                    width={32} 
                    height={32} 
                    className="rounded-lg"
                  />
                  <span className="text-xl font-bold">TaskFlow</span>
                </Link>
                <div className="flex flex-col space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => document.body.classList.remove('overflow-hidden')}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="hidden md:flex md:items-center md:gap-4 md:px-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1"
            onClick={openAddTaskDialog}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;