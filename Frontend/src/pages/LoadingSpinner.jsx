export default function LoadingSpinner({ fullPage = false, small = false, message }) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullPage ? 'h-screen bg-white' : ''
      } ${small ? 'p-2' : 'py-10'}`}
    >
      <div
        className={`animate-spin rounded-full border-4 border-t-indigo-500 border-gray-300 ${
          small ? 'w-6 h-6' : 'w-12 h-12'
        }`}
      ></div>
      {message && <p className="mt-3 text-sm text-gray-600 text-center">{message}</p>}
    </div>
  );
}
