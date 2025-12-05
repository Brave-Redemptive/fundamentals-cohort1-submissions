interface Props {
  message: string;
}

export default function ErrorBox({ message }: Props) {
  return (
    <p className="text-red-600 bg-red-100 border border-red-300 px-3 py-2 mx-2 rounded mt-3">
      {message}
    </p>
  );
}
