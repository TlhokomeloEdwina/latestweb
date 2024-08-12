export const users = Array.from({ length: 12 }, (v, k) => {
  const userType = k % 3 === 0 ? "Admin" : "User"; // Example: Assigning user types
  return {
    id: k,
    name: `User ${k + 1}`,
    email: `user${k + 1}@example.com`,
    phone: `123-456-789${k}`,
    address: `Address ${k + 1}`,
    company: `Company ${k + 1}`,
    website: `www.user${k + 1}.com`,
    type: userType,
  };
});
