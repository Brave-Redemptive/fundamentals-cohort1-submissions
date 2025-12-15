import { Skeleton } from "./ui/skeleton";

export default function Loader() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-6 w-[200px]" />
      <Skeleton className="h-4 w-[300px]" />
      <Skeleton className="h-4 w-[250px]" />
    </div>
  );
}
