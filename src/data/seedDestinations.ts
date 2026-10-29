import {
  Destination,
  AddOnOption,
  AdminUser,
  TourGuide,
  EmergencyService,
  TransportOptionItem,
  FacilityOptionItem
} from '../types/travel';
import guide1Rajesh from '../assets/images/guides/guide_1_rajesh_agra.jpg';
import guide2Nisha from '../assets/images/guides/guide_2_nisha_andaman.jpg';
import guide3Wayan from '../assets/images/guides/guide_3_wayan_bali.jpg';
import guide4Tariq from '../assets/images/guides/guide_4_tariq_dubai.jpg';
import guide5Anthony from '../assets/images/guides/guide_5_anthony_goa.jpg';
import guide6Tenzin from '../assets/images/guides/guide_6_tenzin_ladakh.jpg';
import guide7Priya from '../assets/images/guides/guide_7_priya_munnar.jpg';
import guide8Meera from '../assets/images/guides/guide_8_meera_jaipur.jpg';
import guide9Kavita from '../assets/images/guides/guide_9_kavita_rishikesh.jpg';
import guide10Anil from '../assets/images/guides/guide_10_anil_manali.jpg';
import guide11Aarav from '../assets/images/guides/guide_11_aarav_srinagar.jpg';
import guide12Akhilesh from '../assets/images/guides/guide_12_akhilesh_varanasi.jpg';

export interface AuthorizedAdminAccount {
  username: string;
  passwordHash: string; // Password for verification
  displayName: string;
  email: string;
  role: 'super_admin' | 'staff_admin' | 'operations' | 'finance';
  roleTitle: string;
  department: string;
  aliases?: string[];
}

// 4 Authorized Administrator Credentials
// 1. Badgujar hemant (Password: 256128307001)
// 2. Mukesh Sharma (Password: 246120307068)
// 3. Riken Raval (Password: 246120307066)
// 4. Chandan Yadav (Password: 246120307077)
export const AUTHORIZED_ADMIN_ACCOUNTS: AuthorizedAdminAccount[] = [
  {
    username: 'Badgujar hemant',
    passwordHash: '256128307001',
    displayName: 'Hemant Badgujar',
    email: 'badgujarhemant96@gmail.com',
    role: 'super_admin',
    roleTitle: 'Chief Administrator & Managing Director',
    department: 'Executive Governance, All Bookings & Systems',
    aliases: ['badgujar hemant', 'Hemant Badgujar', 'hemant badgujar', 'admin_hemant', 'hemant']
  },
  {
    username: 'Mukesh Sharma',
    passwordHash: '246120307068',
    displayName: 'Mukesh Sharma',
    email: 'mukesh.sharma@letstravel.co.in',
    role: 'operations',
    roleTitle: 'Operations & Fleet Logistics Director',
    department: 'Transport Charters, Tour Guides & Vehicle Fleet',
    aliases: ['mukesh sharma', 'Mukesh', 'mukesh', 'admin_mukesh']
  },
  {
    username: 'Riken Raval',
    passwordHash: '246120307066',
    displayName: 'Riken Raval',
    email: 'riken.raval@letstravel.co.in',
    role: 'staff_admin',
    roleTitle: 'Guest Relations & Safety Concierge Head',
    department: '24/7 Emergency SOS, Verified Hotels & Traveler Care',
    aliases: ['riken raval', 'Riken Raval', 'riken ravel', 'Riken Ravel', 'riken', 'admin_riken']
  },
  {
    username: 'Chandan Yadav',
    passwordHash: '246120307077',
    displayName: 'Chandan Yadav',
    email: 'chandan.yadav@letstravel.co.in',
    role: 'finance',
    roleTitle: 'Finance & Payments Controller',
    department: 'Payment Gateways, GST Invoicing & Refund Audits',
    aliases: ['chandan yadav', 'Chandan', 'chandan', 'admin_chandan']
  }
];

export const PRESET_ADMINS: AdminUser[] = AUTHORIZED_ADMIN_ACCOUNTS.map((a) => ({
  uid: `admin-${a.username.toLowerCase().replace(/\s+/g, '-')}`,
  username: a.username,
  email: a.email,
  displayName: a.displayName,
  role: a.role,
  roleTitle: a.roleTitle,
  permissions: ['manage_destinations', 'manage_bookings', 'manage_payments', 'manage_users', 'manage_content'],
  isActive: true
}));

export const SEED_DESTINATIONS: Destination[] = [
  {
    id: 'dest-agra-taj-mahal',
    title: 'Agra & Taj Mahal Heritage Express',
    subtitle: 'Wonder of the World sunrise tour, Mughal architecture, and Fatehpur Sikri palace.',
    stateRegion: 'UTTAR PRADESH, INDIA',
    category: 'Cultural & Heritage',
    travelMode: 'train',
    transportDetails: {
      mode: 'train',
      carrierName: 'Gatimaan Superfast Express (Executive AC Chair Car)',
      departureHub: 'Hazrat Nizamuddin (NZM), New Delhi',
      arrivalHub: 'Agra Cantt Railway Station (AGC), Agra',
      scheduleTime: 'Depart 08:10 AM -> Arrive 09:50 AM (Non-stop 100 min)',
      baggageOrSeats: 'Executive Chair Class, Hostess Service & Meals Included',
      includedFeatures: ['Catered Breakfast On-board', 'Panoramic Windows', 'Express Priority Track', 'Biometric Restrooms']
    },
    country: 'India',
    city: 'Agra & Fatehpur Sikri',
    description: 'Behold the ethereal beauty of the Taj Mahal bathed in morning light. Tour the monumental Agra Fort, admire intricate pietra dura marble inlays, and explore Emperor Akbar’s abandoned red-sandstone capital at Fatehpur Sikri with licensed ASI historian guides.',
    pricePerPerson: 8999,
    originalPrice: 12500,
    rating: 4.94,
    reviewCount: 620,
    curatedToursCount: 15,
    badge: 'Wonder of the World',
    durationDays: 3,
    durationNights: 2,
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587135941948-670b381f08ce?auto=format&fit=crop&w=1200&q=80'
    ],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Taj+Mahal+Agra+India',
    coordinates: '27.1751° N, 78.0421° E',
    hotels: [
      {
        id: 'h-agra-1',
        name: 'The Oberoi Amarvilas Agra',
        category: '5-Star Ultra-Luxury Heritage Resort',
        rating: 4.98,
        pricePerNight: 28500,
        location: 'Taj East Gate Road (600m from Taj Mahal), Agra',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        amenities: ['Direct Unobstructed Taj Mahal Views', 'Mughal Style Terraced Pool', 'Kohinoor Ayurveda Spa', 'Private Golf Buggy Transfers'],
        facilities: ['24/7 Butler Service', 'Valet Parking', 'Fine Dining Restaurants', 'Marble Bathrooms'],
        foodPlan: 'Champagne Buffet Breakfast & Royal Mughal Dinner',
        foodOptions: ['North Indian Mughal Specialties', 'Continental Gourmet', 'Vegetarian Jain Menu Available'],
        roomType: 'Premier Taj View Balcony Room',
        bookingDetails: 'Instant booking with VIP fast-track entry passes to the Taj Mahal at sunrise.'
      },
      {
        id: 'h-agra-2',
        name: 'ITC Mughal, a Luxury Collection Hotel',
        category: '5-Star Luxury Garden Palace',
        rating: 4.88,
        pricePerNight: 9800,
        location: 'Taj Ganj, Fatehabad Road, Agra',
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        amenities: ['35 Acres of Sprawling Mughal Gardens', 'Kaya Kalp Royal Spa', '2 Large Swimming Pools', 'Badminton & Tennis Courts'],
        facilities: ['Fitness Center', 'High-speed Wi-Fi', 'Conference Center', 'Concierge Tour Desk'],
        foodPlan: 'Lavish Multi-Cuisine Buffet Breakfast',
        foodOptions: ['Peshawri Kebabs & Dal Bukhara', 'Mughlai Delicacies', 'International Buffet'],
        roomType: 'Mughal Chamber King Room',
        bookingDetails: 'Includes complimentary transfer to Agra Fort and welcome mocktail.'
      },
      {
        id: 'h-agra-3',
        name: 'Howard Plaza The Fern Agra',
        category: '4-Star Contemporary Comfort Hotel',
        rating: 4.65,
        pricePerNight: 3800,
        location: 'Fatehabad Road, Tajganj, Agra',
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        amenities: ['Rooftop View of Taj Mahal', 'Swimming Pool', 'Wellness Spa', 'Travel Desk'],
        facilities: ['Air-Conditioning', 'Free Wi-Fi', 'Tea/Coffee Maker', 'In-room Safe'],
        foodPlan: 'Daily Buffet Breakfast',
        foodOptions: ['Pure Vegetarian Indian Thali', 'Continental Breakfast', 'Live Egg & Paratha Counter'],
        roomType: 'Deluxe Heritage City Room',
        bookingDetails: 'Budget-friendly comfort with express check-in and luggage storage.'
      }
    ],
    foodFacilities: [
      { mealType: 'Train Breakfast', description: 'Fresh cut fruits, south Indian idlis/parathas, juice and hot masala chai aboard Gatimaan', included: true },
      { mealType: 'Hotel Buffet Dinner', description: 'Authentic royal Mughlai cuisine: Dum Biryani, Shahi Paneer, Mughlai Dal, and hot Gulab Jamuns', included: true },
      { mealType: 'Afternoon Tea', description: 'Taj viewpoint terrace evening tea with Agra famous Petha sweets', included: true }
    ],
    inclusions: [
      'Roundtrip Gatimaan Express Executive Class Reserved Rail Tickets',
      '2 Nights Luxury Hotel Accommodations in Agra',
      'Daily Multi-Cuisine Buffet Breakfast and Mughal Dinner',
      'Private AC Sedan with Dedicated Chauffeur for all 3 days',
      'Fast-track Skip-The-Line entry passes to Taj Mahal & Agra Fort',
      'Certified Archaeological Survey of India (ASI) Historian Guide',
      'Excursion to UNESCO World Heritage Fatehpur Sikri & Mehtab Bagh'
    ],
    exclusions: [
      'Monument camera and commercial video recording fees',
      'Alcoholic drinks and room minibar consumption',
      'Personal marble souvenir shopping'
    ],
    highlights: [
      'Sunrise spectacle at Taj Mahal with zero crowd queues',
      'Agra Fort Diwan-i-Khas & Sheesh Mahal mirrored halls',
      'Sunset view of the Taj Mahal from across the Yamuna at Mehtab Bagh',
      'Fatehpur Sikri Buland Darwaza & Salim Chishti Dargah'
    ],
    nearbyAttractions: ['Taj Mahal (0.8 km)', 'Agra Fort (3 km)', 'Fatehpur Sikri (36 km)', 'Mehtab Bagh (6 km)', 'Kinari Bazaar (4 km)'],
    taxesAndGstPercent: 5,
    featured: true,
    availableSlots: 16,
    bestTimeToVisit: 'October to April'
  },
  {
    id: 'dest-shimla-manali',
    title: 'Shimla & Manali Alpine Circuit',
    subtitle: 'Snow-dusted cedar forests, Solang Valley adventures, and high Himalayan passes.',
    stateRegion: 'HIMACHAL PRADESH, INDIA',
    category: 'Mountain & Trekking',
    travelMode: 'bus',
    transportDetails: {
      mode: 'bus',
      carrierName: 'Himachal Volvo Luxury Multi-Axle Sleeper',
      departureHub: 'Kashmere Gate ISBT, New Delhi',
      arrivalHub: 'Private Bus Stand, Manali',
      scheduleTime: 'Daily 07:30 PM Overnight (13 hrs)',
      baggageOrSeats: '2x1 Luxury AC Sleeper + 25kg luggage capacity',
      includedFeatures: ['Air Suspension', 'Warm Blanket & Pillow', 'Individual USB Charging Ports', 'Bottled Mineral Water & Snacks']
    },
    country: 'India',
    city: 'Manali & Shimla',
    description: 'Breathe the crisp pine air of Himachal Pradesh. Explore colonial heritage along Shimla Mall Road, cross the engineering marvel of Atal Tunnel into Lahaul valley, experience snow sports in Solang, and unwind in cedar-scented riverside chalets.',
    pricePerPerson: 16999,
    originalPrice: 21500,
    rating: 4.85,
    reviewCount: 420,
    curatedToursCount: 12,
    badge: 'Mountain Trails',
    durationDays: 6,
    durationNights: 5,
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=80'
    ],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Manali+Himachal+Pradesh+India',
    coordinates: '32.2432° N, 77.1892° E',
    hotels: [
      {
        id: 'h-manali-1',
        name: 'The Himalayan Riverside Retreat & Spa',
        category: '4-Star Luxury Mountain Resort',
        rating: 4.85,
        pricePerNight: 8500,
        location: 'Beas Riverfront, Rangri, Manali',
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
        amenities: ['Heated Rooms', 'Private Mountain View Balcony', 'Bonfire Lawn with Live Music', 'Cedar Spa Facility'],
        facilities: ['Electric Bed Warmers', 'River-Facing Terrace', 'Game Room', 'Hot Water 24/7'],
        foodPlan: 'Breakfast & Dinner (MAP Plan)',
        foodOptions: ['Himachali Siddu & Trout Fish', 'North Indian Thali', 'Continental Buffet'],
        roomType: 'Deluxe Cedar Valley River Room',
        bookingDetails: 'Includes daily riverside evening tea with cookies and campfire.'
      },
      {
        id: 'h-shimla-1',
        name: 'Heritage Pine View Grand Hotel',
        category: 'Colonial Boutique Heritage Hotel',
        rating: 4.75,
        pricePerNight: 6200,
        location: 'The Ridge, Mall Road, Shimla',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        amenities: ['Mall Road Walkable (2 min)', 'Heritage Fireplace Lounge', 'Valley Sunset Deck'],
        facilities: ['Central Heating', 'Free High-Speed Wi-Fi', 'Room Dining', 'Library'],
        foodPlan: 'Daily Buffet Breakfast',
        foodOptions: ['Fresh Baked Croissants', 'Poha & Parathas', 'Organic Mountain Honey & Jams'],
        roomType: 'Executive Pine Valley Suite',
        bookingDetails: 'Instant booking with complimentary Ridge walking tour voucher.'
      },
      {
        id: 'h-solang-1',
        name: 'Solang Alpine Snow Chalet & Camps',
        category: '3-Star Alpine Adventure Lodge',
        rating: 4.6,
        pricePerNight: 3400,
        location: 'Solang Valley Road, Palchan, Manali',
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        amenities: ['Ski Equipment Rental Counter', 'Warm Wooden Interiors', 'Panoramic Snow Peak Views'],
        facilities: ['Heated Blankets', 'Mountain Spring Water', 'Parking', 'Tour Desk'],
        foodPlan: 'Nutritious Mountain Breakfast & Dinner',
        foodOptions: ['Hot Maggi & Momos', 'Dal Fry, Jeera Rice & Seasonal Sabzi', 'Herbal Kahwa'],
        roomType: 'Alpine Wooden Attic Room',
        bookingDetails: 'Direct access to ski slopes and ATV tracks.'
      }
    ],
    foodFacilities: [
      { mealType: 'Breakfast', description: 'Lavish multi-cuisine buffet featuring Himachali siddu, parathas, eggs, cereals, and fresh juice', included: true },
      { mealType: 'Dinner', description: 'Warm chef-curated buffet with North Indian, continental and authentic Himachali specialties', included: true },
      { mealType: 'Lunch', description: 'Available a-la-carte at designated scenic pitstops along Solang and Atal Tunnel', included: false }
    ],
    inclusions: [
      'Delhi-Manali-Shimla-Delhi by Luxury AC Volvo Sleeper',
      '5 Nights Deluxe Hotel Accommodations with Heating',
      'Daily Multi-Cuisine Buffet Breakfast and Dinner',
      'Solang Valley & Atal Tunnel excursion by private SUV',
      'Shimla Ridge, Mall Road & Jakhu Temple guided walk',
      'Applicable 5% Goods and Services Tax (GST)'
    ],
    exclusions: [
      'Airfare to New Delhi',
      'Snow gear rental (boots, snowsuits) & adventure sports (paragliding, skiing)',
      'Rohtang Pass green cess fee (payable at site if visiting)',
      'Personal laundry, telephone calls, and mini-bar expenses'
    ],
    highlights: [
      'Atal Tunnel & Sissu waterfall excursion',
      'Solang Valley paragliding & snow activities',
      'Hadimba Temple & Old Manali cafes',
      'Shimla Ridge & Jakhu Temple cable car'
    ],
    nearbyAttractions: ['Solang Valley (13 km)', 'Atal Tunnel (28 km)', 'Hadimba Devi Temple (2 km)', 'Vashisht Hot Springs (3 km)', 'Jogini Waterfalls (4 km)'],
    taxesAndGstPercent: 5,
    featured: true,
    availableSlots: 18,
    bestTimeToVisit: 'Year-round (April-June pleasant, Dec-Feb snowfall)'
  },
  {
    id: 'dest-srinagar-gulmarg',
    title: 'Srinagar, Gulmarg & Pahalgam Flight Escape',
    subtitle: 'Direct roundtrip flights, wooden Dal Lake houseboats, and Gulmarg high snow gondolas.',
    stateRegion: 'JAMMU & KASHMIR, INDIA',
    category: 'Mountain & Trekking',
    travelMode: 'flight',
    transportDetails: {
      mode: 'flight',
      carrierName: 'Air India / IndiGo Direct Return Flights',
      departureHub: 'Indira Gandhi Int’l Airport (DEL), New Delhi',
      arrivalHub: 'Sheikh ul-Alam Int’l Airport (SXR), Srinagar',
      scheduleTime: 'Depart 09:15 AM -> Arrive 10:45 AM (Non-stop)',
      baggageOrSeats: '15 kg Check-in + 7 kg Hand Baggage',
      includedFeatures: ['Priority Check-in', 'Complimentary In-flight Meal', 'Pre-assigned Window/Aisle Seat']
    },
    country: 'India',
    city: 'Srinagar, Gulmarg & Pahalgam',
    description: 'Discover paradise on earth in Kashmir. Glide across the tranquil waters of Dal Lake in handcrafted wooden Shikaras, ride the highest cable car Gondola in Gulmarg, and walk through fragrant saffron fields in Pampore.',
    pricePerPerson: 29999,
    originalPrice: 36500,
    rating: 4.92,
    reviewCount: 380,
    curatedToursCount: 10,
    badge: 'Flights Included',
    durationDays: 6,
    durationNights: 5,
    imageUrl: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'
    ],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Gulmarg+Kashmir+India',
    coordinates: '34.0484° N, 74.3805° E',
    hotels: [
      {
        id: 'h-dal-lake-1',
        name: 'Mascot Royal Heritage Cedar Houseboat',
        category: 'Deluxe Heritage Houseboat on Dal Lake',
        rating: 4.92,
        pricePerNight: 9500,
        location: 'Ghat No. 7, Boulevard Road, Dal Lake, Srinagar',
        imageUrl: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
        amenities: ['Hand-Carved Kashmiri Walnut Wood Interiors', 'Private Lake-facing Sun Deck', 'Centralized Heating & Electric Blankets'],
        facilities: ['Dedicated Houseboat Butler', 'Free Shikara Crossing Transfers', 'Wi-Fi', 'Attached Luxury Bathrooms'],
        foodPlan: 'Authentic Wazwan Dinner & Kashmiri Breakfast',
        foodOptions: ['Rogan Josh, Yakhni & Rista', 'Traditional Sheermal with Kahwa', 'Jain & Vegetarian Meals'],
        roomType: 'Royal Maharaja Chandelier Suite',
        bookingDetails: 'Includes private 1-hour sunset Shikara ride across the floating gardens.'
      },
      {
        id: 'h-gulmarg-1',
        name: 'The Khyber Himalayan Alpine Resort & Spa',
        category: '5-Star Luxury Mountain Resort',
        rating: 4.96,
        pricePerNight: 22000,
        location: 'Near Gondola Base Station, Gulmarg',
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        amenities: ['Heated Indoor Glass Swimming Pool', '5-Minute Walk to Gulmarg Gondola', 'L’Occitane Luxury Spa'],
        facilities: ['Underfloor Heating', 'Private Forest Balconies', 'Ski Equipment Locker', 'Gourmet Cafes'],
        foodPlan: 'Full Gourmet International Buffet Breakfast',
        foodOptions: ['Continental & Oriental Delicacies', 'Live Waffle & Crepe Stations', 'Authentic Indian Curries'],
        roomType: 'Premier Pine & Snow View Room',
        bookingDetails: 'Confirmed Gondola Phase-1 tickets assistance included.'
      },
      {
        id: 'h-pahalgam-1',
        name: 'Pine N Peak Pahalgam Resort',
        category: '4-Star Scenic Valley Resort',
        rating: 4.8,
        pricePerNight: 7200,
        location: 'Aru Road, Lidder River Valley, Pahalgam',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        amenities: ['Overlooking Lidder River Streams', 'Pine Forest Walking Trails', 'Bonfire Courtyard'],
        facilities: ['Room Heating', 'Free Wi-Fi', 'Travel Concierge', 'Tea Kettle in Room'],
        foodPlan: 'Buffet Breakfast & Kashmiri Dinner',
        foodOptions: ['Dum Aloo Kashmiri', 'Paneer Kanti', 'Hot Saffron Rice & Kahwa'],
        roomType: 'Valley Facing Deluxe Room',
        bookingDetails: 'Includes evening bonfire and Betaab Valley excursion assist.'
      }
    ],
    foodFacilities: [
      { mealType: 'Breakfast', description: 'Fresh Kashmiri Kahwa tea, traditional sheermaal bread, bakery items, eggs, and Indian buffet', included: true },
      { mealType: 'Dinner', description: 'Grand Kashmiri Wazwan experience: Rogan Josh, Gushtaba, Yakhni, Dum Aloo with fragrant saffron rice', included: true },
      { mealType: 'High Tea', description: 'Evening Shikara ride with hot samovar Kahwa and roasted almonds', included: true }
    ],
    inclusions: [
      'Roundtrip Economy Flights (DEL ⇄ SXR) with 15kg baggage',
      '2 Nights Heritage Houseboat + 3 Nights Luxury Alpine Hotel',
      'Daily Multi-Course Breakfast and Traditional Dinner',
      'Gulmarg Phase 1 Gondola Cable Car Confirmed Tickets',
      'Private 1-Hour Sunset Wooden Shikara Cruise on Dal Lake',
      'Dedicated Sanitized Innova Crysta for all airport and valley transfers',
      'All toll taxes, parking, driver allowances & 5% GST'
    ],
    exclusions: [
      'Gondola Phase 2 ticket (Aphrawat Peak) – bookable on site',
      'Pony rides or ATV quad biking in Gulmarg/Pahalgam',
      'Tips to Shikara rowers or hotel staff'
    ],
    highlights: [
      'Gulmarg snow plateau Gondola ride',
      'Pahalgam Betaab Valley & Aru Valley visit',
      'Mughal Gardens (Shalimar & Nishat Bagh)',
      'Floating vegetable market sunrise excursion'
    ],
    nearbyAttractions: ['Gulmarg Gondola (1 km)', 'Dal Lake (0 km)', 'Pahalgam Betaab Valley (85 km)', 'Shalimar Bagh (12 km)', 'Pari Mahal (14 km)'],
    taxesAndGstPercent: 5,
    featured: true,
    availableSlots: 12,
    bestTimeToVisit: 'March to October (Summer/Autumn), Dec to Feb (Snow skiing)'
  },
  {
    id: 'dest-rajasthan-vande-bharat',
    title: 'Royal Rajasthan Vande Bharat Express',
    subtitle: 'High-speed executive rail journey through Jaipur Pink City, Jodhpur Mehrangarh, and Lake Pichola.',
    stateRegion: 'RAJASTHAN, INDIA',
    category: 'Cultural & Heritage',
    travelMode: 'train',
    transportDetails: {
      mode: 'train',
      carrierName: 'Indian Railways Vande Bharat Superfast Express',
      departureHub: 'New Delhi Railway Station (NDLS)',
      arrivalHub: 'Jaipur Junction (JP) / Udaipur City (UDZ)',
      scheduleTime: 'Depart 06:10 AM -> Arrive 10:05 AM (Express 4 hrs)',
      baggageOrSeats: 'Executive Chair Class (EC) 360° Rotatable Seats',
      includedFeatures: ['Catering & Meals Included', 'Panoramic Windows', 'On-board Wi-Fi Infotainment', 'Biometric Vacuum Washrooms']
    },
    country: 'India',
    city: 'Jaipur, Jodhpur & Udaipur',
    description: 'Step into royal Rajasthan on India’s premier semi-high speed train. Gaze upon the pink sandstone facades of Hawa Mahal, explore the imposing ramparts of Mehrangarh Fort, take a romantic sunset boat ride on Lake Pichola, and savor royal Rajputana hospitality.',
    pricePerPerson: 21500,
    originalPrice: 27000,
    rating: 4.88,
    reviewCount: 460,
    curatedToursCount: 16,
    badge: 'Vande Bharat Express',
    durationDays: 7,
    durationNights: 6,
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1609137144820-2210a454d193?auto=format&fit=crop&w=1200&q=80'
    ],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jaipur+Udaipur+Rajasthan+India',
    coordinates: '26.9124° N, 75.7873° E',
    hotels: [
      {
        id: 'h-jaipur-1',
        name: 'Shahpura Haveli & Palace',
        category: 'Heritage Royal Palace Hotel',
        rating: 4.9,
        pricePerNight: 12500,
        location: 'Heritage Quarter, Jaipur',
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        amenities: ['Folk Performance Courtyard', 'Rooftop Nahargarh View', 'Royal Swimming Pool', 'Vintage Chariot Tours'],
        facilities: ['Air Conditioning', 'Free Wi-Fi', 'Ayurvedic Massage Center', 'Museum Tour'],
        foodPlan: 'Breakfast & Traditional Rajasthani Thali',
        foodOptions: ['Dal Baati Churma with Ghee', 'Gatte Ki Sabzi & Ker Sangri', 'Laal Maas & Bajra Roti'],
        roomType: 'Royal Maharaja Suite',
        bookingDetails: 'Includes evening Rajasthani puppet and Kalbelia dance show in the courtyard.'
      },
      {
        id: 'h-udaipur-1',
        name: 'Fateh Garh Heritage Sanctuary Palace',
        category: 'Lake View Palace Hotel',
        rating: 4.85,
        pricePerNight: 14000,
        location: 'Sisarma, Lake Pichola Hills, Udaipur',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        amenities: ['Panoramic Lake Pichola View', 'Vintage Car Collection', 'Rooftop Infinity Swimming Pool'],
        facilities: ['Spa by the Hill', 'Free High-Speed Wi-Fi', 'Chauffeur On Call', 'Palace Garden'],
        foodPlan: 'Buffet Breakfast & Sunset High Tea',
        foodOptions: ['Royal Mewari Specialties', 'Continental Breakfast Spread', 'Fresh Bakery & Juice'],
        roomType: 'Renaissance Lake View Suite',
        bookingDetails: 'Includes private sunset boat ride on Lake Pichola.'
      },
      {
        id: 'h-jodhpur-1',
        name: 'Pal Haveli Heritage Inn',
        category: '3-Star Authentic Heritage Haveli',
        rating: 4.65,
        pricePerNight: 4200,
        location: 'Near Clock Tower, Old Blue City, Jodhpur',
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        amenities: ['Unobstructed Mehrangarh Fort Rooftop Dining', 'Traditional Jharokha Balconies'],
        facilities: ['AC Rooms', 'Wi-Fi', '24-hour Front Desk', 'Luggage Room'],
        foodPlan: 'Daily Buffet Breakfast',
        foodOptions: ['Poha, Samosas, Masala Omelettes', 'Jodhpur Mawa Kachori', 'Fresh Ginger Chai'],
        roomType: 'Heritage Courtyard Room',
        bookingDetails: 'Walking distance to the colorful Sardar Spice Market.'
      }
    ],
    foodFacilities: [
      { mealType: 'Breakfast', description: 'Fresh Poha, Kachoris, Masala Chai, eggs, fresh cut fruits, and bakery spreads', included: true },
      { mealType: 'Dinner', description: 'Authentic Rajputana Dal Baati Churma, Gatte ki Sabzi, Ker Sangri, and Laal Maas', included: true },
      { mealType: 'Train Meals', description: 'Catered morning breakfast & evening tea snacks aboard Vande Bharat Express', included: true }
    ],
    inclusions: [
      'Vande Bharat Express Executive Class confirmed reserved seats',
      '6 Nights Accommodations in Royal Heritage Havelis & Palaces',
      'Daily Breakfast and Traditional Rajputana Dinners',
      'Private AC Sedan with Dedicated Chauffeur throughout Rajasthan',
      'Lake Pichola Private Sunset Boat Cruise in Udaipur',
      'Certified Archaeological Historian Guide for Amber Fort & Mehrangarh',
      'All monument entries, expressway tolls & 5% GST'
    ],
    exclusions: [
      'Camera and video equipment fees inside monuments',
      'Alcoholic beverages and laundry services',
      'Jeep or elephant ride at Amber Fort (optional add-on)'
    ],
    highlights: [
      'Amber Fort & City Palace complex',
      'Mehrangarh Fort towering blue city panorama',
      'Jag Mandir island palace on Lake Pichola',
      'Bustling Johari Bazaar textile & jewellery walk'
    ],
    nearbyAttractions: ['Hawa Mahal (3 km)', 'Amber Fort (11 km)', 'Lake Pichola (2 km)', 'Mehrangarh Fort (Jodhpur)', 'Jal Mahal (5 km)'],
    taxesAndGstPercent: 5,
    featured: true,
    availableSlots: 14,
    bestTimeToVisit: 'October to March'
  },
  {
    id: 'dest-goa-escapes',
    title: 'Goa Golden Coastal Getaway',
    subtitle: 'Golden sun-kissed beaches, Portuguese heritage villas, and private luxury catamaran cruises.',
    stateRegion: 'GOA, INDIA',
    category: 'Beach & Coastal',
    travelMode: 'flight',
    transportDetails: {
      mode: 'flight',
      carrierName: 'IndiGo / Akasa Air Direct Coastal Flight',
      departureHub: 'Mumbai (BOM) / Delhi (DEL)',
      arrivalHub: 'Manohar Int’l Airport Mopa (GOX) / Dabolim (GOI)',
      scheduleTime: 'Daily Departures (Morning & Afternoon)',
      baggageOrSeats: '15 kg Check-in + 7 kg Cabin Baggage',
      includedFeatures: ['Direct Flights', 'Online Check-in Assist', 'Airport Meet & Greet Chauffeur']
    },
    country: 'India',
    city: 'North & South Goa',
    description: 'Immerse yourself in coastal paradise. Sunbathe on golden sands from Palolem to Candolim, explore UNESCO-listed Old Goa churches, kayak through tranquil backwater mangroves, and relish freshly caught seafood.',
    pricePerPerson: 14500,
    originalPrice: 18900,
    rating: 4.78,
    reviewCount: 510,
    curatedToursCount: 14,
    badge: 'Beach & Coastal',
    durationDays: 5,
    durationNights: 4,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80'
    ],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Goa+Beaches+India',
    coordinates: '15.2993° N, 74.1240° E',
    hotels: [
      {
        id: 'h-goa-1',
        name: 'Taj Fort Aguada Coastal Resort & Spa',
        category: '5-Star Beachfront Luxury Resort',
        rating: 4.92,
        pricePerNight: 16500,
        location: 'Sinquerim Beach, Candolim, North Goa',
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        amenities: ['Direct Private Beach Access', 'Infinity Pool overlooking Arabian Sea', 'Jiva Ayurveda Spa', 'Beachside Grill Shack'],
        facilities: ['24/7 In-room Dining', 'Fitness Center', 'Kids Activity Club', 'Tennis Courts'],
        foodPlan: 'Gourmet Multi-Cuisine Buffet Breakfast',
        foodOptions: ['Fresh Goan Seafood Curries', 'Portuguese Cafreal & Poi Bread', 'Continental Gourmet Buffet'],
        roomType: 'Sea View Premium Villa',
        bookingDetails: 'Complimentary Mandovi River catamaran cruise included with stay.'
      },
      {
        id: 'h-goa-2',
        name: 'Candolim Palms Boutique Beach Resort',
        category: '4-Star Boutique Resort',
        rating: 4.75,
        pricePerNight: 5800,
        location: 'Candolim Beach Road, North Goa',
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
        amenities: ['200m Walk to Beach', 'Tropical Lagoon Swimming Pool', 'Poolside Cocktail Bar'],
        facilities: ['Free Wi-Fi', 'Air Conditioning', 'Scooter Rental Desk', 'Balcony'],
        foodPlan: 'Daily Buffet Breakfast',
        foodOptions: ['Goan Sausage & Eggs', 'South Indian Dosa Counter', 'Fresh Seasonal Tropical Fruits'],
        roomType: 'Deluxe Pool View Balcony Room',
        bookingDetails: 'Instant booking with late checkout subject to availability.'
      },
      {
        id: 'h-goa-3',
        name: 'Palolem Green Eco Beach Cabanas',
        category: '3-Star Rustic Coastal Cottage',
        rating: 4.6,
        pricePerNight: 3200,
        location: 'Palolem Beach, Canacona, South Goa',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        amenities: ['Direct Sand Beachfront', 'Hammocks Under Palm Trees', 'Yoga Pavilion'],
        facilities: ['Ceiling Fans / AC', 'Open-to-sky Eco Shower', 'Beach Loungers'],
        foodPlan: 'Healthy Organic Breakfast',
        foodOptions: ['Smoothie Bowls', 'Pancake & Honey', 'Fresh Coconut Water & Masala Omelettes'],
        roomType: 'Ocean Breeze Bamboo Cottage',
        bookingDetails: 'Steps from calm swimming waters and dolphin boat jetty.'
      }
    ],
    foodFacilities: [
      { mealType: 'Breakfast', description: 'Extensive tropical fruit bar, Goan poi breads, eggs benedict, south Indian dosas and fresh brew coffee', included: true },
      { mealType: 'Dinner', description: 'Goan fish curry, prawn balchao, vegetarian vindaloo, and dessert bibinca', included: true }
    ],
    inclusions: [
      'Roundtrip Flight Airfare with 15kg check-in luggage',
      '4 Nights Beachfront 4/5-Star Resort with Swimming Pool',
      'Daily Multi-Cuisine Breakfast Buffet & Goan Special Dinner',
      'Luxury Mandovi River Sunset Catamaran Cruise with live music',
      'Private North & South Goa Sightseeing Tour in AC Vehicle',
      'Airport Pickup and Drop Transfers in Private Sedan'
    ],
    exclusions: [
      'Scuba diving, jet-ski & banana boat rides at Calangute',
      'Late-night club entries and premium alcoholic beverages'
    ],
    highlights: [
      'Fontainhas Latin Quarter heritage architecture walk',
      'Dudhsagar waterfalls jeep safari excursion',
      'Water sports at Calangute & Baga beach',
      'Sunset cocktail hour at beachside shacks'
    ],
    nearbyAttractions: ['Fort Aguada (1 km)', 'Calangute Beach (4 km)', 'Basilica of Bom Jesus (18 km)', 'Dudhsagar Falls (60 km)'],
    taxesAndGstPercent: 5,
    featured: true,
    availableSlots: 24,
    bestTimeToVisit: 'October to May'
  },
  {
    id: 'dest-munnar-alleppey',
    title: 'Kerala Mist & Houseboat Cruise Private SUV',
    subtitle: 'Misty tea garden hills, backwater private houseboats, and Ayurvedic rejuvenation with private chauffeur.',
    stateRegion: 'KERALA, INDIA',
    category: 'Cultural & Heritage',
    travelMode: 'private_cab',
    transportDetails: {
      mode: 'private_cab',
      carrierName: 'Private Innova Crysta Sanitized SUV with Chauffeur',
      departureHub: 'Cochin International Airport (COK) / Ernakulam Jn',
      arrivalHub: 'Full Circuit: Cochin → Munnar → Thekkady → Alleppey',
      scheduleTime: 'Dedicated 24/7 Car at disposal throughout journey',
      baggageOrSeats: 'Captain Seats, AC, 4 Large Bags Capacity',
      includedFeatures: ['English & Hindi Speaking Chauffeur', 'Complimentary Bottled Water', 'Tolls & Parking Pre-paid']
    },
    country: 'India',
    city: 'Munnar & Alleppey',
    description: 'Experience God’s Own Country in supreme comfort. Wake up above the clouds in Munnar’s emerald tea plantations, cruise along Alleppey’s palm-fringed lagoons aboard a private Kettuvallam houseboat, and enjoy authentic Kerala sadhya.',
    pricePerPerson: 24999,
    originalPrice: 31000,
    rating: 4.93,
    reviewCount: 395,
    curatedToursCount: 15,
    badge: 'Private SUV Circuit',
    durationDays: 6,
    durationNights: 5,
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80'
    ],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Munnar+Alleppey+Kerala+India',
    coordinates: '10.0889° N, 77.0595° E',
    hotels: [
      {
        id: 'h-munnar-1',
        name: 'The Panoramic Getaway Tea Estate Resort',
        category: '5-Star Luxury Mountain Estate',
        rating: 4.92,
        pricePerNight: 11000,
        location: 'Chithirapuram, Munnar Hills',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        amenities: ['Helipad & Heated Infinity Pool', 'Private Balconies above Clouds', 'Ayurvedic Wellness Spa'],
        facilities: ['Air Conditioning / Heating', 'Tea Plantation Nature Walk', 'Multi-Cuisine Dining'],
        foodPlan: 'Breakfast & Chef Dinner',
        foodOptions: ['Authentic Kerala Appams & Stew', 'South Indian Sadhya', 'Continental Dishes'],
        roomType: 'Family Valley View Pavilion Suite',
        bookingDetails: 'Includes guided morning plantation walk with tea master.'
      },
      {
        id: 'h-alleppey-1',
        name: 'Spice Routes Luxury Private Kettuvallam',
        category: 'Deluxe Private Air-Conditioned Houseboat',
        rating: 4.96,
        pricePerNight: 14500,
        location: 'Punnamada Finishing Point, Alleppey',
        imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
        amenities: ['Dedicated On-board Private Chef', 'Sundeck with Recliners', 'Private Luxury Ensuite Bedroom'],
        facilities: ['Silent AC Generator', 'Safety Life Jackets', 'Sound System', 'Living Lounge'],
        foodPlan: 'All 3 Meals Included (Traditional Sadhya & Karimeen Fry)',
        foodOptions: ['Fresh Pearl Spot (Karimeen) Fry', 'Tapioca & Fish Curry', 'Pure Vegetarian Kerala Sadhya'],
        roomType: 'Full Private Exclusive Houseboat',
        bookingDetails: 'All meals, afternoon tea with banana fritters and private backwater cruise included.'
      },
      {
        id: 'h-munnar-budget-1',
        name: 'Green Ridge Nature Resort Munnar',
        category: '3-Star Comfort Hill Resort',
        rating: 4.65,
        pricePerNight: 3600,
        location: 'Tea County Road, Munnar Town',
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        amenities: ['Misty Mountain Views', 'In-house Restaurant', 'Doctor on Call'],
        facilities: ['Hot Water 24 Hours', 'Wi-Fi', 'Travel Desk', 'Intercom'],
        foodPlan: 'Daily Buffet Breakfast',
        foodOptions: ['Idli, Vada, Sambar', 'Puttu with Kadala Curry', 'Egg Roast & Toast'],
        roomType: 'Executive Mist View Room',
        bookingDetails: 'Comfortable stay close to Tata Tea Museum and local market.'
      }
    ],
    foodFacilities: [
      { mealType: 'Breakfast', description: 'Hot Appams with vegetable stew, Idlis with coconut chutney, fresh tropical fruits and filter coffee', included: true },
      { mealType: 'Lunch (Houseboat)', description: 'Authentic Kerala Sadhya served on banana leaves with freshly caught Karimeen Pollichathu fish', included: true },
      { mealType: 'Dinner', description: 'Multi-course dinner prepared fresh by your private houseboat chef', included: true }
    ],
    inclusions: [
      'Dedicated AC Innova Crysta SUV with private driver for all 6 days',
      '4 Nights Mountain Tea Estate Resort + 1 Night Exclusive Private Houseboat',
      'All Meals aboard Houseboat (Welcome drink, Lunch, Evening Tea, Dinner, Breakfast)',
      'Daily Multi-Cuisine Buffet Breakfast at Resorts',
      'Authentic 60-Minute Ayurvedic Rejuvenation Massage Session',
      'Spice Plantation Guided Tour & Tea Museum Tickets',
      'All inter-district tolls, fuel, parking and driver batta'
    ],
    exclusions: [
      'Flights to Cochin (COK)',
      'Personal water-sports and motorboat rides outside itinerary',
      'Entry fees for optional spice gardens'
    ],
    highlights: [
      'Eravikulam National Park Nilgiri Tahr safari',
      'Mattupetty Dam boat ride & Echo Point',
      'Village canoe cruise through narrow canals',
      'Live Kathakali & Kalaripayattu cultural performance'
    ],
    nearbyAttractions: ['Eravikulam National Park (9 km)', 'Mattupetty Dam (11 km)', 'Vembanad Lake (0 km)', 'Marari Beach (16 km)'],
    taxesAndGstPercent: 5,
    featured: true,
    availableSlots: 15,
    bestTimeToVisit: 'September to March'
  },
  {
    id: 'dest-varanasi-ghats',
    title: 'Varanasi & Sarnath Spiritual Journey',
    subtitle: 'Sacred Ganga Aarti at Dashashwamedh Ghat, sunrise boat rides, and Buddhist Sarnath stupas.',
    stateRegion: 'UTTAR PRADESH, INDIA',
    category: 'Cultural & Heritage',
    travelMode: 'train',
    transportDetails: {
      mode: 'train',
      carrierName: 'Vande Bharat Express (New Delhi ⇄ Varanasi Jn)',
      departureHub: 'New Delhi Railway Station (NDLS)',
      arrivalHub: 'Varanasi Junction (BSB)',
      scheduleTime: 'Depart 06:00 AM -> Arrive 02:00 PM (8 hrs express)',
      baggageOrSeats: 'Executive Chair Class, Breakfast & Lunch Included',
      includedFeatures: ['Catered Hot Meals', 'Reclining Ergonomic Chairs', 'Infotainment System']
    },
    country: 'India',
    city: 'Varanasi & Sarnath',
    description: 'Experience the oldest living city on Earth. Witness the grand evening Maha Aarti with flaming brass lamps, glide silently past historic ghats at dawn, explore the narrow alleyways of Kashi Vishwanath temple, and visit the Deer Park in Sarnath where Buddha gave his first sermon.',
    pricePerPerson: 13999,
    originalPrice: 17500,
    rating: 4.91,
    reviewCount: 310,
    curatedToursCount: 8,
    badge: 'Spiritual Sacred Tour',
    durationDays: 4,
    durationNights: 3,
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80'
    ],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Varanasi+Ghats+India',
    coordinates: '25.3176° N, 82.9739° E',
    hotels: [
      {
        id: 'h-varanasi-1',
        name: 'BrijRama Palace Heritage on Darbhanga Ghat',
        category: '5-Star Luxury Heritage Palace on the River',
        rating: 4.95,
        pricePerNight: 19500,
        location: 'Darbhanga Ghat, Riverfront, Varanasi',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        amenities: ['Direct Ghat Access via Private Boat', '210-Year Old Heritage Architecture', 'Rooftop Riverfront Terrace', 'Classical Live Sitar Sessions'],
        facilities: ['Historic Elevator', 'Pure Vegetarian Gourmet Dining', 'Ayurvedic Spa'],
        foodPlan: 'Full Pure Vegetarian Gourmet Breakfast & Dinner',
        foodOptions: ['Banarasi Kachori Sabzi & Jalebi', 'Royal Satvik Thali', 'Multi-Cuisine Vegetarian Curries'],
        roomType: 'Maharaja River View Palace Suite',
        bookingDetails: 'Includes private wooden bajra boat for evening Ganga Aarti front-row viewing.'
      },
      {
        id: 'h-varanasi-2',
        name: 'Taj Ganges Varanasi',
        category: '5-Star Luxury Garden Resort',
        rating: 4.88,
        pricePerNight: 11500,
        location: 'Nadesar Palace Grounds, Varanasi',
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        amenities: ['40 Acres of Lush Green Foliage', 'Swimming Pool & Jiva Spa', 'Tennis Courts'],
        facilities: ['High-speed Wi-Fi', 'Luxury Sedan Chauffeur Service', '24-hour Dining'],
        foodPlan: 'Buffet Breakfast Spread',
        foodOptions: ['Banarasi Street Food Delicacies', 'Continental Breakfast', 'Live Dosa & Omelette Counter'],
        roomType: 'Deluxe Garden View Room',
        bookingDetails: 'Includes private AC vehicle transfers to Dashashwamedh Ghat.'
      },
      {
        id: 'h-varanasi-3',
        name: 'Ganges View Boutique Haveli Assi Ghat',
        category: '3-Star Artistic Heritage Haveli',
        rating: 4.65,
        pricePerNight: 4200,
        location: 'Assi Ghat, Varanasi',
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        amenities: ['Direct Walk to Subah-e-Banaras Yoga on Assi Ghat', 'Library with Vedic Literature'],
        facilities: ['Air Conditioning', 'Free Wi-Fi', 'Terrace Cafe', 'Travel Concierge'],
        foodPlan: 'Nutritious Homemade Breakfast',
        foodOptions: ['Poha, Parathas, Fresh Curd, Banarasi Chai'],
        roomType: 'Traditional Haveli River Room',
        bookingDetails: 'Steps from renowned morning music recitals on Assi Ghat.'
      }
    ],
    foodFacilities: [
      { mealType: 'Breakfast', description: 'Fresh hot Banarasi Kachori, spicy potato curry, melt-in-mouth jalebis and thick kulhad lassi', included: true },
      { mealType: 'Dinner', description: 'Pure vegetarian Satvik Thali with aromatic paneer, lentils, fresh rotis, and Rabri', included: true }
    ],
    inclusions: [
      'Roundtrip Vande Bharat Express Executive Class Train Tickets',
      '3 Nights Heritage Hotel Accommodations near Ghats',
      'Daily Breakfast and Traditional Pure-Veg Dinners',
      'Private Handcrafted Wooden Boat for Evening Dashashwamedh Ganga Aarti',
      'Dawn Sunrise Rowing Boat Excursion along 84 Ghats',
      'Kashi Vishwanath Corridor VIP Darshan Assistance',
      'Excursion to Sarnath Stupa & Archaeological Museum'
    ],
    exclusions: ['Temple special offerings and VIP Abhishek tokens', 'Personal silk saree shopping'],
    highlights: [
      'Dashashwamedh Ghat evening Maha Aarti from private boat',
      'Subah-e-Banaras classical music & yoga at Assi Ghat',
      'Sarnath Dhamek Stupa where Lord Buddha delivered first sermon',
      'Exploring ancient winding lanes and famous Thandai shops'
    ],
    nearbyAttractions: ['Dashashwamedh Ghat (0.5 km)', 'Kashi Vishwanath Temple (1 km)', 'Assi Ghat (2 km)', 'Sarnath (10 km)', 'Manikarnika Ghat (1 km)'],
    taxesAndGstPercent: 5,
    featured: true,
    availableSlots: 15,
    bestTimeToVisit: 'October to March'
  },
  {
    id: 'dest-ladakh-safari',
    title: 'Leh Ladakh & Pangong Lake Himalayan Safari',
    subtitle: 'High mountain passes (Khardung La), color-changing Pangong Lake, and double-humped camel rides in Nubra.',
    stateRegion: 'LADAKH, INDIA',
    category: 'Mountain & Trekking',
    travelMode: 'flight',
    transportDetails: {
      mode: 'flight',
      carrierName: 'IndiGo / SpiceJet Scenic Mountain Flight',
      departureHub: 'Indira Gandhi Int’l Airport (DEL), New Delhi',
      arrivalHub: 'Kushok Bakula Rimpochee Airport (IXL), Leh',
      scheduleTime: 'Early Morning Departures (06:00 AM)',
      baggageOrSeats: '15kg Check-in + Oxygen Canister Kit Provided',
      includedFeatures: ['Spectacular Snow Peak Flyover View', 'Airport Oxygen Support', 'Acclimatization Welcome']
    },
    country: 'India',
    city: 'Leh, Nubra Valley & Pangong Lake',
    description: 'A once-in-a-lifetime trans-Himalayan expedition. Conquer the world’s highest motorable pass Khardung La (17,582 ft), camp beside the turquoise waters of Pangong Tso on the Indo-Tibetan border, ride Bactrian camels in the white dunes of Nubra Valley, and experience ancient Buddhist monasteries.',
    pricePerPerson: 34500,
    originalPrice: 42000,
    rating: 4.96,
    reviewCount: 370,
    curatedToursCount: 11,
    badge: 'High Altitude Adventure',
    durationDays: 7,
    durationNights: 6,
    imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80'
    ],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Leh+Ladakh+Pangong+Lake+India',
    coordinates: '34.1526° N, 77.5771° E',
    hotels: [
      {
        id: 'h-leh-1',
        name: 'The Grand Dragon Ladakh',
        category: '5-Star Luxury Solar-Heated Hotel',
        rating: 4.95,
        pricePerNight: 14500,
        location: 'Old Road, Sheynam, Leh',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        amenities: ['Central Solar Heating', 'Oxygen Concentrators in All Rooms', 'Panoramic Stok Kangri Views', 'Tibetan Traditional Murals'],
        facilities: ['Free High-Speed Wi-Fi', '24-hour Medical Advisory', 'Bakery & Fine Dining', 'Elevator'],
        foodPlan: 'Full Buffet Breakfast & Multi-Cuisine Dinner',
        foodOptions: ['Ladakhi Thukpa & Momos', 'North Indian Curries', 'Hot Soups & Continental Fare'],
        roomType: 'Premier Mountain Heritage Room',
        bookingDetails: 'Includes high-altitude medical checkup and acclimatization protocol.'
      },
      {
        id: 'h-nubra-1',
        name: 'Nubra Organic Retreat & Swiss Tents',
        category: 'Luxury Glamping & Cottage Resort',
        rating: 4.86,
        pricePerNight: 7200,
        location: 'Hunder Sand Dunes, Nubra Valley',
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        amenities: ['Organic Apricot Orchards', 'Attached Ceramic Bathrooms in Tents', 'Campfire Evening Under Stars'],
        facilities: ['Heated Blankets', 'Hot Water Buckets/Geysers', 'Stargazing Telescopes'],
        foodPlan: 'Organic Farm-to-Table Breakfast & Dinner',
        foodOptions: ['Fresh Garden Vegetables', 'Hot Khambir Ladakhi Bread', 'Indian Buffet'],
        roomType: 'Deluxe Swiss Glamping Tent with Verandah',
        bookingDetails: '5 minutes from Bactrian double-hump camel safari point.'
      },
      {
        id: 'h-pangong-1',
        name: 'Pangong Eco Lake Cottages Spangmik',
        category: 'Scenic Lakefront Eco-Resort',
        rating: 4.7,
        pricePerNight: 4800,
        location: 'Spangmik Village, Pangong Tso Lakefront',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        amenities: ['Direct Pangong Lake Shoreline View', 'Insulated Double Walls', 'Clear Night Sky Milky Way View'],
        facilities: ['Emergency Oxygen Cylinders', 'Thick Quilts', 'Generator Power Support'],
        foodPlan: 'Warm Buffet Meals Included',
        foodOptions: ['Hot Dal Tadka, Steamed Rice, Mixed Veg, Soup and Halwa'],
        roomType: 'Pangong Lake Facing Wooden Cottage',
        bookingDetails: 'Wake up to the famous sunrise color change of Pangong Lake.'
      }
    ],
    foodFacilities: [
      { mealType: 'Breakfast', description: 'Hot porridge, eggs, Ladakhi Khambir bread, honey, tea, coffee and poha', included: true },
      { mealType: 'Dinner', description: 'Warm multi-course buffet with soups, momos, noodles, North Indian vegetarian and non-veg curries', included: true }
    ],
    inclusions: [
      'Roundtrip Flights (Delhi ⇄ Leh) with 15kg check-in baggage',
      '4 Nights Leh Hotel + 1 Night Nubra Camp + 1 Night Pangong Lake Cottage',
      'Daily Multi-Cuisine Breakfast and Dinners at all locations',
      'Private 4x4 AC Mahindra Scorpio / Innova for the entire mountain circuit',
      'All Protected Area Permits (Inner Line Permits) for Nubra & Pangong',
      'Oxygen cylinder onboard vehicle for high-pass safety',
      'Driver allowances, high-altitude green taxes & 5% GST'
    ],
    exclusions: ['Camel safari ride fees in Hunder', 'Monument and monastery entry tickets (approx ₹50)'],
    highlights: [
      'Khardung La Pass high altitude milestone photograph',
      'Pangong Tso sunrise over turquoise waters',
      'Diskit Monastery giant Maitreya Buddha statue',
      'Hunder white sand dunes double-humped Bactrian camel ride'
    ],
    nearbyAttractions: ['Pangong Lake (0 km)', 'Khardung La Pass (38 km)', 'Diskit Monastery (Nubra)', 'Thiksey Monastery (19 km)', 'Shanti Stupa Leh (3 km)'],
    taxesAndGstPercent: 5,
    featured: true,
    availableSlots: 10,
    bestTimeToVisit: 'May to September'
  },
  {
    id: 'dest-andaman-havelock',
    title: 'Port Blair & Havelock Island Catamaran Tour',
    subtitle: 'Radhanagar Beach crystal waters, live coral reefs, and luxury Makruzz catamaran island hops.',
    stateRegion: 'ANDAMAN & NICOBAR ISLANDS, INDIA',
    category: 'Island Paradise',
    travelMode: 'flight',
    transportDetails: {
      mode: 'flight',
      carrierName: 'Air India / Vistara Return Island Flight + Makruzz Ferry',
      departureHub: 'Chennai (MAA) / Kolkata (CCU) / Delhi (DEL)',
      arrivalHub: 'Veer Savarkar Int’l Airport (IXZ), Port Blair',
      scheduleTime: 'Morning Flights + High Speed Catamaran Ferries',
      baggageOrSeats: '15kg Airline + Premium Makruzz Air-Conditioned Cabin',
      includedFeatures: ['Makruzz Luxury Catamaran Tickets', 'Jetty Transfers', 'Snorkeling Gear Included']
    },
    country: 'India',
    city: 'Port Blair & Havelock Island',
    description: 'Paradise uncompromised in the Bay of Bengal. Walk barefoot along Radhanagar Beach (voted Asia’s best beach), snorkel among vibrant living corals at Elephant Beach, and travel between islands on high-speed luxury catamarans.',
    pricePerPerson: 32000,
    originalPrice: 39500,
    rating: 4.95,
    reviewCount: 290,
    curatedToursCount: 8,
    badge: 'Island Cruise',
    durationDays: 6,
    durationNights: 5,
    imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Havelock+Island+Andaman+India',
    coordinates: '11.9761° N, 92.9876° E',
    hotels: [
      {
        id: 'h-havelock-1',
        name: 'Barefoot at Havelock Island',
        category: '5-Star Eco-Luxury Beachfront Villas',
        rating: 4.93,
        pricePerNight: 15500,
        location: 'Radhanagar Beach No. 7, Havelock Island',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        amenities: ['Exclusive Rainforest Trail to Radhanagar Beach', 'Indigenous Mahua Hardwood Architecture', 'Ayurvedic Spa & Diving Center'],
        facilities: ['Air Conditioning', 'Eco-Friendly Toiletries', 'Lounge Bar', 'Hammocks'],
        foodPlan: 'Gourmet Multi-Cuisine Breakfast & Coastal Dinner',
        foodOptions: ['Fresh Andaman Lobster & Red Snapper', 'South & North Indian Specialities', 'Tropical Fruit Smoothies'],
        roomType: 'Nicobari Hardwood Villa',
        bookingDetails: 'Includes private sunrise nature trail and beach loungers.'
      },
      {
        id: 'h-portblair-1',
        name: 'Symphony Samudra Beachside Resort Port Blair',
        category: '4-Star Oceanfront Wellness Resort',
        rating: 4.82,
        pricePerNight: 8200,
        location: 'Chidiya Tapu Sunset Point, Port Blair',
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        amenities: ['Infinity Pool Overlooking Ocean', 'Wellness Spa', 'Private Eco Reserve'],
        facilities: ['Wi-Fi', 'Airport Transfers', 'Multi-Cuisine Restaurant', 'Fitness Center'],
        foodPlan: 'Daily Buffet Breakfast',
        foodOptions: ['Continental and South Indian Breakfast', 'Fresh Coconut Water Counter'],
        roomType: 'Aqua Vista Luxury Room',
        bookingDetails: 'Includes Cellular Jail Light & Sound Show VIP ticket assistance.'
      },
      {
        id: 'h-havelock-budget-1',
        name: 'Seashell Havelock Coral Resort',
        category: '3-Star Cozy Lagoon Chalets',
        rating: 4.65,
        pricePerNight: 4800,
        location: 'Govind Nagar Beach No. 2, Havelock Island',
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        amenities: ['Beach Walking Distance', 'Swimming Pool', 'PADI Scuba Desk'],
        facilities: ['AC Rooms', 'Private Verandah', 'Restaurant', 'Tea Maker'],
        foodPlan: 'Buffet Breakfast Included',
        foodOptions: ['Idli, Poori Bhaji, Fresh Eggs, Cut Fruits, Tea/Coffee'],
        roomType: 'Andaman Lagoon Chalet',
        bookingDetails: 'Walking distance to Havelock Jetty and diving shops.'
      }
    ],
    foodFacilities: [
      { mealType: 'Breakfast', description: 'Fresh tropical fruit juices, continental breakfast, dosas, pancakes and fresh Andaman coconut water', included: true },
      { mealType: 'Dinner', description: 'Fresh grilled red snapper, lobster, tiger prawns, and multi-cuisine vegetarian spreads', included: true }
    ],
    inclusions: [
      'High-Speed Makruzz Luxury Catamaran Ferry Tickets (Port Blair ⇄ Havelock)',
      '5 Nights Luxury Island Resort Accommodations',
      'Daily Multi-Cuisine Buffet Breakfast and Candlelight Beach Dinners',
      'Elephant Beach Guided Coral Reef Snorkeling with Certified Diver',
      'Cellular Jail Light and Sound Show Premium Entry Tickets',
      'Airport & Jetty Private AC Transfers on both islands'
    ],
    exclusions: [
      'Scuba diving certification courses (PADI / SSI)',
      'Sea walking or kayak excursions outside schedule',
      'Personal water-proof phone pouch & equipment purchases'
    ],
    highlights: [
      'Radhanagar Beach sunset vista',
      'Scuba diving & sea walking in turquoise waters',
      'Kalapathar Beach turquoise lagoon walk',
      'Cellular Jail historical national memorial'
    ],
    nearbyAttractions: ['Radhanagar Beach (0.2 km)', 'Elephant Beach (3 km)', 'Cellular Jail (Port Blair)', 'Ross Island (Port Blair)'],
    taxesAndGstPercent: 5,
    featured: true,
    availableSlots: 10,
    bestTimeToVisit: 'October to May'
  },
  {
    id: 'dest-rishikesh-mussoorie',
    title: 'Rishikesh & Mussoorie Mountain Express',
    subtitle: 'Ganges white water rafting, sacred evening Aarti, and misty Queen of Hills trails.',
    stateRegion: 'UTTARAKHAND, INDIA',
    category: 'Adventure & Wildlife',
    travelMode: 'bus',
    transportDetails: {
      mode: 'bus',
      carrierName: 'Uttarakhand State Luxury AC Volvo',
      departureHub: 'ISBT Anand Vihar, New Delhi',
      arrivalHub: 'Rishikesh Bus Depot / Dehradun',
      scheduleTime: 'Daily Departures every 2 hours',
      baggageOrSeats: 'Pushback 2x2 AC Seats with USB Charging',
      includedFeatures: ['AC Climate Control', 'Expressway Route via Meerut Express', 'Mineral Water']
    },
    country: 'India',
    city: 'Rishikesh & Mussoorie',
    description: 'The ultimate Himalayan getaway. Conquer roaring rapids on the sacred Ganges river, soak in the divine energy of Parmarth Niketan Ganga Aarti, and stroll the Queen of Hills along Mussoorie’s historic Mall Road.',
    pricePerPerson: 11999,
    originalPrice: 15500,
    rating: 4.82,
    reviewCount: 340,
    curatedToursCount: 9,
    badge: 'Adventure Special',
    durationDays: 4,
    durationNights: 3,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
    ],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rishikesh+Mussoorie+Uttarakhand+India',
    coordinates: '30.0869° N, 78.2676° E',
    hotels: [
      {
        id: 'h-rishikesh-1',
        name: 'Ganga Kinare Heritage Riverside Resort',
        category: 'Riverside Boutique Luxury Hotel',
        rating: 4.85,
        pricePerNight: 8200,
        location: '23, Virbhadra Road, Rishikesh Riverfront',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        amenities: ['Private Ganga Ghat for Morning Yoga & Aarti', 'Rooftop River View Restaurant', 'Ayur Ganga Spa'],
        facilities: ['Central AC', 'Free Wi-Fi', 'Bicycle Rentals', 'Meditation Hall'],
        foodPlan: 'All Pure Vegetarian Satvik Meals Included',
        foodOptions: ['Garhwali Mandua Roti & Jhangora Kheer', 'North Indian Satvik Buffet', 'Herbal Detox Teas'],
        roomType: 'Deluxe Ganga River Facing Room',
        bookingDetails: 'Includes private evening Ganga Aarti viewing and morning yoga session.'
      },
      {
        id: 'h-mussoorie-1',
        name: 'Jaypee Residency Manor Mussoorie',
        category: '5-Star Luxury Hilltop Resort',
        rating: 4.9,
        pricePerNight: 13500,
        location: 'Barlowganj, Mussoorie Hills',
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        amenities: ['360° Panoramic Himalayan Snow View', 'Heated Indoor Swimming Pool', 'Tamaya Spa'],
        facilities: ['Bowling Alley', 'Kids Zone', 'Fine Dining', 'Mall Road Shuttle'],
        foodPlan: 'Buffet Breakfast & Dinner',
        foodOptions: ['Multi-Cuisine Buffet', 'Live Pasta Counter', 'Bakery Specialties'],
        roomType: 'Executive Valley View Suite',
        bookingDetails: 'Complimentary hourly shuttle to Mall Road Mussoorie.'
      },
      {
        id: 'h-rishikesh-camps-1',
        name: 'Tapovan Riverside Adventure Camps & Cottages',
        category: '3-Star Riverside Adventure Stay',
        rating: 4.6,
        pricePerNight: 2800,
        location: 'Tapovan, Badrinath Road, Rishikesh',
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        amenities: ['Riverside Beach Campfire', 'Volleyball Court', 'Close to Rafting Put-in'],
        facilities: ['Attached Western Bathrooms', 'Coolers / AC', 'Music System for Bonfire'],
        foodPlan: 'All 3 Buffet Camp Meals (Breakfast, Lunch, Dinner)',
        foodOptions: ['Campfire Barbecue Snacks', 'Indian Home-style Meals', 'Evening Chai & Pakoras'],
        roomType: 'Deluxe Swiss River Tent',
        bookingDetails: 'Direct starting point for 16 km Shivpuri rafting expedition.'
      }
    ],
    foodFacilities: [
      { mealType: 'Breakfast', description: 'Fresh herbal tea, hot puris, stuffed parathas, poha, porridge and organic honey', included: true },
      { mealType: 'Dinner', description: 'Nutritious Sattvic vegetarian buffet with Garhwali local dishes', included: true },
      { mealType: 'Camp Barbecue', description: 'Riverside evening campfire snacks with live acoustic music', included: true }
    ],
    inclusions: [
      'Roundtrip Delhi-Rishikesh by Luxury AC Volvo',
      '3 Nights Riverside Accommodations with Mountain Views',
      '16 km Grade III White Water Rafting Expedition with Life Jackets & Guide',
      'All Meals (Daily Breakfast, Rafting Lunch & Campfire Dinners)',
      'Private Cable Car to Gun Hill Viewpoint in Mussoorie',
      'Ganges Cliff Jumping, Body Surfing, and evening Aarti assistance'
    ],
    exclusions: [
      'Bungee jumping & Giant Swing at Mohan Chatti (bookable add-on)',
      'Monument camera tokens'
    ],
    highlights: [
      'Triveni Ghat spiritual evening Ganga Aarti',
      'Kempty Falls natural mountain cascade',
      'Ram Jhula and Laxman Jhula suspension bridges',
      'Lal Tibba highest viewpoint of Himalayan snow peaks'
    ],
    nearbyAttractions: ['Triveni Ghat (2 km)', 'Ram Jhula (1.5 km)', 'Kempty Falls (Mussoorie)', 'Gun Hill Cable Car (Mussoorie)'],
    taxesAndGstPercent: 5,
    featured: true,
    availableSlots: 20,
    bestTimeToVisit: 'September to June'
  },
  {
    id: 'dest-bali-indonesia',
    title: 'Bali Island & Ancient Temples Explorer',
    subtitle: 'Ubud emerald rice terraces, Uluwatu cliff sunset temple, and Nusa Penida turquoise beaches.',
    stateRegion: 'BALI, INDONESIA',
    category: 'Island Paradise',
    travelMode: 'flight',
    transportDetails: {
      mode: 'flight',
      carrierName: 'Singapore Airlines / AirAsia Connecting Flights',
      departureHub: 'Delhi (DEL) / Mumbai (BOM)',
      arrivalHub: 'Ngurah Rai Int’l Airport (DPS), Denpasar, Bali',
      scheduleTime: 'Depart 11:30 PM Overnight Flight (7.5 hrs)',
      baggageOrSeats: '20 kg Check-in + 7 kg Cabin Baggage Included',
      includedFeatures: ['International Luggage Allotment', 'In-flight Meals', 'Bali Tourist Visa Guidance']
    },
    country: 'Indonesia',
    city: 'Ubud, Seminyak & Nusa Penida',
    description: 'An enchanting tropical dream across the Island of the Gods. Swing above the jungle canopy in Ubud, witness traditional Kecak fire dance at cliff-top Uluwatu temple, snorkel with gentle manta rays at Nusa Penida, and relax in private pool villas.',
    pricePerPerson: 48999,
    originalPrice: 59000,
    rating: 4.94,
    reviewCount: 410,
    curatedToursCount: 14,
    badge: 'International Gateway',
    durationDays: 7,
    durationNights: 6,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80'
    ],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ubud+Bali+Indonesia',
    coordinates: '8.3405° S, 115.0920° E',
    hotels: [
      {
        id: 'h-bali-1',
        name: 'Ayana Resort & Spa Jimbaran',
        category: '5-Star Clifftop Ocean Resort',
        rating: 4.96,
        pricePerNight: 19800,
        location: 'Karang Mas Estate, Jimbaran, South Bali',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        amenities: ['World-Famous Rock Bar Overhanging Ocean', '12 Swimming Pools', 'Private White Sand Beach', 'Thalassotherapy Spa'],
        facilities: ['24/7 Butler Service', 'Free Tram Shuttles', 'Tennis Courts', 'Fitness Club'],
        foodPlan: 'Grand International Champagne Buffet Breakfast',
        foodOptions: ['Balinese Nasi Goreng & Satay', 'Continental & American Breakfast', 'Indian Curry Counter'],
        roomType: 'Deluxe Ocean View Balcony Room',
        bookingDetails: 'Priority sunset seating reservation at Rock Bar included.'
      },
      {
        id: 'h-bali-2',
        name: 'Padma Resort Ubud',
        category: '5-Star Rainforest Valley Resort',
        rating: 4.93,
        pricePerNight: 12500,
        location: 'Payangan, Ubud Valley, Bali',
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        amenities: ['89-Meter Heated Valley Infinity Pool', 'Surrounded by Bamboo Forests', 'Yoga Shala Over River'],
        facilities: ['Wi-Fi', 'Animal Garden', 'Jogging Track', 'Bicycle Tours'],
        foodPlan: 'Buffet Breakfast & Afternoon High Tea',
        foodOptions: ['Tropical Fruit Bar', 'Balinese Herbal Drinks', 'Artisan Bakery'],
        roomType: 'Premier Valley View Suite',
        bookingDetails: 'Daily complimentary afternoon tea and yoga classes included.'
      },
      {
        id: 'h-bali-3',
        name: 'Seminyak Sanctuary Boutique Villas',
        category: '4-Star Private Pool Villa',
        rating: 4.75,
        pricePerNight: 5800,
        location: 'Seminyak Beach District, Bali',
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        amenities: ['Private Plunge Swimming Pool', 'Outdoor Rain Shower', 'Kitchenette'],
        facilities: ['Free High-Speed Wi-Fi', 'Air Conditioning', 'Scooter Parking'],
        foodPlan: 'Floating Breakfast Served in Private Pool',
        foodOptions: ['Eggs Benedict, Pancakes, Fresh Fruit Platter & Balinese Kopi Coffee'],
        roomType: 'One-Bedroom Private Pool Villa',
        bookingDetails: 'Includes signature floating breakfast setup on your first morning.'
      }
    ],
    foodFacilities: [
      { mealType: 'Breakfast', description: 'Tropical Dragon fruit bowls, Balinese Kopi, eggs benedict, and international breakfast', included: true },
      { mealType: 'Dinner', description: 'Jimbaran beachside candlelit seafood barbecue or authentic Indonesian Satay feast', included: true }
    ],
    inclusions: [
      'Roundtrip International Flights with 20kg baggage',
      '3 Nights Ubud Rainforest Resort + 3 Nights Beachfront / Pool Villa',
      'Daily Gourmet Buffet Breakfast and Candlelight Dinners',
      'Nusa Penida Island Speedboat Day Cruise with Snorkeling',
      'Uluwatu Sunset Temple Tour & Kecak Fire Dance Show Passes',
      'Private AC Vehicle with English-speaking Balinese Chauffeur'
    ],
    exclusions: ['Indonesia Visa on Arrival fee ($35 USD)', 'Personal beach club cabana minimum spends'],
    highlights: [
      'Tegalalang Rice Terraces and famous Bali Jungle Swing',
      'Nusa Penida Kelingking Beach T-Rex viewpoint',
      'Uluwatu Clifftop Temple Kecak Dance at dusk',
      'Jimbaran Bay candlelit sunset seafood dinner'
    ],
    nearbyAttractions: ['Tegalalang Rice Terrace (9 km)', 'Uluwatu Temple (22 km)', 'Nusa Penida Ferry Jetty', 'Sacred Monkey Forest (3 km)'],
    taxesAndGstPercent: 5,
    featured: true,
    availableSlots: 10,
    bestTimeToVisit: 'April to October'
  },
  {
    id: 'dest-dubai-desert',
    title: 'Dubai & Desert Safari Extravaganza',
    subtitle: 'Burj Khalifa 124th floor tickets, golden sand dune bashing, and luxury marina yacht cruise.',
    stateRegion: 'DUBAI, UNITED ARAB EMIRATES',
    category: 'Urban & City Break',
    travelMode: 'flight',
    transportDetails: {
      mode: 'flight',
      carrierName: 'Emirates / Flydubai Direct 4-Hour Flight',
      departureHub: 'Delhi (DEL) / Mumbai (BOM)',
      arrivalHub: 'Dubai International Airport (DXB)',
      scheduleTime: 'Depart 09:30 AM -> Arrive 12:00 PM (Direct 4 hrs)',
      baggageOrSeats: '30 kg Check-in Luggage + 7 kg Hand Baggage',
      includedFeatures: ['World-Class Emirates Hospitality', 'In-flight Entertainment', 'Complimentary Hot Gourmet Meals']
    },
    country: 'United Arab Emirates',
    city: 'Dubai & Abu Dhabi',
    description: 'The glittering jewel of the Arabian Gulf. Ascend to the top of the world’s tallest tower Burj Khalifa, race across crimson sand dunes in 4x4 Land Cruisers, cruise the Dubai Marina on private yachts, and shop in futuristic mega-malls.',
    pricePerPerson: 52000,
    originalPrice: 64000,
    rating: 4.9,
    reviewCount: 480,
    curatedToursCount: 16,
    badge: 'Luxury Urban Tour',
    durationDays: 6,
    durationNights: 5,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80'
    ],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Dubai+Marina+Burj+Khalifa',
    coordinates: '25.2048° N, 55.2708° E',
    hotels: [
      {
        id: 'h-dubai-1',
        name: 'Atlantis The Palm Dubai',
        category: '5-Star Ultra-Luxury Iconic Resort',
        rating: 4.95,
        pricePerNight: 28500,
        location: 'Crescent Road, The Palm Jumeirah, Dubai',
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        amenities: ['Complimentary Access to Aquaventure Waterpark', 'The Lost Chambers Aquarium Access', 'Private White Sand Beach'],
        facilities: ['Over 30 Restaurants & Bars', 'Luxury Spa', 'Helipad', 'Designer Boutiques'],
        foodPlan: 'Grand International Kaleidoscope Buffet Breakfast',
        foodOptions: ['Arabic Mezze & Fresh Breads', 'Live International Counters', 'Pure Vegetarian Indian Station'],
        roomType: 'Palm Ocean View King Room',
        bookingDetails: 'Includes free daily unlimited access to Aquaventure Waterpark and Aquarium.'
      },
      {
        id: 'h-dubai-2',
        name: 'Address Downtown Burj Khalifa View',
        category: '5-Star Luxury Downtown Hotel',
        rating: 4.92,
        pricePerNight: 18500,
        location: 'Sheikh Mohammed bin Rashid Blvd, Downtown Dubai',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        amenities: ['Direct Dubai Mall Air-Conditioned Footbridge', 'Direct Burj Khalifa & Fountain Views', 'Multi-tier Infinity Pool'],
        facilities: ['The Spa at Address', 'High-Speed Wi-Fi', '24-hour Concierge Desk', 'Fitness Center'],
        foodPlan: 'Full Gourmet Buffet Breakfast',
        foodOptions: ['Emirati Specialties & Dates', 'European Continental Buffet', 'Asian & Indian Delicacies'],
        roomType: 'Premier Fountain View Room',
        bookingDetails: 'Walk to Dubai Mall and Dubai Fountain show in 2 minutes.'
      },
      {
        id: 'h-dubai-3',
        name: 'Arabian Courtyard Hotel & Spa Heritage',
        category: '4-Star Cultural Heritage Hotel',
        rating: 4.68,
        pricePerNight: 6400,
        location: 'Al Fahidi Historic District, Bur Dubai',
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        amenities: ['Opposite Dubai Museum & Gold Souk Abra Boats', 'Traditional Wind-Tower Architecture', 'Ayurvedic Wellness Spa'],
        facilities: ['Rooftop Swimming Pool', 'Free Wi-Fi', 'Air Conditioning', 'Airport Transfer Desk'],
        foodPlan: 'Daily Buffet Breakfast',
        foodOptions: ['Mumtaz Mahal Indian Restaurant Buffet', 'Arabic Hummus & Falafel', 'Continental Spread'],
        roomType: 'Heritage Deluxe Room',
        bookingDetails: 'Steps from historic Al Fahidi streets and authentic Dubai Spice Souk.'
      }
    ],
    foodFacilities: [
      { mealType: 'Breakfast', description: 'Lavish international buffet with Arabic mezze, croissants, cheeses, dosas, and fresh espresso', included: true },
      { mealType: 'Desert Barbecue Dinner', description: 'Traditional Bedouin desert camp buffet: grilled chicken shish tawook, kebabs, falafel, salads, and Arabic sweets with belly dance show', included: true }
    ],
    inclusions: [
      'Roundtrip Direct Flights (30kg check-in luggage)',
      '5 Nights 4/5-Star Accommodations in Downtown / Marina',
      'Daily International Buffet Breakfast',
      'Burj Khalifa 124th & 125th Floor Observation Deck Tickets',
      'Desert Safari 4x4 Land Cruiser Dune Bashing with Barbecue Dinner & Fire Show',
      'Dubai Marina Luxury Yacht Cruise with buffet dining and sightseeing',
      'Full Day Abu Dhabi City Tour including Sheikh Zayed Grand Mosque'
    ],
    exclusions: ['Tourism Dirham Fee (approx 15 AED / room / night)', 'Dubai Tourist Visa (can be added on request)'],
    highlights: [
      'Standing at the top of Burj Khalifa at 452 meters',
      'Adrenaline desert dune bashing and sunset sandboarding',
      'Sheikh Zayed Grand Mosque architectural wonder',
      'Dubai Mall dancing fountain show'
    ],
    nearbyAttractions: ['Burj Khalifa (0 km)', 'Dubai Mall (0.2 km)', 'Dubai Marina (15 km)', 'Palm Jumeirah (18 km)', 'Gold Souk (8 km)'],
    taxesAndGstPercent: 5,
    featured: true,
    availableSlots: 14,
    bestTimeToVisit: 'October to April'
  }
];

// Culturally Appropriate Local Tour Guides matching destinations in exact 12-panel order:
// 1. Rajesh Sharma (Agra)
// 2. Nisha Mondal (Port Blair & Havelock Island)
// 3. I Wayan Sudiarta (Ubud, Uluwatu & Nusa Penida, Bali)
// 4. Tariq Al-Mansoor (Dubai)
// 5. Anthony Fernandes (North & South Goa)
// 6. Tenzin Norbu (Ladakh)
// 7. Priya Nair (Munnar)
// 8. Meera Rathore (Jaipur)
// 9. Kavita Rawat (Rishikesh & Mussoorie)
// 10. Anil Thakur (Manali)
// 11. Aarav Mir (Srinagar, Gulmarg & Pahalgam)
// 12. Pandit Akhilesh Tripathi (Varanasi)
export const TOUR_GUIDES: TourGuide[] = [
  {
    id: 'guide-rajesh-agra',
    name: 'Rajesh Sharma',
    photoUrl: guide1Rajesh || '/assets/images/guides/guide_1_rajesh_agra.jpg',
    experienceYears: 14,
    rating: 4.98,
    reviewCount: 342,
    languages: ['Hindi', 'English', 'Spanish', 'French'],
    specialization: 'Mughal Architecture, Taj Mahal & ASI Archaeology',
    dailyRate: 2500,
    location: 'Agra, Fatehpur Sikri & Mathura',
    isAvailable: true,
    bio: 'Born in Agra beside the Yamuna, Rajesh is an Archaeological Survey of India (ASI) certified historian guide. He has hosted global scholars, state dignitaries, and travelers across the Taj Mahal and Fatehpur Sikri for 14 years.',
    badges: ['ASI Govt. Certified', 'Mughal Historian', 'Top Rated 2026']
  },
  {
    id: 'guide-nisha-andaman',
    name: 'Nisha Mondal',
    photoUrl: guide2Nisha || '/assets/images/guides/guide_2_nisha_andaman.jpg',
    experienceYears: 7,
    rating: 4.97,
    reviewCount: 248,
    languages: ['Hindi', 'Bengali', 'English', 'Tamil'],
    specialization: 'Port Blair & Havelock Island Marine Trails, Snorkeling & Coral Reefs',
    dailyRate: 2300,
    location: 'Port Blair & Havelock Island',
    isAvailable: true,
    bio: 'Born in Port Blair, Nisha is a passionate marine ecologist and certified coastal guide. She loves introducing travelers to turquoise Radhanagar waters, Elephant Beach coral reefs, and vibrant island history.',
    badges: ['Certified Marine Naturalist', 'Island Native', 'Scuba & Snorkel Expert']
  },
  {
    id: 'guide-wayan-bali',
    name: 'I Wayan Sudiarta',
    photoUrl: guide3Wayan || '/assets/images/guides/guide_3_wayan_bali.jpg',
    experienceYears: 11,
    rating: 4.95,
    reviewCount: 312,
    languages: ['Balinese', 'Indonesian', 'English'],
    specialization: 'Ubud Hindu Temples, Rice Terraces & Traditional Ceremonies',
    dailyRate: 2800,
    location: 'Ubud, Uluwatu & Nusa Penida, Bali',
    isAvailable: true,
    bio: 'Born in Ubud into a family of temple custodians. Wayan shares the spiritual heart of Bali, offering authentic access to Hindu water temple blessings and hidden waterfalls.',
    badges: ['Bali Tourism Certified', 'Cultural Storyteller', 'Top International Guide']
  },
  {
    id: 'guide-tariq-dubai',
    name: 'Tariq Al-Mansoor',
    photoUrl: guide4Tariq || '/assets/images/guides/guide_4_tariq_dubai.jpg',
    experienceYears: 10,
    rating: 4.92,
    reviewCount: 225,
    languages: ['Arabic', 'English', 'Hindi', 'Urdu'],
    specialization: 'Emirati Cultural Heritage, Desert Ecology & Modern Megastructures',
    dailyRate: 3500,
    location: 'Dubai & Abu Dhabi',
    isAvailable: true,
    bio: 'Certified DTCM luxury guide in the UAE. Adept at navigating historical Al Fahidi creek markets, desert star-gazing, and VIP access across Burj Khalifa and Sheikh Zayed Grand Mosque.',
    badges: ['DTCM Certified', 'Desert Safari Expert', 'Bilingual Diplomat']
  },
  {
    id: 'guide-anthony-goa',
    name: 'Anthony Fernandes',
    photoUrl: guide5Anthony || '/assets/images/guides/guide_5_anthony_goa.jpg',
    experienceYears: 10,
    rating: 4.91,
    reviewCount: 198,
    languages: ['Konkani', 'English', 'Hindi', 'Portuguese'],
    specialization: 'Fontainhas Latin Quarter, Old Goa Churches & Coastal Catamaran',
    dailyRate: 2100,
    location: 'North & South Goa Beaches',
    isAvailable: true,
    bio: 'Proud Goan local born in Fontainhas. Specialized in Portuguese colonial architecture, UNESCO cathedrals of Velha Goa, mangrove kayaking, and secret beach spots.',
    badges: ['Heritage Walking Expert', 'Licensed Goan Guide']
  },
  {
    id: 'guide-tenzin-ladakh',
    name: 'Tenzin Norbu',
    photoUrl: guide6Tenzin || '/assets/images/guides/guide_6_tenzin_ladakh.jpg',
    experienceYears: 13,
    rating: 4.97,
    reviewCount: 260,
    languages: ['Ladakhi', 'Tibetan', 'Hindi', 'English'],
    specialization: 'High Altitude Trans-Himalayan, Pangong Lake & Monastery Art',
    dailyRate: 2600,
    location: 'Leh, Nubra Valley & Pangong Tso',
    isAvailable: true,
    bio: 'Native of Nubra Valley with deep training in Buddhist monastery iconography, Khardung La high altitude navigation, and wildlife tracking of Himalayan Marmots.',
    badges: ['Trans-Himalayan Expert', 'Wilderness First Responder']
  },
  {
    id: 'guide-priya-kerala',
    name: 'Priya Nair',
    photoUrl: guide7Priya || '/assets/images/guides/guide_7_priya_munnar.jpg',
    experienceYears: 7,
    rating: 4.92,
    reviewCount: 142,
    languages: ['Malayalam', 'Tamil', 'Hindi', 'English'],
    specialization: 'Backwater Ecology, Spice Plantations & Ayurvedic Wellness',
    dailyRate: 2000,
    location: 'Munnar, Alleppey & Kochi',
    isAvailable: true,
    bio: 'Naturalist and botanical guide helping travelers navigate tea garden biodiversity, organic spice farming, and traditional backwater life with warmth.',
    badges: ['Eco-Naturalist', 'Kerala Tourism Honoree']
  },
  {
    id: 'guide-meera-rajasthan',
    name: 'Meera Rathore',
    photoUrl: guide8Meera || '/assets/images/guides/guide_8_meera_jaipur.jpg',
    experienceYears: 9,
    rating: 4.94,
    reviewCount: 210,
    languages: ['Rajasthani', 'Hindi', 'English', 'French'],
    specialization: 'Royal Fort Architecture, Amber Palace & Textile History',
    dailyRate: 2400,
    location: 'Jaipur, Jodhpur & Udaipur',
    isAvailable: true,
    bio: 'Archaeology graduate and licensed guide specializing in Amber Fort secret passages, Rajputana royal court chronicles, and Old City artisan bazaars.',
    badges: ['Archaeology Scholar', 'UNESCO Site Specialist', 'Multi-Lingual']
  },
  {
    id: 'guide-kavita-uttarakhand',
    name: 'Kavita Rawat',
    photoUrl: guide9Kavita || '/assets/images/guides/guide_9_kavita_rishikesh.jpg',
    experienceYears: 8,
    rating: 4.96,
    reviewCount: 275,
    languages: ['Hindi', 'Garhwali', 'English'],
    specialization: 'Rishikesh & Mussoorie Heritage, Ganga Aarti & Himalayan Ashrams',
    dailyRate: 2100,
    location: 'Rishikesh & Mussoorie',
    isAvailable: true,
    bio: 'Hailing from the sacred foothills of Garhwal Uttarakhand, Kavita guides travelers through tranquil Laxman Jhula banks, Parmarth Niketan evening Aarti, and hidden pine forest viewpoints in Mussoorie.',
    badges: ['Licensed Uttarakhand Guide', 'Yoga & Meditation Guide', 'Spiritual Historian']
  },
  {
    id: 'guide-anil-himachal',
    name: 'Anil Thakur',
    photoUrl: guide10Anil || '/assets/images/guides/guide_10_anil_manali.jpg',
    experienceYears: 8,
    rating: 4.89,
    reviewCount: 165,
    languages: ['Pahari', 'Hindi', 'English'],
    specialization: 'High Mountain Passes, Atal Tunnel, Solang & Lahaul',
    dailyRate: 1800,
    location: 'Manali, Solang Valley & Shimla',
    isAvailable: true,
    bio: 'Mountaineering Institute graduate with extensive snow rescue training. Passionate about hidden pine trails, Atal Tunnel geology, and Himalayan village folklore.',
    badges: ['Certified Trek Leader', 'Snow Rescue Expert']
  },
  {
    id: 'guide-aarav-kashmir',
    name: 'Aarav Mir',
    photoUrl: guide11Aarav || '/assets/images/guides/guide_11_aarav_srinagar.jpg',
    experienceYears: 11,
    rating: 4.96,
    reviewCount: 184,
    languages: ['Kashmiri', 'Hindi', 'English', 'Urdu'],
    specialization: 'Alpine Trekking, Dal Lake Heritage & Gulmarg Slopes',
    dailyRate: 2200,
    location: 'Srinagar, Gulmarg & Pahalgam',
    isAvailable: true,
    bio: 'Born in old Srinagar, Aarav has guided over 500 expeditions across Gulmarg gondola ridges and Dal Lake historical circuits. Certified by J&K Tourism Department.',
    badges: ['Govt. Certified', 'Alpine First Responder', 'Top Rated 2026']
  },
  {
    id: 'guide-pandit-akhilesh-varanasi',
    name: 'Pandit Akhilesh Tripathi',
    photoUrl: guide12Akhilesh || '/assets/images/guides/guide_12_akhilesh_varanasi.jpg',
    experienceYears: 12,
    rating: 4.96,
    reviewCount: 285,
    languages: ['Hindi', 'Sanskrit', 'English', 'Gujarati'],
    specialization: 'Sacred Ganga Ghats, Vedic Philosophy & Buddhist Sarnath',
    dailyRate: 2200,
    location: 'Varanasi, Kashi Corridor & Sarnath',
    isAvailable: true,
    bio: 'Sanskrit University scholar and lifelong Kashi resident. Guides travelers through the deep spiritual symbolism of the 84 Ganga ghats, morning Subah-e-Banaras, and Lord Buddha’s sermon path in Sarnath.',
    badges: ['Sanskrit Scholar', 'Ghats Specialist', 'Spiritual Guide']
  }
];

export const DEFAULT_TRANSPORT_OPTIONS: TransportOptionItem[] = [
  {
    id: 'flight',
    name: 'Scheduled Flight',
    iconName: 'Plane',
    shortNote: 'Fastest travel with scheduled airline partner',
    basePrice: 4500,
    classes: [
      { className: 'Economy Class', extraPrice: 0 },
      { className: 'Premium Economy', extraPrice: 2500 },
      { className: 'Business Class', extraPrice: 6500 }
    ],
    enabled: true,
    requiresFlight: true
  },
  {
    id: 'train',
    name: 'Scenic Railway Train',
    iconName: 'Train',
    shortNote: 'Comfortable scenic rail with confirmed berth',
    basePrice: 1200,
    classes: [
      { className: 'Sleeper Class', extraPrice: 0 },
      { className: '3-Tier AC (3AC)', extraPrice: 800 },
      { className: '2-Tier AC (2AC)', extraPrice: 1600 },
      { className: 'First AC (1AC)', extraPrice: 2800 }
    ],
    enabled: true,
    disallowTrainAndBus: true
  },
  {
    id: 'bus',
    name: 'Luxury Volvo Coach Bus',
    iconName: 'Bus',
    shortNote: 'Luxury sanitized Volvo / BharatBenz coach',
    basePrice: 900,
    classes: [
      { className: 'Pushback Seater', extraPrice: 0 },
      { className: 'Semi-Sleeper AC', extraPrice: 400 },
      { className: 'Sleeper AC', extraPrice: 850 },
      { className: 'Non-AC Sleeper', extraPrice: 200 }
    ],
    enabled: true,
    disallowTrainAndBus: true
  },
  {
    id: 'cab',
    name: 'Private Cab / SUV',
    iconName: 'Car',
    shortNote: 'Dedicated sanitized chauffeur from your doorstep',
    basePrice: 3200,
    classes: [
      { className: 'Sedan (Dzire/Etios)', extraPrice: 0 },
      { className: 'SUV (Innova/Ertiga)', extraPrice: 1500 },
      { className: 'Tempo Traveller (12-Seater)', extraPrice: 3500 }
    ],
    enabled: true,
    disallowTrainAndBus: true
  },
  {
    id: 'self_drive',
    name: 'Self Drive / Own Transit',
    iconName: 'Compass',
    shortNote: 'Join us directly at the destination hub; no transit charged',
    basePrice: 0,
    classes: [
      { className: 'Standard Self-Arranged', extraPrice: 0 }
    ],
    enabled: true
  }
];

export const DEFAULT_FACILITY_OPTIONS: FacilityOptionItem[] = [
  {
    id: 'fac-hotel-3star',
    category: 'hotel',
    name: '3-Star Standard Hotel',
    price: 0,
    priceNote: 'Included in Base Package',
    perPerson: true,
    enabled: true,
    description: 'Clean air-conditioned rooms, attached bath, verified hygiene standards.'
  },
  {
    id: 'fac-hotel-4star',
    category: 'hotel',
    name: '4-Star Premium Resort / Hotel',
    price: 1800,
    priceNote: '+₹1,800 / person',
    perPerson: true,
    enabled: true,
    description: 'Scenic valley/pool view, welcome drink, swimming pool & gym access.'
  },
  {
    id: 'fac-hotel-5star',
    category: 'hotel',
    name: '5-Star Luxury Heritage Stay',
    price: 3500,
    priceNote: '+₹3,500 / person',
    perPerson: true,
    enabled: true,
    description: 'Ultra-luxury suites, spa access, royal heritage hospitality & butler service.'
  },
  {
    id: 'fac-meal-breakfast',
    category: 'meal',
    name: 'Daily Breakfast Buffet',
    price: 0,
    priceNote: 'Included in Base Package',
    perPerson: true,
    enabled: true,
    description: 'Fresh local & continental breakfast buffet each morning.'
  },
  {
    id: 'fac-meal-halfboard',
    category: 'meal',
    name: 'Breakfast + Chef-Curated Dinner (MAP Plan)',
    price: 650,
    priceNote: '+₹650 / person / day',
    perPerson: true,
    enabled: true,
    description: 'Includes hearty breakfast buffet plus chef-curated dinner each evening.'
  },
  {
    id: 'fac-meal-allinclusive',
    category: 'meal',
    name: 'All Meals Plan (Breakfast + Lunch + Dinner)',
    price: 1200,
    priceNote: '+₹1,200 / person / day',
    perPerson: true,
    enabled: true,
    description: 'Complete 3-meal plan with afternoon high-tea and evening refreshments.'
  },
  {
    id: 'fac-airport-pickup',
    category: 'transfer',
    name: 'Airport / Station Pickup & Drop',
    price: 1500,
    priceNote: '+₹1,500 flat per party',
    perPerson: false,
    enabled: true,
    description: 'Dedicated airport or railway station greeting & seamless 2-way hotel transfer.'
  },
  {
    id: 'fac-local-guide',
    category: 'guide',
    name: 'Dedicated Certified Regional Tour Guide',
    price: 2200,
    priceNote: '+₹2,200 daily flat',
    perPerson: false,
    enabled: true,
    description: 'Licensed local guide dedicated to your itinerary for authentic regional storytelling.'
  },
  {
    id: 'fac-insurance',
    category: 'insurance',
    name: 'Comprehensive Domestic Travel Insurance',
    price: 450,
    priceNote: '+₹450 / person',
    perPerson: true,
    enabled: true,
    description: 'Covers emergency medical expenses, trip delays, baggage loss & cancellations.'
  },
  {
    id: 'fac-sightseeing-tickets',
    category: 'sightseeing',
    name: 'All Monument Fast-Track Passes & Entry Tickets',
    price: 1200,
    priceNote: '+₹1,200 / person',
    perPerson: true,
    enabled: true,
    description: 'Pre-booked skip-the-line passes for palaces, temples, national parks & museums.'
  },
  {
    id: 'fac-room-upgrade',
    category: 'upgrade',
    name: 'Premium Valley / Ocean Suite Upgrade',
    price: 2000,
    priceNote: '+₹2,000 / room',
    perPerson: false,
    enabled: true,
    description: 'Upgrade to top-tier suite with private balcony, panoramic views & luxury bathtub.'
  }
];

export const EMERGENCY_SERVICES: EmergencyService[] = [
  {
    id: 'sos-medical',
    serviceType: 'medical',
    title: 'Emergency Medical & Doctor-on-Call',
    costModel: 'Partially Covered',
    costDescription: 'Initial tele-triage & dispatch coordination are FREE; hospital admission, medication & specialized ambulance are billed at actuals (Chargeable).',
    emergencyPhone: '+91 1800-209-7711 (Ext. 1)',
    description: 'Immediate doctor tele-consultation, priority ambulance routing to closest verified network hospital, and first-aid advisory.',
    coverage: '24/7 All Tour Destinations'
  },
  {
    id: 'sos-roadside',
    serviceType: 'roadside',
    title: 'Highway Roadside & Vehicle Breakdown Assist',
    costModel: 'Free Coordination',
    costDescription: 'Replacement vehicle dispatch within our network is FREE; towing or off-network major mechanical repairs are Chargeable at vendor rates.',
    emergencyPhone: '+91 1800-209-7711 (Ext. 2)',
    description: 'Quick mechanic dispatch for tyre punctures, engine overheating, battery jump-starts, or instant backup sanitized vehicle provision.',
    coverage: 'National & State Highways in Tour Circuits'
  },
  {
    id: 'sos-police',
    serviceType: 'police',
    title: 'Tourist Police & Security Liaison',
    costModel: 'Free Coordination',
    costDescription: 'All tourist police escort coordination, lost property reporting & consular legal guidance are 100% FREE.',
    emergencyPhone: '+91 1800-209-7711 (Ext. 3)',
    description: 'Dedicated liaison officer to assist with local law enforcement, FIR filing for lost belongings, and safe traveler transfers.',
    coverage: 'Pan-India Tourist Jurisdictions'
  },
  {
    id: 'sos-weather',
    serviceType: 'general_sos',
    title: 'Weather Disruption & Route Evacuation',
    costModel: 'Partially Covered',
    costDescription: 'Emergency itinerary rerouting & mountain shelter coordination are FREE; private helicopter charters are Chargeable.',
    emergencyPhone: '+91 1800-209-7711 (Ext. 4)',
    description: 'Real-time monitoring of mountain passes (Rohtang, Atal Tunnel, Zojila), landslide alerts, and safe alternative transit.',
    coverage: 'Himalayan and High-Altitude Zones'
  }
];

export const ADD_ON_OPTIONS: AddOnOption[] = [
  {
    id: 'addon-guide',
    title: 'Dedicated Local Guide & Tour Escort',
    description: 'Certified regional expert and language translator for sightseeing',
    price: 2200,
    perPerson: false,
    iconName: 'Compass'
  },
  {
    id: 'addon-transfer',
    title: 'Airport & Railway Pickup/Drop Chauffeur',
    description: 'Comfortable air-conditioned private sedan or SUV both ways',
    price: 1800,
    perPerson: false,
    iconName: 'Car'
  },
  {
    id: 'addon-insurance',
    title: 'Comprehensive Domestic Travel Insurance',
    description: 'Medical emergencies, trip delay, and luggage protection coverage',
    price: 950,
    perPerson: true,
    iconName: 'ShieldCheck'
  },
  {
    id: 'addon-dining',
    title: 'Authentic Regional Dining Package',
    description: 'Traditional multi-course dinners and local specialty feasts',
    price: 3200,
    perPerson: true,
    iconName: 'Utensils'
  },
  {
    id: 'addon-photo',
    title: 'Vacation Photography Session',
    description: '60-minute scenic photoshoot with 30 retouched high-res pictures',
    price: 2200,
    perPerson: false,
    iconName: 'Camera'
  }
];

export const VALID_PROMO_CODES: Record<string, { discountPercent?: number; discountFixed?: number; description: string }> = {
  INDIA10: { discountPercent: 10, description: '10% instant discount across all tour packages' },
  EXPLORE2000: { discountFixed: 2000, description: '₹2,000 instant discount on booking' },
  HOLIDAY15: { discountPercent: 15, description: '15% festive holiday discount' },
  SUMMER1000: { discountFixed: 1000, description: '₹1,000 seasonal adventure reward' }
};
