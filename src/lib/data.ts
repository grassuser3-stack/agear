// NIC — Mock Data Store
// Design: Warm Intelligence — navy authority, cream warmth, indigo AI

export interface Client {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  age: number;
  occupation: string;
  email: string;
  phone: string;
  policies: number;
  aum: number; // Assets under management in SGD
  lastMeeting: string;
  nextMeeting?: string;
  tags: string[];
  backgroundInfo: BackgroundInfo;
  meetingHistory: Meeting[];
}

export interface BackgroundInfo {
  summary: string;
  family: FamilyMember[];
  importantDates: ImportantDate[];
  interests: string[];
  concerns: string[];
  notes: string[];
}

export interface FamilyMember {
  name: string;
  relation: string;
  age?: number;
  dob?: string; // ISO date string
  notes?: string;
}

export interface ImportantDate {
  label: string;
  date: string; // ISO date string
  type: "birthday" | "anniversary" | "graduation" | "other";
  message?: string; // Personalized message for FA to copy-paste
  giftSuggestions?: GiftSuggestion[];
}

export interface GiftSuggestion {
  name: string;
  url: string;
  reason: string; // Why this is suggested based on client interests
}

export interface Meeting {
  id: string;
  date: string;
  duration: string;
  summary: string;
  topics: string[];
  actionItems: string[];
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  time: string; // e.g. "10:30 AM"
  date: string; // e.g. "2026-06-23"
  duration: string;
  type: string;
  location: string;
  status: "upcoming" | "in-progress" | "done";
  isNext?: boolean;
}

export interface Todo {
  id: string;
  text: string;
  clientId?: string;
  clientName?: string;
  priority: "high" | "medium" | "low";
  done: boolean;
  dueDate?: string;
}

// ─── CLIENTS ──────────────────────────────────────────────────────────────────

export const clients: Client[] = [
  {
    id: "c1",
    name: "Chase Lim",
    avatar: "",
    initials: "CL",
    age: 42,
    occupation: "Senior Director, DBS Bank",
    email: "chase.lim@email.com",
    phone: "+65 9123 4567",
    policies: 7,
    aum: 1_250_000,
    lastMeeting: "2026-03-15",
    nextMeeting: "2026-07-03T10:30:00",
    tags: ["High Value", "Investment", "Insurance"],
    backgroundInfo: {
      summary:
        "Chase is a high-net-worth client focused on wealth preservation and legacy planning. He is meticulous and appreciates data-driven recommendations. Recently promoted to Senior Director, which has increased his disposable income significantly.",
      family: [
        { name: "Linda Tan", relation: "Wife", age: 40, notes: "Stay-at-home mother, interested in education endowment plans" },
        {
          name: "Anne Lim",
          relation: "Daughter",
          age: 0,
          dob: "2026-01-03",
          notes: "Born January 3, 2026, 6 months old as of July 3, 2026. First child.",
        },
      ],
      importantDates: [
        {
          label: "Wedding Anniversary",
          date: "2026-08-12",
          type: "anniversary",
          message: "Happy 21st wedding anniversary, Chase & Linda! Wishing you both continued joy and wonderful memories together.",
          giftSuggestions: [
            { name: "Ritz-Carlton Spa Package", url: "https://www.ritzcarlton.com/en/hotels/singapore", reason: "Couples spa retreat for relaxation" },
            { name: "Michelin-Starred Dinner at Odette", url: "https://www.odetterestaurant.com", reason: "Fine dining experience matching his interest" },
            { name: "Japan Airlines First Class Upgrade", url: "https://www.jal.co.jp", reason: "Travel to Japan is on his interests list" },
          ],
        },
        {
          label: "Anne's Birthday",
          date: "2027-01-03",
          type: "birthday",
          message: "Happy 1st birthday to Anne! What an amazing year watching her grow. Wishing her health, happiness, and endless adventures ahead!",
          giftSuggestions: [
            { name: "Steiff Teddy Bear", url: "https://www.steiff.com", reason: "Premium collectible toy for milestone birthday" },
            { name: "Personalized Baby Book", url: "https://www.minted.com/baby-books", reason: "Keepsake for family memories" },
            { name: "Educational Toy Set", url: "https://www.lovevery.com", reason: "Developmental toys for toddlers" },
          ],
        },
        {
          label: "Chase's Birthday",
          date: "2026-03-22",
          type: "birthday",
          message: "Happy birthday, Chase! Wishing you a fantastic year ahead filled with great moments on the golf course, amazing meals, and exciting travels!",
          giftSuggestions: [
            { name: "Golf Membership at Sentosa Golf Club", url: "https://www.sentosagolf.com", reason: "Premium golf experience matching his passion" },
            { name: "Formula 1 Singapore GP VIP Tickets", url: "https://www.singaporegp.sg", reason: "F1 fan experience" },
            { name: "Japanese Whisky Collection", url: "https://www.masterofmalt.com", reason: "Premium spirits for fine dining enthusiast" },
          ],
        },
      ],
      interests: ["Golf", "Fine dining", "Travel to Japan", "Formula 1"],
      concerns: [
        "Education fund for Anne",
        "Retirement planning at 55",
        "Estate planning & will",
        "Mortgage on Buona Vista condo",
      ],
      notes: [
        "Prefers morning meetings, dislikes calls after 6pm",
        "Very analytical — always bring charts and numbers",
        "Mentioned considering a second property investment in Q3 2026",
        "Wife Linda is expecting to return to work part-time in 2027",
      ],
    },
    meetingHistory: [
      {
        id: "m1",
        date: "2026-03-15",
        duration: "60 min",
        summary:
          "Reviewed existing portfolio. Chase expressed interest in increasing equity exposure. Chase showed curiosity in Integrated Shield Plan for the family. Anne was 2 months old at the time — Chase was sleep-deprived but in good spirits.",
        topics: ["Portfolio review", "Possible interest in ISP", "Education endowment intro"],
        actionItems: [
          "Send ISP comparison table for family plan",
          "Prepare education endowment illustration for 18-year plan",
          "Follow up on will drafting referral",
        ],
      },
      {
        id: "m2",
        date: "2025-11-20",
        duration: "45 min",
        summary:
          "Annual review. Linda was pregnant (due Jan 2026). Chase wanted to review life insurance coverage before baby arrives. Increased sum assured on his term plan.",
        topics: ["Annual review", "Life insurance top-up", "Maternity planning"],
        actionItems: [
          "Process term plan top-up application",
          "Send newborn coverage options",
        ],
      },
      {
        id: "m3",
        date: "2025-08-05",
        duration: "75 min",
        summary: "Portfolio rebalancing review. Discussed increasing equity allocation from 60% to 70%. Chase approved new investment strategy.",
        topics: ["Portfolio rebalancing", "Equity allocation", "Risk profile review"],
        actionItems: ["Execute rebalancing", "Send updated portfolio statement"],
      },
    ],
  },
  {
    id: "c2",
    name: "Priya Nair",
    avatar: "",
    initials: "PN",
    age: 35,
    occupation: "Marketing Director, Unilever",
    email: "priya.nair@email.com",
    phone: "+65 8765 4321",
    policies: 4,
    aum: 680_000,
    lastMeeting: "2026-04-22",
    tags: ["Growing Wealth", "Career-focused", "Insurance"],
    backgroundInfo: {
      summary: "Priya is a career-focused professional with growing income. She is detail-oriented and values efficiency. Recently got engaged.",
      family: [
        { name: "Arjun Sharma", relation: "Fiancé", age: 36, notes: "Works in tech, getting married in Dec 2026" },
      ],
      importantDates: [
        {
          label: "Engagement Party",
          date: "2026-07-10",
          type: "other",
          message: "Congratulations on your engagement, Priya! Wishing you and Arjun a beautiful journey ahead filled with love and happiness!",
          giftSuggestions: [
            { name: "Luxury Dinner at Burnt Ends", url: "https://burntends.com.sg/reservations/", reason: "Celebration dinner for special occasion" },
            { name: "Personalized Engagement Ring Box", url: "https://www.etsy.com", reason: "Keepsake for the engagement" },
            { name: "Couples Getaway Package", url: "https://www.airbnb.com", reason: "Romantic escape for engaged couples" },
          ],
        },
        {
          label: "Wedding Day",
          date: "2026-12-12",
          type: "other",
          message: "Happy wedding day, Priya & Arjun! Wishing you both a lifetime of love, laughter, and wonderful adventures together!",
          giftSuggestions: [
            { name: "Luxury Honeymoon Package", url: "https://www.travelocity.com", reason: "Dream honeymoon destination" },
            { name: "Premium Home Decor Set", url: "https://www.westelm.com", reason: "For their new home together" },
            { name: "Engraved Crystal Champagne Flutes", url: "https://www.tiffany.com", reason: "Elegant wedding keepsake" },
          ],
        },
        {
          label: "Priya's Birthday",
          date: "1991-05-18",
          type: "birthday",
          message: "Happy birthday, Priya! Wishing you a wonderful year filled with career achievements, beautiful moments with Arjun, and exciting adventures!",
          giftSuggestions: [
            { name: "Luxury Skincare Set", url: "https://www.spacenk.com", reason: "Premium self-care products" },
            { name: "Designer Handbag", url: "https://www.farfetch.com", reason: "Luxury fashion for career professional" },
            { name: "Weekend Spa Retreat", url: "https://www.capella.com", reason: "Relaxation and wellness experience" },
          ],
        },
      ],
      interests: ["Travel", "Yoga", "Cooking", "Fashion"],
      concerns: ["Wedding planning", "Joint financial planning with Arjun", "Career progression", "Investment diversification"],
      notes: ["Very organized, prefers email communication", "Busy schedule — prefers afternoon meetings", "Interested in sustainable investments"],
    },
    meetingHistory: [
      {
        id: "m4",
        date: "2026-04-22",
        duration: "60 min",
        summary: "Discussed joint financial planning with Arjun. Reviewed insurance needs for married couple. Priya interested in sustainable investment options.",
        topics: ["Joint planning", "Insurance review", "Sustainable investments"],
        actionItems: ["Prepare sustainable fund options", "Draft joint financial plan template"],
      },
    ],
  },
  {
    id: "c3",
    name: "David Lim",
    avatar: "",
    initials: "DL",
    age: 58,
    occupation: "Retired, Former CFO",
    email: "david.lim@email.com",
    phone: "+65 9345 6789",
    policies: 11,
    aum: 3_800_000,
    lastMeeting: "2026-05-10",
    tags: ["Ultra HNW", "Retirement", "Legacy"],
    backgroundInfo: {
      summary: "David is a retired CFO focused on legacy planning and income generation. He has complex needs across multiple asset classes.",
      family: [
        { name: "Susan Lim", relation: "Wife", age: 55 },
        { name: "Jason Lim", relation: "Son", age: 28, notes: "Graduating from NUS MBA in Dec 2026" },
        { name: "Claire Lim", relation: "Daughter", age: 25 },
      ],
      importantDates: [
        {
          label: "Jason's Graduation",
          date: "2026-12-15",
          type: "graduation",
          message: "Congratulations to Jason on graduating from NUS MBA! Wishing him success in his career journey ahead!",
          giftSuggestions: [
            { name: "Premium Watch from Rolex", url: "https://www.rolex.com", reason: "Milestone gift for MBA graduation" },
            { name: "Executive Leather Portfolio", url: "https://www.montblanc.com", reason: "Professional accessory for new career" },
            { name: "Career Coaching Package", url: "https://www.linkedin.com/learning", reason: "Support for career transition" },
          ],
        },
        {
          label: "David's Birthday",
          date: "1968-07-04",
          type: "birthday",
          message: "Happy birthday, David! Wishing you a fantastic year filled with golf, wine, and wonderful moments with family!",
          giftSuggestions: [
            { name: "Premium Wine Collection", url: "https://www.vivino.com", reason: "Matches his wine collecting hobby" },
            { name: "Golf Retreat at Bintan", url: "https://www.bintan-resorts.com", reason: "Golf experience in paradise" },
            { name: "Exclusive Club Membership", url: "https://www.tanglinclub.org.sg", reason: "Premium club experience" },
          ],
        },
        {
          label: "Wedding Anniversary",
          date: "2026-09-20",
          type: "anniversary",
          message: "Happy wedding anniversary, David & Susan! Wishing you both a beautiful year ahead filled with love, laughter, and cherished memories!",
          giftSuggestions: [
            { name: "Luxury Cruise Package", url: "https://www.cruises.com", reason: "Romantic getaway for couple" },
            { name: "Fine Art Piece", url: "https://www.artsy.net", reason: "Collectible investment" },
            { name: "Michelin-Starred Dining Experience", url: "https://www.michelin.com", reason: "Culinary celebration" },
          ],
        },
      ],
      interests: ["Golf", "Wine collecting", "Philanthropy", "Board advisory roles"],
      concerns: ["Estate distribution", "Trust setup for grandchildren", "Offshore assets"],
      notes: ["Requires at least 48h notice for meetings", "Prefers physical meetings at his Tanglin Club"],
    },
    meetingHistory: [
      {
        id: "m5",
        date: "2026-05-10",
        duration: "90 min",
        summary: "Comprehensive estate planning review. Discussed trust structure for grandchildren. Reviewed offshore bond performance.",
        topics: ["Estate planning", "Trust structure", "Offshore bond review"],
        actionItems: ["Engage trust lawyer for referral", "Prepare offshore bond rebalancing proposal"],
      },
    ],
  },
  {
    id: "c4",
    name: "Sarah Wong",
    avatar: "",
    initials: "SW",
    age: 29,
    occupation: "Doctor, SGH",
    email: "sarah.wong@email.com",
    phone: "+65 8456 7890",
    policies: 3,
    aum: 120_000,
    lastMeeting: "2026-02-14",
    tags: ["Young Professional", "High Income Potential"],
    backgroundInfo: {
      summary: "Sarah is a young doctor with high income potential but limited time. She wants simple, automated solutions.",
      family: [],
      importantDates: [
        {
          label: "Sarah's Birthday",
          date: "1997-12-25",
          type: "birthday",
          message: "Happy birthday, Sarah! Wishing you a wonderful year filled with great patients, amazing colleagues, and well-deserved rest days!",
          giftSuggestions: [
            { name: "Premium Yoga Retreat", url: "https://www.baliretreats.com", reason: "Wellness for busy doctor" },
            { name: "Travel Voucher for Asia", url: "https://www.agoda.com", reason: "Matches her travel interest" },
            { name: "Luxury Skincare Set", url: "https://www.spacenk.com", reason: "Self-care products" },
          ],
        },
      ],
      interests: ["Travel", "Yoga", "Medical research"],
      concerns: ["Student loan repayment", "First home purchase", "Disability income protection"],
      notes: ["Very busy schedule, prefers 15-min virtual meetings", "Responds well to simple visuals"],
    },
    meetingHistory: [
      {
        id: "m6",
        date: "2026-02-14",
        duration: "30 min",
        summary: "Onboarding meeting. Set up basic protection plan and started RSP.",
        topics: ["Onboarding", "Protection plan", "RSP setup"],
        actionItems: ["Complete e-application for term plan"],
      },
    ],
  },
  {
    id: "c5",
    name: "Raymond Koh",
    avatar: "",
    initials: "RK",
    age: 52,
    occupation: "Business Owner, Manufacturing",
    email: "raymond.koh@email.com",
    phone: "+65 9876 5432",
    policies: 8,
    aum: 2_100_000,
    lastMeeting: "2026-01-30",
    tags: ["Business Owner", "Keyman Insurance", "Succession"],
    backgroundInfo: {
      summary: "Raymond is a successful business owner focused on succession planning and business continuity. He is pragmatic and values long-term stability.",
      family: [
        { name: "Michelle Koh", relation: "Wife", age: 50 },
        { name: "Ryan Koh", relation: "Son", age: 24, notes: "Working in the family business" },
        { name: "Nicole Koh", relation: "Daughter", age: 21, notes: "Studying business at SMU" },
      ],
      importantDates: [
        {
          label: "Nicole's Graduation",
          date: "2026-11-15",
          type: "graduation",
          message: "Congratulations to Nicole on graduating from SMU! Wishing her success as she joins the family business!",
          giftSuggestions: [
            { name: "Premium Business Laptop", url: "https://www.apple.com", reason: "For business career" },
            { name: "Executive Development Program", url: "https://www.insead.edu", reason: "Professional development" },
            { name: "Designer Business Bag", url: "https://www.louisvuitton.com", reason: "Professional accessory" },
          ],
        },
        {
          label: "Raymond's Birthday",
          date: "1974-08-22",
          type: "birthday",
          message: "Happy birthday, Raymond! Wishing you a successful year ahead with the business, great times with family, and well-deserved relaxation!",
          giftSuggestions: [
            { name: "Executive Golf Getaway", url: "https://www.sentosagolf.com", reason: "Premium golf experience" },
            { name: "Business Strategy Coaching", url: "https://www.mckinsey.com", reason: "Professional development" },
            { name: "Luxury Watch", url: "https://www.patek.com", reason: "Prestigious timepiece" },
          ],
        },
        {
          label: "Wedding Anniversary",
          date: "2026-10-10",
          type: "anniversary",
          message: "Happy wedding anniversary, Raymond & Michelle! Wishing you both continued success, happiness, and wonderful years ahead together!",
          giftSuggestions: [
            { name: "Luxury Vacation Package", url: "https://www.fourseasons.com", reason: "Romantic getaway" },
            { name: "Fine Art Investment", url: "https://www.christies.com", reason: "Collectible investment" },
            { name: "Couples Wellness Retreat", url: "https://www.amanresorts.com", reason: "Relaxation and bonding" },
          ],
        },
      ],
      interests: ["Golf", "Business strategy", "Travel", "Philanthropy"],
      concerns: ["Business succession planning", "Keyman insurance adequacy", "Estate tax planning", "Family governance"],
      notes: ["Prefers early morning meetings", "Very direct communicator", "Involved in several charitable boards"],
    },
    meetingHistory: [
      {
        id: "m7",
        date: "2026-01-30",
        duration: "90 min",
        summary: "Comprehensive business succession review. Discussed keyman insurance for business continuity. Reviewed estate tax implications.",
        topics: ["Succession planning", "Keyman insurance", "Estate tax planning"],
        actionItems: ["Prepare keyman insurance proposal", "Engage tax advisor for estate planning"],
      },
    ],
  },
];

// ─── APPOINTMENTS ────────────────────────────────────────────────────────────────

export const appointments: Appointment[] = [
  {
    id: "a1",
    clientId: "c1",
    clientName: "Chase Lim",
    time: "10:30 AM",
    date: "2026-07-03",
    duration: "60 min",
    type: "Portfolio Review + ISP Discussion",
    location: "In person, MBS",
    status: "upcoming",
    isNext: true,
  },
  {
    id: "a2",
    clientId: "c5",
    clientName: "Raymond Koh",
    time: "2:00 PM",
    date: "2026-07-03",
    duration: "60 min",
    type: "Keyman Insurance Review",
    location: "His office, Tanjong Pagar",
    status: "upcoming",
  },
  {
    id: "a3",
    clientId: "c2",
    clientName: "Priya Nair",
    time: "10:00 AM",
    date: "2026-07-04",
    duration: "45 min",
    type: "Engagement Party Planning",
    location: "Zoom",
    status: "upcoming",
  },
  {
    id: "a4",
    clientId: "c3",
    clientName: "David Lim",
    time: "3:00 PM",
    date: "2026-07-05",
    duration: "90 min",
    type: "Estate Planning Follow-up",
    location: "Tanglin Club",
    status: "upcoming",
  },
  {
    id: "a5",
    clientId: "c4",
    clientName: "Sarah Wong",
    time: "12:30 PM",
    date: "2026-07-06",
    duration: "30 min",
    type: "Quarterly Check-in",
    location: "Zoom",
    status: "upcoming",
  },
];

// ─── TODOS ────────────────────────────────────────────────────────────────────

export const todos: Todo[] = [
  {
    id: "t1",
    text: "Send ISP comparison table to Chase",
    clientId: "c1",
    clientName: "Chase Lim",
    priority: "high",
    done: false,
    dueDate: "2026-07-03",
  },
  {
    id: "t2",
    text: "Prepare education endowment illustration for Chase & Linda",
    clientId: "c1",
    clientName: "Chase Lim",
    priority: "high",
    done: false,
    dueDate: "2026-07-03",
  },
  {
    id: "t3",
    text: "Follow up on will drafting referral",
    clientId: "c1",
    clientName: "Chase Lim",
    priority: "medium",
    done: false,
  },
  {
    id: "t4",
    text: "Prepare keyman insurance proposal for Raymond",
    clientId: "c5",
    clientName: "Raymond Koh",
    priority: "high",
    done: false,
    dueDate: "2026-07-03",
  },
  {
    id: "t5",
    text: "Review sustainable fund options for Priya",
    clientId: "c2",
    clientName: "Priya Nair",
    priority: "medium",
    done: false,
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function getClientById(id: string | undefined): Client | undefined {
  return clients.find((c) => c.id === id);
}

export function formatAUM(aum: number): string {
  if (aum >= 1_000_000) {
    return `$${(aum / 1_000_000).toFixed(2)}M`;
  }
  if (aum >= 1_000) {
    return `$${(aum / 1_000).toFixed(0)}K`;
  }
  return `$${aum}`;
}

export function getAgeFromDob(dob: string): number {
  const today = new Date("2026-07-03");
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function getAgeLabel(dob: string): string {
  const today = new Date("2026-07-03");
  const birthDate = new Date(dob);
  const ageMs = today.getTime() - birthDate.getTime();
  const ageDate = new Date(ageMs);
  const years = ageDate.getUTCFullYear() - 1970;
  const months = ageDate.getUTCMonth();

  if (years === 0 && months === 0) {
    const days = Math.floor(ageMs / (1000 * 60 * 60 * 24));
    return `${days} days old`;
  }
  if (years === 0) {
    return `${months} months old`;
  }
  return `${years} years old`;
}

export function getDaysUntil(dateStr: string): number {
  const today = new Date("2026-07-03");
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);
  const diffMs = targetDate.getTime() - today.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function getAppointmentsByDate(date: string): Appointment[] {
  return appointments.filter((a) => a.date === date);
}

export function getNextAppointment(): Appointment | undefined {
  return appointments.find((a) => a.isNext);
}

export function getImportantDatesThisWeek(): Array<{
  client: Client;
  date: ImportantDate;
  daysUntil: number;
}> {
  const today = new Date("2026-07-03");
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const results: Array<{ client: Client; date: ImportantDate; daysUntil: number }> = [];

  clients.forEach((client) => {
    client.backgroundInfo.importantDates.forEach((date) => {
      const daysUntil = getDaysUntil(date.date);
      if (daysUntil >= 0 && daysUntil <= 7) {
        results.push({ client, date, daysUntil });
      }
    });
  });

  return results.sort((a, b) => a.daysUntil - b.daysUntil);
}
