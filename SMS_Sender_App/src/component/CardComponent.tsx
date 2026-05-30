type CardProps = {
  title: string;
  subtitle: string;
  icon: string;
};

function CardComponent({ title, subtitle, icon }: CardProps) {
  return (
    <div className="m-3 cursor-pointer w-xl p-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center gap-3">
      {/* Icon */}
      <div className="text-4xl">{icon}</div>

      {/* Title */}
      <div className="font-semibold text-gray-800 text-lg">{title}</div>

      {/* Subtitle */}
      <div className="text-gray-500 text-sm">{subtitle}</div>
    </div>
  );
}

export default CardComponent;
