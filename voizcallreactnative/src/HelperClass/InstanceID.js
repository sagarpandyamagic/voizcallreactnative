export const generateUniqueId = () => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // Generate a random part to ensure uniqueness
    const randomPart = Math.random().toString(36).substring(2, 8);
  
    // Combine date, time, and random part to create a unique ID
    return `${year}${month}${day}${hours}${minutes}${seconds}-${randomPart}`;
  };