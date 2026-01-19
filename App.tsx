
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Seat, BookingStep, Passenger, ROUTE_INFO } from './types';
import { loadSeats, saveSeats } from './utils/storage';
import { generateInitialSeats } from './utils/seatGenerator';
import SeatMap from './components/SeatMap';
import BookingModal from './components/BookingModal';
import PaymentModal from './components/PaymentModal';
import TicketModal from './components/TicketModal';

const App: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatNum, setSelectedSeatNum] = useState<string | null>(null);
  const [step, setStep] = useState<BookingStep>(BookingStep.IDLE);
  const [currentPassenger, setCurrentPassenger] = useState<Passenger | null>(null);

  // Initialize data
  useEffect(() => {
    const saved = loadSeats();
    if (saved) {
      setSeats(saved);
    } else {
      const initial = generateInitialSeats();
      setSeats(initial);
      saveSeats(initial);
    }
  }, []);

  const handleSeatSelect = (seatNum: string) => {
    setSelectedSeatNum(prev => prev === seatNum ? null : seatNum);
  };

  const handleBookingStart = () => {
    if (selectedSeatNum) {
      setStep(BookingStep.DETAILS);
    }
  };

  const handleDetailsSubmit = (data: Passenger) => {
    setCurrentPassenger(data);
    setStep(BookingStep.PAYMENT);
  };

  const handlePaymentSuccess = () => {
    if (!selectedSeatNum || !currentPassenger) return;

    const ticketId = `T-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newSeats = seats.map(s => {
      if (s.seat_number === selectedSeatNum) {
        return {
          ...s,
          is_booked: true,
          passenger_name: currentPassenger.fullName,
          passport_number: currentPassenger.passportNumber,
          ticket_id: ticketId,
          booked_at: new Date().toISOString()
        };
      }
      return s;
    });

    setSeats(newSeats);
    saveSeats(newSeats);
    setStep(BookingStep.SUCCESS);
  };

  const resetFlow = () => {
    setStep(BookingStep.IDLE);
    setSelectedSeatNum(null);
    setCurrentPassenger(null);
  };

  const selectedSeatData = seats.find(s => s.seat_number === selectedSeatNum);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32">
      {/* Header */}
      <header className="bg-black text-[#FFC107] p-6 rounded-b-[3rem] shadow-2xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 bg-[#FFC107] rounded-lg flex items-center justify-center">
               <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M18 11V7c0-1.66-1.34-3-3-3H5c-1.66 0-3 1.34-3 3v13c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1V11c0-1.66-1.34-3-3-3h-1v3h1zM4 16v-5h3v5H4zm5 0v-5h3v5H9zm10 0h-3v-5h3v5z"/>
               </svg>
             </div>
             <h1 className="text-xl font-black uppercase tracking-tighter">Online Avtobus</h1>
          </div>
          
          <div className="flex items-center justify-between w-full max-w-sm">
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qayerdan</p>
              <p className="text-lg font-bold">{ROUTE_INFO.from}</p>
            </div>
            <div className="flex flex-col items-center px-4">
               <div className="h-[1px] w-12 bg-[#FFC107]/30 mb-1"></div>
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
               </svg>
               <div className="h-[1px] w-12 bg-[#FFC107]/30 mt-1"></div>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qayerga</p>
              <p className="text-lg font-bold">{ROUTE_INFO.to}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-black">O'rindiqni tanlang</h2>
            <p className="text-gray-500 text-sm">Avtobus ichidagi bo'sh joylar</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5">
               <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
               <span className="text-[10px] font-bold text-gray-400 uppercase">Bo'sh</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-3 h-3 bg-gray-300 rounded"></div>
               <span className="text-[10px] font-bold text-gray-400 uppercase">Band</span>
             </div>
          </div>
        </div>

        <SeatMap 
          seats={seats} 
          selectedSeatNumber={selectedSeatNum} 
          onSeatSelect={handleSeatSelect} 
        />
      </main>

      {/* Bottom Sticky Action */}
      <AnimatePresence>
        {selectedSeatNum && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-gray-100 z-30"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Tanlangan o'rindiq</p>
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-black">#{selectedSeatNum}</span>
                   <span className="text-gray-300">|</span>
                   <span className="text-lg font-bold text-black">{ROUTE_INFO.price.toLocaleString()} so'm</span>
                </div>
              </div>
              <button 
                onClick={handleBookingStart}
                className="bg-black text-[#FFC107] px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform"
              >
                Bilet olish
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <BookingModal 
        isOpen={step === BookingStep.DETAILS} 
        onClose={() => setStep(BookingStep.IDLE)} 
        onSubmit={handleDetailsSubmit} 
        seatNumber={selectedSeatNum || ''} 
      />
      
      <PaymentModal 
        isOpen={step === BookingStep.PAYMENT} 
        amount={ROUTE_INFO.price}
        onCancel={() => setStep(BookingStep.DETAILS)}
        onSuccess={handlePaymentSuccess}
      />

      {selectedSeatData && (
        <TicketModal 
          isOpen={step === BookingStep.SUCCESS} 
          onClose={resetFlow} 
          seat={selectedSeatData} 
        />
      )}
    </div>
  );
};

export default App;
