import React, { useState, useMemo } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { DestinationCategory } from '../types/travel';

export interface Testimonial {
  id: string;
  quote: string;
  customerName: string;
  rating: number;
  category: DestinationCategory;
  destination: string;
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't-1',
    customerName: 'Rahul Verma',
    rating: 5,
    category: 'Mountain & Trekking',
    destination: 'Srinagar & Gulmarg',
    quote: 'Staying in the heritage cedar houseboat on Dal Lake and taking the Gulmarg snow gondola was pure magic. LET\'S TRAVEL arranged heating-equipped transport and timely permits throughout.'
  },
  {
    id: 't-2',
    customerName: 'Ananya Desai',
    rating: 5,
    category: 'Beach & Coastal',
    destination: 'Goa Coastal Escapes',
    quote: 'Our family beach villa was right by the sea. The private Mandovi sunset cruise and heritage Fontainhas walk were meticulously arranged with transparent pricing in Indian Rupees.'
  },
  {
    id: 't-3',
    customerName: 'Priya & Siddharth Mathur',
    rating: 5,
    category: 'Cultural & Heritage',
    destination: 'Jaipur & Udaipur',
    quote: 'From Lake Pichola sunset boat ride to the grand Mehrangarh fort walk, the hospitality and local licensed guides were world-class. Truly royal Rajputana heritage!'
  },
  {
    id: 't-4',
    customerName: 'Vikram Nair',
    rating: 5,
    category: 'Cultural & Heritage',
    destination: 'Munnar & Alleppey',
    quote: 'Waking up to misty tea plantations in Munnar and cruising the backwaters on a private houseboat with authentic Kerala cuisine was the highlight of our year.'
  },
  {
    id: 't-5',
    customerName: 'Sameer Sen',
    rating: 5,
    category: 'Island Paradise',
    destination: 'Port Blair & Havelock Island',
    quote: 'Radhanagar Beach crystal waters and snorkeling at Elephant Beach were pristine. High-speed Makruzz catamaran transfers were seamless from start to end.'
  },
  {
    id: 't-6',
    customerName: 'Deepak Joshi',
    rating: 5,
    category: 'Adventure & Wildlife',
    destination: 'Rishikesh & Mussoorie',
    quote: 'White water rafting on the Ganges followed by the evening Triveni Ghat Aarti was deeply energizing. The riverside glamping was comfortable and exceptionally clean.'
  },
  {
    id: 't-7',
    customerName: 'Kavita Menon',
    rating: 5,
    category: 'Mountain & Trekking',
    destination: 'Shimla & Manali',
    quote: 'The Atal Tunnel drive to Sissu waterfall and snow activities in Solang Valley were unforgettable. The 24/7 travel desk supported us throughout our trip.'
  },
  {
    id: 't-8',
    customerName: 'Arjun & Meera Kapoor',
    rating: 5,
    category: 'Island Paradise',
    destination: 'Bali & Nusa Penida',
    quote: 'Our private pool villa in Ubud and Kelingking cliff tour were breathtaking. Completely hassle-free with dedicated driver and all entry tickets included.'
  }
];

const FILTER_CATEGORIES: (DestinationCategory | 'All')[] = [
  'All',
  'Mountain & Trekking',
  'Beach & Coastal',
  'Cultural & Heritage',
  'Adventure & Wildlife',
  'Island Paradise'
];

export const TestimonialsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory | 'All'>('All');
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredTestimonials = useMemo(() => {
    if (selectedCategory === 'All') return TESTIMONIALS_DATA;
    return TESTIMONIALS_DATA.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (category: DestinationCategory | 'All') => {
    setSelectedCategory(category);
    setCurrentIndex(0);
  };

  const totalReviews = filteredTestimonials.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalReviews - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalReviews - 1 ? 0 : prev + 1));
  };

  const visibleCards = useMemo(() => {
    if (totalReviews === 0) return [];
    if (totalReviews <= 3) return filteredTestimonials;
    
    const items: Testimonial[] = [];
    for (let i = 0; i < 3; i++) {
      const idx = (currentIndex + i) % totalReviews;
      items.push(filteredTestimonials[idx]);
    }
    return items;
  }, [filteredTestimonials, currentIndex, totalReviews]);

  return (
    <section className="bg-slate-50 py-16 sm:py-20 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Category Filters & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#ea580c] block mb-1">
              Verified Traveller Reviews
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-slate-900 tracking-tight">
              Loved by Travellers Across India & Beyond
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Authentic stories and experiences from guests who booked their holidays with LET'S TRAVEL.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handlePrev}
              aria-label="Previous review"
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next review"
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#ea580c] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCards.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4" aria-label={`${item.rating} out of 5 stars`}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <blockquote className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal italic mb-6">
                  "{item.quote}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="font-bold text-slate-900 text-sm">{item.customerName}</p>
                <p className="text-xs text-[#ea580c] font-medium mt-0.5">{item.destination}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots Indicator */}
        {totalReviews > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-8">
            {filteredTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-6 bg-[#ea580c]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
