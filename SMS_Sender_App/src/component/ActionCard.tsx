type Props = {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

function ActionCard({ title, icon, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 
                 shadow-sm hover:shadow-xl transition-all duration-300 
                 hover:-translate-y-1"
    >
      {/* Icon */}
      <div
        className="w-12 h-12 flex items-center justify-center rounded-xl 
                      bg-gray-100 text-gray-700 
                      group-hover:bg-blue-50 group-hover:text-blue-600 
                      transition"
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className="mt-4 text-sm font-semibold text-gray-800 
                     group-hover:text-gray-900"
      >
        {title}
      </h3>
    </div>
  );
}

export default ActionCard;
