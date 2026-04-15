import React from "react";

const BookingSummary = ({
  difficulty,
  selectedPack,
  onConfirm,
  interviewId,
}) => {
  return (
    <div className="space-y-4">

      {/* Summary Box */}
      <div className="p-4 rounded-xl border bg-gray-50">
        <p className="text-sm text-gray-500">Difficulty</p>
        <p className="font-medium">{difficulty}</p>

        <div className="mt-3">
          <p className="text-sm text-gray-500">Package</p>
          <p className="font-medium">{selectedPack.title}</p>
        </div>

        <div className="mt-3">
          <p className="text-sm text-gray-500">Questions</p>
          <p className="font-medium">{selectedPack.questions}</p>
        </div>
      </div>

      {/* Price */}
      <div className="flex justify-between items-center text-lg font-semibold">
        <span>Total</span>
        <span>₹{selectedPack.price}</span>
      </div>

      {/* Button */}
      <button
        onClick={onConfirm}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Confirm Booking
      </button>

      {interviewId && (
        <p className="text-sm text-green-600 text-center">
          Booked! ID: {interviewId}
        </p>
      )}
    </div>
  );
};

export default BookingSummary;