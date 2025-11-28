interface Props {
  message: string;
}

export default function ErrorBanner({ message }: Props) {
  if (!message) return null;
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
      <p className="font-medium">Error</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}
