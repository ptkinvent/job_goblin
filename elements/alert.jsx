import { XMarkIcon } from "@heroicons/react/20/solid";

export default function Alert({ color, className, icon, rounded = true, children, handleDismiss }) {
  return (
    <div
      className={`${
        rounded ? "rounded-md" : "border-l-4 border-" + color + "-400 dark:border-" + color + "-950"
      } bg-${color}-50 dark:bg-${color}-900 p-4 ${className || ""}`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className={`${icon ? "ml-3" : ""} text-sm text-${color}-700 dark:text-white w-full`}>{children}</div>
        {handleDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 text-${color}-500 hover:bg-${color}-100 focus:outline-none focus:ring-2 focus:ring-${color}-600 focus:ring-offset-2 focus:ring-offset-${color}-50`}
                onClick={() => handleDismiss()}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
