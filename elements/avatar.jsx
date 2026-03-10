import { Button as HeadlessButton } from '@headlessui/react'
import clsx from 'clsx'
import React from 'react'
import { TouchTarget } from './button'
import { Link } from './link'

export function Avatar({ src = null, square = false, initials, alt = '', className, ...props }) {
  const colors = [
    'bg-red-500/15 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    'bg-orange-500/15 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
    'bg-amber-400/20 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400',
    'bg-yellow-400/20 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-300',
    'bg-lime-400/20 text-lime-700 dark:bg-lime-400/10 dark:text-lime-300',
    'bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400',
    'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    'bg-teal-500/15 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300',
    'bg-cyan-400/20 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300',
    'bg-sky-500/15 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    'bg-blue-500/15 text-blue-700 dark:text-blue-400',
    'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400',
    'bg-violet-500/15 text-violet-700 dark:text-violet-400',
    'bg-purple-500/15 text-purple-700 dark:text-purple-400',
    'bg-fuchsia-400/15 text-fuchsia-700 dark:bg-fuchsia-400/10 dark:text-fuchsia-400',
    'bg-pink-400/15 text-pink-700 dark:bg-pink-400/10 dark:text-pink-400',
    'bg-rose-400/15 text-rose-700 dark:bg-rose-400/10 dark:text-rose-400',
  ];

  return (
    <span
      data-slot="avatar"
      className={clsx(
        className,

        // Basic layout
        'inline-grid align-middle *:col-start-1 *:row-start-1',

        // Color
        initials ? colors[initials.charCodeAt(0) % colors.length] : '',

        // Add the correct border radius
        square ? 'rounded-[20%] *:rounded-[20%]' : 'rounded-full *:rounded-full'
      )}
      {...props}
    >
      {initials && (
        <svg
          className="select-none fill-current text-[48px] font-medium uppercase"
          viewBox="0 0 100 100"
          aria-hidden={alt ? undefined : 'true'}
        >
          {alt && <title>{alt}</title>}
          <text x="50%" y="50%" alignmentBaseline="middle" dominantBaseline="middle" textAnchor="middle" dy=".125em">
            {initials}
          </text>
        </svg>
      )}
      {src && <img src={src} alt={alt} />}
      {/* Add an inset border that sits on top of the image */}
      <span className="ring-1 ring-inset ring-black/5 dark:ring-white/5 forced-colors:outline" aria-hidden="true" />
    </span>
  )
}

export const AvatarButton = React.forwardRef(function AvatarButton(
  { src, square = false, initials, alt, className, ...props },
  ref
) {
  let classes = clsx(
    className,
    square ? 'rounded-lg' : 'rounded-full',
    'relative focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500'
  )

  return 'href' in props ? (
    <Link {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Avatar src={src} square={square} initials={initials} alt={alt} />
      </TouchTarget>
    </Link>
  ) : (
    <HeadlessButton {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Avatar src={src} square={square} initials={initials} alt={alt} />
      </TouchTarget>
    </HeadlessButton>
  )
})
