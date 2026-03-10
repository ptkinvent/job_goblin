"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from "@headlessui/react";
import { Bars3Icon, HomeIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function MainColumn({ children }) {
  return (
    <main className="lg:pl-20 h-screen overflow-y-auto dark:bg-secondary-800" id="mainColumn">
      <div className="xl:pl-96">
        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">{children}</div>
      </div>
    </main>
  );
}

export function AsideColumn({ children }) {
  return (
    <aside
      id="chatHistory"
      className="fixed bg-secondary-50 dark:bg-secondary-800 inset-y-0 left-20 hidden w-96 h-full overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block dark:border-white/10"
    >
      {children}
    </aside>
  );
}

export default function TwoColumnLayout({ currentTab, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [{ name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: currentTab === "dashboard" }];

  return (
    <div>
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-800 px-6 pb-2 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <a href="/">
                  <img
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </a>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="-mx-2 flex-1 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={`${
                          item.current
                            ? "bg-white/25 dark:bg-primary-900 text-secondary-50"
                            : "text-secondary-200 hover:bg-white/25 hover:text-secondary-50"
                        } group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold`}
                      >
                        <item.icon aria-hidden="true" className="size-6 shrink-0" />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-primary-950 lg:pb-4 dark:bg-secondary-900 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:border-r dark:before:border-white/10 dark:before:bg-black/10">
        <div className="relative flex h-16 shrink-0 items-center justify-center">
          <a href="/">
            <img
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="h-8 w-auto"
            />
          </a>
        </div>
        <nav className="relative mt-8">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`${
                    item.current ? "bg-white/5 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                  } group flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold`}
                >
                  <item.icon aria-hidden="true" className="size-6 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-primary-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden dark:shadow-none dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:border-b dark:before:border-white/10 dark:before:bg-black/10">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="relative -m-2.5 p-2.5 text-primary-300 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="size-6" />
        </button>
        <div className="relative flex-1 text-sm/6 font-semibold text-white">Dashboard</div>
      </div>

      {children}
    </div>
  );
}
