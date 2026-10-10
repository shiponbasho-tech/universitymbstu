const FeatureCard = ({ icon: Icon, title, description, isNew }) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg ${isNew ? "border-4 border-purple-500" : ""}`}
    >
      <div className="flex items-center mb-2">
        <Icon className="text-3xl text-purple-900 mr-2" />
        {isNew && <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-sm font-bold ml-2">New</span>}
      </div>
      <h3 className="text-xl font-semibold text-purple-900 mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  )
}

export default FeatureCard

 