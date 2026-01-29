export default function NotificationBar() {
  return (
    <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center py-2.5 px-4">
      <p className="text-sm font-medium">
        🎉 <strong>Beta Launch Special:</strong> First 1,000 creators get lifetime pro features • 
        <a href="/signup" className="underline ml-2 hover:text-pink-200 transition">Join Now →</a>
      </p>
    </div>
  );
}