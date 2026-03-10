export default function Stats({ stats, cols = 2, borderColor = "border-none" }) {
  return (
    <dl className={`mx-auto grid gap-px grid-cols-${cols}`}>
      {stats.map((stat, statIdx) => (
        <div
          key={stat.name}
          className={`${borderColor} ${statIdx % cols === 0 ? "" : "border-l"} ${statIdx > cols - 1 ? "border-t" : ""}
            ${
              stat.active
                ? "bg-secondary-200 dark:bg-secondary-900"
                : "bg-transparent " + (stat.onClick ? "hover:bg-secondary-100 dark:hover:bg-secondary-900/50" : "")
            } ${
            stat.onClick ? "cursor-pointer" : ""
          } flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 px-4 py-4 sm:px-6 xl:px-8`}
          onClick={stat.onClick}
        >
          <dt className="text-sm font-medium leading-6 text-secondary-500 flex items-center whitespace-nowrap">
            {stat.color && (
              <div className={`text-${stat.color}-500 bg-${stat.color}-500/15 flex-none rounded-full p-1 mr-1`}>
                <div className="h-2 w-2 rounded-full bg-current" />
              </div>
            )}
            {stat.name}
          </dt>
          <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-zinc-900 dark:text-white">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function StatDescription({ children }) {
  return <span className="text-secondary-300 dark:text-secondary-700 text-xl">{children}</span>;
}
