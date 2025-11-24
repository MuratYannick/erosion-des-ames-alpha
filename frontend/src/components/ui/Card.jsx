const Card = ({ title, children, className = '', headerClassName = '' }) => {
  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-xl ${className}`}
    >
      {title && (
        <div className={`px-6 py-4 border-b border-gray-700/50 ${headerClassName}`}>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
