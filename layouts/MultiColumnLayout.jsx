"use client";

import config from "../package.json";
import { Fragment, useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Menu, Transition, TransitionChild } from "@headlessui/react";
import { SwitchField, Switch } from "@/elements/switch";
import { Avatar } from "@/elements/avatar";
import { useTheme } from "next-themes";
import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  HomeIcon,
  ChevronUpDownIcon,
  MoonIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function MultiColumnLayout({ currentTab, children }) {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [{ name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: currentTab === "dashboard" }];

  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 xl:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-secondary-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
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

              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-950 dark:bg-secondary-900 px-6">
                <div className="flex h-16 shrink-0 items-center">
                  <a href="/">
                    <img
                      src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                      className="h-8 w-auto"
                    />
                  </a>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={`${
                                item.current
                                  ? "bg-primary-900 text-secondary-50"
                                  : "text-secondary-400 hover:bg-primary-900 hover:text-secondary-50"
                              } group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold`}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={`${
                                  item.current
                                    ? "text-secondary-50"
                                    : "text-secondary-400 group-hover:text-secondary-50"
                                } size-6 shrink-0`}
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto -mx-6 w-80">
                      <UserMenu user={user} />
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex xl:w-72 lg:w-20 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-secondary-200 dark:border-secondary-900 bg-primary-950 dark:bg-secondary-900 px-6">
            <div className="h-16 shrink-0 items-center lg:hidden xl:flex">
              <a href="/">
                <img
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </a>
            </div>
            <div className="h-16 shrink-0 items-center justify-center hidden lg:flex xl:hidden mt-3">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-info-primary-700 dark:text-secondary-700"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="size-6 text-secondary-500" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={`${
                            item.current
                              ? "bg-primary-900 text-secondary-50"
                              : "text-secondary-400 hover:bg-primary-900 hover:text-secondary-50"
                          } group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold justify-center xl:justify-start`}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={`${
                              item.current ? "text-secondary-50" : "text-secondary-400 group-hover:text-secondary-50"
                            } size-6 shrink-0`}
                          />
                          <span className="hidden xl:inline-block">{item.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto hidden xl:block">
                  <UserMenu user={user} />
                </li>

                <li className="-mx-6 mt-auto xl:hidden">
                  <div className="flex justify-center py-3">
                    <div className="size-8 bg-white dark:bg-secondary-900 rounded-full">
                      <Avatar
                        className="size-8"
                        initials={user?.firstName ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
                      />
                    </div>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Sticky navbar for mobile */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white dark:bg-secondary-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-secondary-700 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6 text-secondary-500" />
          </button>
          <div className="flex-1 text-sm/6 font-semibold text-secondary-900 dark:text-secondary-50">
            <a href="/">{config.name}</a>
          </div>
          <Avatar className="size-8" initials={user?.firstName ? `${user.firstName[0]}${user.lastName[0]}` : "U"} />
        </div>

        {children}
      </div>
    </>
  );
}

function UserMenu({ user }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const darkMode = theme === "dark";

  function handleChangeDarkMode(checked) {
    setTheme(checked ? "dark" : "light");
  }

  return (
    <Menu as="div">
      <Menu.Button className="w-full cursor-pointer relative flex items-center gap-x-4 px-6 py-3 hover:bg-primary-900 data-[active]:bg-primary-900 dark:hover:bg-secondary-950 data-[active]:dark:bg-secondary-950 outline-none">
        <div className="size-8 bg-white dark:bg-secondary-900 rounded-full">
          <Avatar className="size-8" initials={user?.firstName ? `${user.firstName[0]}${user.lastName[0]}` : "U"} />
        </div>
        <div className="flex flex-col text-left flex-grow">
          <span className="block text-secondary-50 text-sm font-medium">
            {user?.firstName ? `${user.firstName} ${user.lastName}` : "User"}
          </span>
        </div>
        <ChevronUpDownIcon className="size-4 stroke-secondary-400" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute overflow-hidden bg-primary-950 dark:bg-secondary-800 bottom-0 left-4 mb-16 z-10 w-64 border border-primary-800 dark:border-secondary-700 origin-bottom rounded-md shadow-lg ring
    -1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <SwitchField className="px-4 py-2">
            <div className="flex items-center gap-3 text-secondary-300 dark:text-white text-sm">
              <MoonIcon className="size-4 stroke-white" /> Dark mode
            </div>
            <Switch color="indigo" name="darkMode" checked={darkMode} onChange={handleChangeDarkMode} />
          </SwitchField>

          <Menu.Item>
            {({ active }) => (
              <SignOutButton>
                <button
                  className={`${
                    active
                      ? "bg-primary-900 text-secondary-50 dark:bg-secondary-900"
                      : "text-secondary-300 dark:text-white"
                  } w-full text-left px-4 py-2 text-sm flex items-center gap-3 dark:text-white`}
                  href="/accounts/logout"
                >
                  <ArrowRightStartOnRectangleIcon className="size-4 stroke-white" />
                  Log out
                </button>
              </SignOutButton>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export function MainColumn({ children, asideWidth = "xl:pr-[28rem] lg:pr-[24rem]", onClick }) {
  return (
    <main className="xl:pl-72 lg:pl-20" onClick={onClick}>
      <div className={asideWidth}>
        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">{children}</div>
      </div>
    </main>
  );
}

export function AsideColumn({ children, asideWidth = "xl:w-[28rem] sm:w-[24rem] w-[20rem]" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <aside
        className={`fixed inset-y-0 right-0 hidden lg:block ${asideWidth} overflow-y-auto border-l border-secondary-200 dark:border-secondary-950 bg-secondary-50 dark:bg-secondary-800 px-8 py-6`}
      >
        {children}
      </aside>

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed lg:hidden cursor-pointer size-8 p-1.5 top-24 right-6 rounded-full border border-secondary-200 bg-secondary-100 text-secondary-500 dark:border-secondary-700 dark:bg-secondary-700 dark:text-secondary-300 shadow"
      >
        <ChevronLeftIcon />
      </button>

      {/* Static slide-over for mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 xl:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-secondary-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterTo="-translate-x-0"
              enterFrom="translate-x-full"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="-translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex sm:max-w-[24em] max-w-[20em] flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute right-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <ChevronRightIcon className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </Transition.Child>
                <aside className="lg-hidden fixed xl:w-[28rem] sm:w-[24rem] w-[20rem] bg-secondary-50 dark:bg-secondary-800 inset-y-0 right-0 overflow-y-auto border-l border-secondary-200 dark:border-secondary-950 px-8 py-6">
                  {children}
                </aside>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
