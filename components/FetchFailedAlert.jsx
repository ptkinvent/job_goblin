import Alert from "@/elements/alert";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function FetchFailedAlert({ setFetchFailed, className }) {
  return (
    <Alert
      color="danger"
      icon={<ExclamationTriangleIcon className="size-5 text-danger-600" />}
      handleDismiss={() => setFetchFailed(false)}
      className={className}
    >
      Oops, something went wrong.
    </Alert>
  );
}
