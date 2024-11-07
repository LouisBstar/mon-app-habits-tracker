const HabitTracker = () => {
  const [viewMode, setViewMode] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeekKey, setCurrentWeekKey] = useState(getWeekKey());
  const [currentMonthKey, setCurrentMonthKey] = useState(getMonthKey());
  const [selectedProfile, setSelectedProfile] = useState('Louis');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [habitHistory, setHabitHistory] = useState(() => {
    const initialHistory = {
      weeks: {},
      months: {}
    };
    
    initialHistory.weeks[currentWeekKey] = {};
    initialHistory.months[currentMonthKey] = {};
    
    Object.values(profiles).forEach(profile => {
      Object.values(profile.daily).forEach(category => {
        category.forEach(habit => {
          initialHistory.weeks[currentWeekKey][habit.id] = Array(7).fill(0);
          initialHistory.months[currentMonthKey][habit.id] = Array(31).fill(0);
        });
      });
      Object.values(profile.weekly).forEach(category => {
        category.forEach(habit => {
          initialHistory.weeks[currentWeekKey][habit.id] = Array(7).fill(0);
          initialHistory.months[currentMonthKey][habit.id] = Array(31).fill(0);
        });
      });
    });
    
    return initialHistory;
  });

  useEffect(() => {
    const weekKey = getWeekKey(currentDate);
    const monthKey = getMonthKey(currentDate);
    
    setCurrentWeekKey(weekKey);
    setCurrentMonthKey(monthKey);
    
    setHabitHistory(prev => {
      const newHistory = { ...prev };
      
      if (!newHistory.weeks[weekKey]) {
        newHistory.weeks[weekKey] = {};
      }
      
      if (!newHistory.months[monthKey]) {
        newHistory.months[monthKey] = {};
      }
      
      Object.values(profiles).forEach(profile => {
        Object.values(profile.daily).forEach(category => {
          category.forEach(habit => {
            if (!newHistory.weeks[weekKey][habit.id]) {
              newHistory.weeks[weekKey][habit.id] = Array(7).fill(0);
            }
            if (!newHistory.months[monthKey][habit.id]) {
              newHistory.months[monthKey][habit.id] = Array(31).fill(0);
            }
          });
        });
        Object.values(profile.weekly).forEach(category => {
          category.forEach(habit => {
            if (!newHistory.weeks[weekKey][habit.id]) {
              newHistory.weeks[weekKey][habit.id] = Array(7).fill(0);
            }
            if (!newHistory.months[monthKey][habit.id]) {
              newHistory.months[monthKey][habit.id] = Array(31).fill(0);
            }
          });
        });
      });
      
      return newHistory;
    });
  }, [currentDate]);

  const calculateOverallProgress = () => {
    const currentProfile = profiles[selectedProfile];
    if (!currentProfile) return 0;
    
    const dailyHabits = Object.values(currentProfile.daily).flat();
    const weekly

    <h1>Hello World</h1>
