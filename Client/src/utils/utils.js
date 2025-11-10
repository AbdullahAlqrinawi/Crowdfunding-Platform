// Returns the number of days left until a given deadline
export const daysLeft = (deadline) => {
    const now = new Date();
    const endDate = new Date(deadline);
    const timeDiff = endDate - now;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };
  
  // Returns the percentage of raised amount relative to the goal
  export const inPercent = (goal, raisedAmount) => {
    if (!goal || goal === 0) return 0;
    const percent = (raisedAmount / goal) * 100;
    return Math.min(percent.toFixed(2), 100); // limit to 100%
  };
  