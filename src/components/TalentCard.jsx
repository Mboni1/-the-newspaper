const TalentCard = ({ id, name, age, sport, position, image, onClick, compact = false }) => {
  return (
    <div 
      onClick={() => onClick({ id, name, age, sport, position, image })}
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
        compact ? 'flex items-center gap-4 p-3' : 'block'
      }`}
    >
      {compact ? (
        <>
          <img src={image} alt={name} className="w-20 h-20 object-cover rounded" />
          <div className="flex-1">
            <h3 className="font-bold">{name}, {age}</h3>
            <p className="text-sm text-gray-600 capitalize">{sport} • {position}</p>
          </div>
        </>
      ) : (
        <>
          <img src={image} alt={name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-bold">{name}, {age}</h3>
            <p className="text-gray-600 capitalize">{sport} • {position}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default TalentCard;