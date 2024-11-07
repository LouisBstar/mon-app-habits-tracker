import React, { useState, useEffect } from 'react';
import { Menu, Calendar, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";

const weekDays = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const profiles = {
  "Louis": {
    daily: {
      "Routines": [
        { id: 1, name: "Dormir à 23h30" },
        { id: 2, name: "Réveil à 7h30" },
        { id: 3, name: "Routine matinale" },
        { id: 4, name: "Être en avance" },
        { id: 5, name: "Tâche principale" },
        { id: 6, name: "Planifier lendemain" }
      ],
      "Santé": [
        { id: 7, name: "Pas d'alcool" },
        { id: 8, name: "Pas de cigarettes" },
        { id: 9, name: "Pas de CBD" }
      ],
      "Suivi": [
        { id: 10, name: "Tracking" }
      ]
    },
    weekly: {
      "Exercice": [
        { id: 11, name: "Run", weeklyGoal: 3 },
        { id: 12, name: "Salle de sport", weeklyGoal: 3 },
        { id: 13, name: "Se peser", weeklyGoal: 1 }
      ]
    }
  },
  "Charles": {
    daily: {},
    weekly: {}
  }
};

const getWeekKey = (date = new Date()) => {
  const year = date.getFullYear();
  const onejan = new Date(year, 0, 1);
  const weekNumber = Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-${weekNumber.toString().padStart(2, '0')}`;
};

const getMonthKey = (date = new Date()) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

const calculateProgress = (data, habit, type = 'daily') => {
  if (!data) return 0;
  
  if (type === 'weekly') {
    const completedCount = data.filter(day => day === 2).length;
    const partialCount = data.filter(day => day === 1).length * 0.5;
    const baseProgress = Math.round(((completedCount + partialCount) / habit.weeklyGoal) * 100);
    return baseProgress;
  }
  
  const completedCount = data.filter(day => day === 2).length;
  const partialCount = data.filter(day => day === 1).length * 0.5;
  return Math.round(((completedCount + partialCount) / 6) * 100);
};

const SectionTitle = ({ children, type }) => (
  <div className="w-full text-center my-6">
    <h2 className={`inline-block font-bold px-6 py-2 rounded-full ${
      type === 'daily' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
    }`}>
      {children}
    </h2>
  </div>
);

const HabitRow = ({ habit, daysData = Array(7).fill(0), onToggle, type = 'daily' }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-gray-800">{habit.name}</span>
      <span className="text-sm font-medium">
        {calculateProgress(daysData, habit, type)}%
      </span>
    </div>
    <div className="flex gap-1">
      {daysData.map((status, idx) => (
        <button
          key={idx}
          onClick={() => onToggle(habit.id, idx)}
          className={`
            w-full h-8 rounded-sm transition-all
            ${status === 2 ? 'bg-green-400' : 
              status === 1 ? 'bg-orange-400' : 
              'bg-gray-200'}
          `}
        />
      ))}
    </div>
  </div>
);

const CompactMonthView = ({ habit, monthData = Array(31).fill(0), onToggle }) => {
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-800">{habit.name}</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs text-gray-500">{day[0]}</div>
        ))}
        {[...Array(daysInMonth)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => onToggle(habit.id, idx)}
            className={`
              w-full aspect-square rounded-sm transition-all text-xs
              ${monthData[idx] === 2 ? 'bg-green-400' : 
                monthData[idx] === 1 ? 'bg-orange-400' : 
                'bg-gray-200'}
            `}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

const ProfileSidebar = ({ open, onOpenChange, selectedProfile, onSelectProfile }) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetTrigger asChild>
      <button className="p-2">
        <Menu className="w-6 h-6" />
      </button>
    </SheetTrigger>
    <SheetContent side="left" className="w-[250px] sm:w-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Profils</h2>
        <button onClick={() => onOpenChange(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        {Object.keys(profiles).map(profile => (
          <button
            key={profile}
            onClick={() => {
              onSelectProfile(profile);
              onOpenChange(false);
            }}
            className={`w-full text-left px-4 py-2 rounded ${
              selectedProfile === profile ? 'bg-blue-100' : ''
            }`}
          >
            {profile}'s Habits
          </button>
        ))}
      </div>
    </SheetContent>
  </Sheet>
);

const NavigationHeader = ({ viewMode, currentWeekKey, currentDate, onNavigateWeek, onNavigateMonth }) => (
  <div className="text-lg font-medium mb-2">
    {viewMode === 'week' ? (
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => onNavigateWeek(-1)}>&lt;</button>
        <span>Semaine {currentWeekKey.split('-')[1]}</span>
        <button onClick={() => onNavigateWeek(1)}>&gt;</button>
      </div>
    ) : (
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => onNavigateMonth(-1)}>&lt;</button>
        <span>{months[currentDate.getMonth()]}</span>
        <button onClick={() => onNavigateMonth(1)}>&gt;</button>
      </div>
    )}
  </div>
);

const WeekView = ({ profile, weekData, onToggle }) => (
  <>
    <SectionTitle type="daily">Daily Habits</SectionTitle>
    
    <div className="flex gap-1 mb-6">
      {weekDays.map(day => (
        <div key={day} className="flex-1 text-center text-sm text-gray-500">
          {day}
        </div>
      ))}
    </div>

    {Object.entries(profile.daily).map(([category, habits]) => (
      <div key={category} className="mb-8">
        <h3 className="text-lg font-medium mb-4">{category}</h3>
        {habits.map(habit => (
          <HabitRow
            key={habit.id}
            habit={habit}
            daysData={weekData[habit.id] || Array(7).fill(0)}
            onToggle={(habitId, dayIndex) => onToggle(habitId, dayIndex, 'week')}
            type="daily"
          />
        ))}
      </div>
    ))}

    <SectionTitle type="weekly">Weekly Habits</SectionTitle>
    
    {Object.entries(profile.weekly).map(([category, habits]) => (
      <div key={category} className="mb-8">
        <h3 className="text-lg font-medium mb-4">{category}</h3>
        {habits.map(habit => (
          <HabitRow
            key={habit.id}
            habit={habit}
            daysData={weekData[habit.id] || Array(7).fill(0)}
            onToggle={(habitId, dayIndex) => onToggle(habitId, dayIndex, 'week')}
            type="weekly"
          />
        ))}
      </div>
    ))}
  </>
);

const MonthView = ({ profile, monthData, onToggle }) => (
  <div className="space-y-8">
    <SectionTitle type="daily">Daily Habits</SectionTitle>
    {Object.entries(profile.daily).map(([category, habits]) => (
      <div key={category} className="mb-8">
        <h3 className="text-lg font-medium mb-4">{category}</h3>
        {habits.map(habit => (
          <CompactMonthView
            key={habit.id}
            habit={habit}
            monthData={monthData[habit.id] || Array(31).fill(0)}
            onToggle={(habitId, dayIndex) => onToggle(habitId, dayIndex, 'month')}
          />
        ))}
      </div>
    ))}

    <SectionTitle type="weekly">Weekly Habits</SectionTitle>
    {Object.entries(profile.weekly).map(([category, habits]) => (
      <div key={category} className="mb-8">
        <h3 className="text-lg font-medium mb-4">{category}</h3>
        {habits.map(habit => (
          <CompactMonthView
            key={habit.id}
            habit={habit}
            monthData={monthData[habit.id] || Array(31).fill(0)}
            onToggle={(habitId, dayIndex) => onToggle(habitId, dayIndex, 'month')}
          />
        ))}
      </div>
    ))}
  </div>
);
