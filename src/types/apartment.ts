export type Apartment = {
  id: string;
  name: string;
  operator: string;
  address: string;
  suburb: string;
  roomType: string;
  /** Walking time to Melbourne Business School (200 Leicester St, Carlton), in minutes. */
  walkMinutes: number;
  /** Weekly rent in AUD. */
  weeklyRent: number;
  billsIncluded: boolean;
  facilities: string[];
  vibe: string;
  previouslyStayed: boolean;
  rating: number;
  availability: string;
};
