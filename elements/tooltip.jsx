export default function Tooltip({ children, title }) {
  return (
    <div className="relative group text-ellipsis whitespace-nowrap">
      {children}
      {title && (
        <span className="absolute pointer-events-none left-1/2 bottom-full mb-1 whitespace-normal -translate-x-1/2 rounded-md bg-secondary-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity delay-150 duration-300 group-hover:opacity-100">
          {title}
        </span>
      )}
    </div>
  );
}
