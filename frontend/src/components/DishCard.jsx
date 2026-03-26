import VegBadge from "./VegBadge";

export default function DishCard({ dish, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {dish.image && (
        <img src={dish.image} alt={dish.dishName} className="w-full h-40 object-cover" />
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{dish.dishName}</h3>
          <VegBadge isVeg={dish.isVeg} />
        </div>
        {dish.description && <p className="text-sm text-gray-500 line-clamp-2">{dish.description}</p>}
        <div className="flex items-center justify-between pt-1">
          <span className="text-primary font-bold text-lg">₹{dish.price}</span>
          {dish.category && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{dish.category}</span>
          )}
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2 border-t border-gray-50">
            {onEdit && (
              <button
                onClick={() => onEdit(dish)}
                className="flex-1 text-sm font-medium text-primary hover:bg-orange-50 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(dish._id)}
                className="flex-1 text-sm font-medium text-red-500 hover:bg-red-50 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
