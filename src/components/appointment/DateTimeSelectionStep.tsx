import React, { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateTimeSelectionStepProps {
  selectedDate: string;
  selectedTime: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
  availableSlots: string[];
}

export const DateTimeSelectionStep: React.FC<DateTimeSelectionStepProps> = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onNext,
  onBack,
  availableSlots
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Takvim oluşturma fonksiyonu
  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendar = [];
    const current = new Date(startDate);

    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      calendar.push(weekDays);
    }

    return calendar;
  };

  // Tarih seçimi işlemi
  const handleDateSelect = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return; // Geçmiş tarihleri seçilemez
    
    const dateString = date.toISOString().split('T')[0];
    onDateSelect(dateString);
  };

  const calendar = generateCalendar(selectedMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Tarih ve Saat Seçin
      </h2>

      {/* Takvim */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              const newMonth = new Date(selectedMonth);
              newMonth.setMonth(newMonth.getMonth() - 1);
              setSelectedMonth(newMonth);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
          </h3>
          <button
            onClick={() => {
              const newMonth = new Date(selectedMonth);
              newMonth.setMonth(newMonth.getMonth() + 1);
              setSelectedMonth(newMonth);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendar.map((week, weekIndex) =>
            week.map((date, dayIndex) => {
              const isToday = date.toDateString() === today.toDateString();
              const isSelected = date.toISOString().split('T')[0] === selectedDate;
              const isPast = date < today;
              const isCurrentMonth = date.getMonth() === selectedMonth.getMonth();

              return (
                <button
                  key={`${weekIndex}-${dayIndex}`}
                  onClick={() => handleDateSelect(date)}
                  disabled={isPast}
                  className={`p-2 text-sm rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-sage-500 text-white'
                      : isToday
                      ? 'bg-sage-100 dark:bg-sage-900 text-sage-800 dark:text-sage-200'
                      : isPast
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : isCurrentMonth
                      ? 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      : 'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Saat seçimi */}
      {selectedDate && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Müsait Saatler
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map((time) => (
              <button
                key={time}
                onClick={() => onTimeSelect(time)}
                className={`p-3 text-sm rounded-lg border transition-colors ${
                  selectedTime === time
                    ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/20 text-sage-700 dark:text-sage-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-sage-300'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Geri
        </button>
        <button
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          className="flex-1 bg-sage-600 hover:bg-sage-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Devam Et
        </button>
      </div>
    </div>
  );
};