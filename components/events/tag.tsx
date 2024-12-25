export default function Tag({ tag }: { tag: string }) {
  return (
    <div className="inline-block px-3 py-1 font-semibold text-center text-black bg-gradient-to-br from-[#1F2833] via-[#45A29E] to-[#66FCF1] rounded-full shadow-md hover:shadow-lg transition-all duration-300">
      {tag}
    </div>
  );
}
