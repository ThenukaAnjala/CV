export function FormError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-sm text-red-700" id={id} role="alert">
      {message}
    </p>
  );
}
