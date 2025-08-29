import { useState, useRef, useEffect } from 'react';
// import { useTranslation } from 'next-i18next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// import '@/styles/registration.css'; // Local scoped CSS in /styles


// Utility types

// add near other types at the top

const MAX_CLASS_SIZE = 22;

type Counts = Record<LocationKey, Record<DayKey, number>>;


const daysMap = {
  KATY: ['Tuesday', 'Wednesday'],
  SUGARLAND: ['Monday', 'Thursday'],
} as const satisfies Record<LocationKey, readonly DayKey[]>;

const startDates: Record<LocationKey, Record<DayKey, string>> = {
  KATY: {
    Monday: '',
    Tuesday: '2025-08-26',
    Wednesday: '2025-08-27',
    Thursday: '',
  },
  SUGARLAND: {
    Monday: '2025-08-25',
    Tuesday: '',
    Wednesday: '',
    Thursday: '2025-08-28',
  },
};

type RegistrationPayload = {
  studentName: string;
  age: number;
  parentName: string;
  phone: string;
  email: string;
  location: 'KATY' | 'SUGARLAND';
  frequency: 'ONCE' | 'TWICE';
  selectedDays: DayKey[];
  startDate: string; // ISO format
  liabilityAccepted: boolean;
  paymentMethod: 'Cash' | 'Zelle' | 'Check';
  waiverSignature?: { name?: string; address?: string };
};

type LocationKey = 'KATY' | 'SUGARLAND';
// type FrequencyKey = 'ONCE' | 'TWICE';
export type DayKey = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';


const prices: Record<LocationKey, Record<DayKey | 'both', number>> = {
  KATY: { Monday: 0, Tuesday: 245, Wednesday: 245, Thursday: 0, both: 450 },
  SUGARLAND: { Monday: 230, Tuesday: 0, Wednesday: 0, Thursday: 245, both: 450 },
};

function formatReadableDate(dateString: string | undefined): string {
  if (!dateString) return ''; // or return "Invalid date" or similar fallback

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = date.toLocaleDateString('en-US', { month: 'long' });
  const dayNum = date.getDate();

  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return `${n}th`;
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  };

  return `${dayName}, ${monthName} ${getOrdinal(dayNum)}`;
}

const formatDateNoWeekday = (ymd?: string) => {
  if (!ymd) return '';
  const d = new Date(ymd);
  const day = d.getDate();
  const suffix = (n: number) =>
    n % 10 === 1 && n % 100 !== 11 ? 'st' :
    n % 10 === 2 && n % 100 !== 12 ? 'nd' :
    n % 10 === 3 && n % 100 !== 13 ? 'rd' : 'th';
  return d.toLocaleDateString('en-US', { month: 'long' }) + ` ${day}${suffix(day)}`;
};


type Section = {
  id: string;
  location: 'KATY' | 'SUGARLAND';
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  label: string;       // "A" | "B"
  startDate?: string;
  startTime?: string;
  endTime?: string;
  priceCents: number;
  capacity: number;
  activeCount: number;
  seatsRemaining: number;
};







export default function Home() {
  // const { t, i18n } = useTranslation('common');
  const [liabilityAccepted, setLiabilityAccepted] = useState(false);
  const [formError, setFormError] = useState('');
  const [location, setLocation] = useState<'KATY' | 'SUGARLAND' | null>(null);
  const [frequency, setFrequency] = useState<'ONCE' | 'TWICE' | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayKey | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Waitlist UI state
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [waitlistLoc] = useState<LocationKey | null>(null);
  const [waitlistDay, setWaitlistDay] = useState<DayKey | ''>('');
  const [wlStudentName, setWlStudentName] = useState('');
  const [wlAge, setWlAge] = useState('');
  const [wlParent, setWlParent] = useState('');
  const [wlPhone, setWlPhone] = useState('');
  const [wlEmail, setWlEmail] = useState('');
  const [wlNotes, setWlNotes] = useState('');
  const [wlSubmitting, setWlSubmitting] = useState(false);
  const [wlMsg, setWlMsg] = useState<string>('');


  const [studentName, setStudentName] = useState('');
  const [age, setAge] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  const frequencyRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);
  const twiceStepRef = useRef<HTMLDivElement>(null);

  const formRef = useRef<HTMLDivElement>(null);

  const [sections, setSections] = useState<Section[]>([]);
const [selectedSections, setSelectedSections] = useState<Section[]>([]);
const [twiceDayStep, setTwiceDayStep] = useState<'Monday' | 'Thursday' | null>(null);




useEffect(() => {
  (async () => {
    try {
      const r = await fetch('/api/sections');
      if (!r.ok) {
        const txt = await r.text();
        console.error('GET /api/sections failed:', r.status, txt);
        return; // leave previous state in place
      }
      const j = await r.json();
      console.log('Sections loaded:', j.sections); // <-- keep for debugging
      setSections(Array.isArray(j.sections) ? j.sections : []);
    } catch (e) {
      console.error('GET /api/sections network error', e);
    }
  })();
}, []);

useEffect(() => {
  if (location !== 'SUGARLAND') return;
  const need = frequency === 'TWICE' ? 2 : 1;
  setFormVisible(selectedSections.length >= need);
}, [location, frequency, selectedSections]);

const sugarlandSectionsByDay = (day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday') =>
  sections
    .filter(s => s.location === 'SUGARLAND' && s.day === day)
    .sort((a, b) => a.label.localeCompare(b.label));


// Does this Sugar Land day have at least one open section?
const sugarlandDayHasOpenSection = (day: DayKey) =>
  sugarlandSectionsByDay(day).some(s => s.seatsRemaining > 0);

// Is the TWICE option unavailable for Sugar Land?
const sugarlandTwiceUnavailable = () =>
  !(sugarlandDayHasOpenSection('Monday') && sugarlandDayHasOpenSection('Thursday'));


const toggleSection = (section: Section) => {
  setSelectedSections(prev => {
    const exists = prev.some(p => p.id === section.id);
    if (exists) return prev.filter(p => p.id !== section.id);
    if (frequency === 'ONCE') return [section];
    const next = [...prev, section];
    if (next.length > 2) next.shift();
    return next;
  });
};

const pickSectionForDay = (sec: Section) => {
  setSelectedSections(prev => {
    // keep selection from the *other* day; replace this day
    const others = prev.filter(s => s.day !== sec.day);
    return [...others, sec];
  });

  // advance step: after Monday, go to Thursday
  if (location === 'SUGARLAND' && frequency === 'TWICE') {
    if (sec.day === 'Monday') setTwiceDayStep('Thursday');
  }
};


const calcTotalSugarLand = () => {
  if (selectedSections.length === 0) return 0;
  if (selectedSections.length === 1) return Math.round(selectedSections[0].priceCents / 100);
  const bothB = selectedSections.every(s => s.label === 'B');
  if (bothB) return 380; // $380 for both B’s
  const sum = selectedSections.reduce((acc, s) => acc + s.priceCents, 0);
  return Math.round(sum / 100);
};

  const [classCounts, setClassCounts] = useState<Counts>({
    KATY: { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0 },
    SUGARLAND: { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0 },
  });

  // const openWaitlist = (loc: LocationKey, day?: DayKey) => {
  //   setWaitlistLoc(loc);
  //   setWaitlistDay(day ?? ''); // '' means choose from dropdown in the sheet
  //   setWaitlistOpen(true);
  //   setWlMsg('');
  // };

  const closeWaitlist = () => {
    setWaitlistOpen(false);
    setWlStudentName(''); setWlAge(''); setWlParent('');
    setWlPhone(''); setWlEmail(''); setWlNotes(''); setWlMsg('');
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!waitlistLoc) return;

  const requestedDay = waitlistDay || (location ? daysMap[waitlistLoc].find(d => isSoldOut(waitlistLoc, d)) : '');

  if (!requestedDay) {
    setWlMsg('Please choose a day.');
    return;
  }

  setWlSubmitting(true);
  try {
    const resp = await fetch('/api/waitList', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: wlStudentName.trim(),
        age: Number(wlAge || 0),
        parentName: wlParent.trim(),
        phone: wlPhone.trim(),
        email: wlEmail.trim(),
        location: waitlistLoc,
        requestedDay,
        notes: wlNotes.trim(),
      })
    });
    const j = await resp.json();
    if (j.success) {
      setWlMsg('You’re on the list! We’ll email you as soon as we have information on more classes and dates! 🎉');
      // optional: close after a short delay
      // setTimeout(closeWaitlist, 1500);
    } else {
      setWlMsg(j.error || 'Something went wrong. Please try again.');
    }
  } catch {
    setWlMsg('Network error. Please try again.');
  } finally {
    setWlSubmitting(false);
  }
};



  const fetchCounts = async () => {
    try {
      const r = await fetch('/api/classCounts');
      const j = await r.json();
      if (j?.counts) setClassCounts(j.counts);
    } catch (e) {
      console.error('Failed to fetch class counts', e);
    }
  };

  useEffect(() => { fetchCounts(); }, []);

  const remainingFor = (loc: LocationKey, day: DayKey) =>
    Math.max(0, MAX_CLASS_SIZE - (classCounts[loc]?.[day] ?? 0));

  const isSoldOut = (loc: LocationKey, day: DayKey) => remainingFor(loc, day) === 0;

  const lowSpotsMsg = (loc: LocationKey, day: DayKey) => {
    const r = remainingFor(loc, day);
    return r > 0 && r <= 5 ? `Hurry! only ${r} spot${r === 1 ? '' : 's'} left!` : '';
  };

  // If either day at a location is sold out, block the TWICE option
 const twoDaysUnavailable = (loc: LocationKey | null) => {
  if (!loc) return false;
  if (loc === 'SUGARLAND') return sugarlandTwiceUnavailable();
  // Katy logic stays day-level
  return daysMap[loc].some(d => isSoldOut(loc, d));
};







  useEffect(() => {
    if (location && frequencyRef.current) {
      frequencyRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [location]);

const soldOutDaysMsg = (loc: LocationKey | null) => {
  if (!loc) return '';

  if (loc === 'SUGARLAND') {
    const monOpen = sugarlandDayHasOpenSection('Monday');
    const thuOpen = sugarlandDayHasOpenSection('Thursday');
    if (monOpen && thuOpen) return '';
    if (!monOpen && !thuOpen) return 'Both days sold out';
    return !monOpen ? 'Monday sold out' : 'Thursday sold out';
  }

  // Katy: legacy day-level counts
  const sold = daysMap[loc].filter(d => isSoldOut(loc, d));
  if (sold.length === 0) return '';
  if (sold.length === daysMap[loc].length) return 'Both days sold out';
  return sold.join(' and ') + ' sold out';
};



useEffect(() => {
  if (frequency === 'ONCE' && dayRef.current) {
    dayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else if (frequency === 'TWICE' && location === 'SUGARLAND') {
    setSelectedSections([]);
    setTwiceDayStep('Monday');
    setFormVisible(false);
    // 👇 scroll to the twice-step container
    setTimeout(() => {
      twiceStepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  } else if (frequency === 'TWICE') {
    // Katy (legacy) still shows form immediately
    setFormVisible(true);
  }
}, [frequency, location]);



  useEffect(() => {
    if (selectedDay) setFormVisible(true);
  }, [selectedDay]);

  useEffect(() => {
    if (formVisible && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

  }, [formVisible]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Clean & normalize spaces
  const cleanStudentName = studentName.trim().replace(/\s+/g, ' ');
  const cleanParentName = parentName.trim().replace(/\s+/g, ' ');
  const cleanEmail = email.trim();
  const cleanPhone = phone.trim();

  // Require all basic fields
  if (!cleanStudentName || !cleanParentName || !cleanEmail || !cleanPhone) {
    setFormError('All fields are required.');
    return;
  }

  // Allow multiple last names but require at least two words
  // const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)+$/;
  const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // if (!nameRegex.test(cleanStudentName)) {
  //   setFormError("Please enter the student's full name (at least first and last).");
  //   return;
  // }

  const parsedAge = parseInt(age);
  if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 17) {
    setFormError('Please enter a valid student age between 1 and 17.');
    return;
  }

  // if (!nameRegex.test(cleanParentName)) {
  //   setFormError("Please enter the parent's full name (at least first and last).");
  //   return;
  // }

  if (!phoneRegex.test(cleanPhone)) {
    setFormError('Please enter a valid 10-digit phone number.');
    return;
  }

  if (!emailRegex.test(cleanEmail)) {
    setFormError('Please enter a valid email address.');
    return;
  }

  if (!paymentMethod) {
    setFormError('Please select a payment method.');
    return;
  }

  if (!liabilityAccepted) {
    setFormError('You must accept the liability disclaimer to continue.');
    return;
  }

  setIsSubmitting(true);
  setFormError('');

  const selectedDays: DayKey[] =
    frequency === 'ONCE' ? [selectedDay!] : [...daysMap[location!]];

  // pick correct start date string
  const chosenStartDate =
    frequency === 'ONCE'
      ? startDates[location!][selectedDay!]
      : startDates[location!][daysMap[location!][0]]; // first day for 2-day schedule

  const startDateStr = chosenStartDate;


  // --- Sugar Land uses sectionIds instead of selectedDays ---
if (location === 'SUGARLAND') {
  if (frequency === 'ONCE' && selectedSections.length !== 1) {
    setFormError('Please choose one section'); setIsSubmitting(false); return;
  }
  if (frequency === 'TWICE' && selectedSections.length !== 2) {
    setFormError('Please choose two sections'); setIsSubmitting(false); return;
  }

  const sectionIds = selectedSections.map(s => s.id);

  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentName: cleanStudentName,
      age: parsedAge,
      parentName: cleanParentName,
      phone: cleanPhone,
      email: cleanEmail,
      paymentMethod: paymentMethod as RegistrationPayload['paymentMethod'],
      liabilityAccepted: true,
      waiverSignature: { name: cleanParentName, address: cleanEmail },
      sectionIds, // NEW
    }),
  });

  const data = await res.json();
  if (data.success) { setSubmitted(true); }
  else { setFormError('Something went wrong. Please try again.'); }
  setIsSubmitting(false);
  return;
}

// --- Legacy Katy payload ---
const payload: RegistrationPayload = {
  studentName: cleanStudentName,
  age: parsedAge,
  parentName: cleanParentName,
  phone: cleanPhone,
  email: cleanEmail,
  location: location!,
  frequency: frequency === 'ONCE' ? 'ONCE' : 'TWICE',
  selectedDays,
  startDate: startDateStr,
  liabilityAccepted: true,
  paymentMethod: paymentMethod as RegistrationPayload['paymentMethod'],
  waiverSignature: { name: cleanParentName, address: cleanEmail },
};

const res = await fetch('/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});


  const data = await res.json();

  if (data.success) {
    await fetch('/api/sendConfirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSubmitted(true);
    fetchCounts();

  } else {
    setFormError('Something went wrong. Please try again.');
  }

  setFormVisible(false);
  setLocation(null);
  setIsSubmitting(false);
};
const handleWaitlistDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setWaitlistDay(e.target.value as DayKey | '');
};


const resetForm = () => {
  setSubmitted(false);
  setFormVisible(false);
  setLocation(null);
  setFrequency(null);
  setSelectedDay(null);
  setStudentName('');
  setAge('');
  setParentName('');
  setPhone('');
  setEmail('');
  setPaymentMethod('');
  setLiabilityAccepted(false);
  setFormError('');
};

useEffect(() => {
  if (waitlistOpen) {
    document.body.classList.add('modal-open');
  } else {
    document.body.classList.remove('modal-open');
  }
  return () => document.body.classList.remove('modal-open');
}, [waitlistOpen]);


const calculateTotal = () => {
  if (!location || !frequency) return 0;
  // Sugar Land uses section-based pricing
  if (location === 'SUGARLAND') return calcTotalSugarLand();
  // Katy uses legacy day-based pricing
  if (frequency === 'ONCE' && selectedDay) return prices[location][selectedDay];
  if (frequency === 'TWICE') return prices[location].both;
  return 0;
};


  
  const personalizedWaiverText = (text: string) => {
    if (!studentName) return text;
    return text.replaceAll('PARTICIPANT', studentName.toUpperCase());
  };


  return (
    <div className="registration-wrapper">
      <div className="background-doodles">
        
      </div>

       <div className="logo-container">
            <img src="/bailakids/logo.png" alt="Baila Kids Logo" className="logo" />
        </div>


    {!submitted && (
      <>
      <div className="step">
        <h1 className="reg-title">Welcome to the Baila Kids class registration!</h1>
        <h1 className="title-moreinfo">This registration is valid for Fall 2025 (14 weeks)</h1>
        <h2 className="price-info">All prices listed below are the TOTAL amount for all 14 weeks</h2>
        <h2 className="questions">First, which is your preferred location?</h2>
        <div className="button-group">
          {(['KATY', 'SUGARLAND'] as const).map(loc => (
            <button key={loc} onClick={() => setLocation(loc)} className={location === loc ? 'active' : ''}>{loc}</button>
          ))}
        </div>
      </div>

      {location && (
        <div className="step fade-in" ref={frequencyRef}>
          <h2 className="questions">How often do you want classes?</h2>
          {/* <p className="daychose">
            {frequency === 'ONCE'
              ? 'Choose a day below to see individual pricing.'
              : `Total for both days: $${prices[location].both}`}
          </p> */}
          <div className="button-group">
            <button onClick={() => setFrequency('ONCE')} className={frequency === 'ONCE' ? 'active' : ''}>
              1 Day / Week (${selectedDay ? prices[location][selectedDay] : '245'})
            </button>
              <button
                onClick={() => setFrequency('TWICE')}
                className={frequency === 'TWICE' ? 'active' : ''}
                disabled={twoDaysUnavailable(location)}
              >
                2 Days / Week <span className="price-text">(${prices[location].both})</span>
                <span className="days-text">{daysMap[location].join(' and ')}</span>

                {/* Sold-out notice */}
                {location && soldOutDaysMsg(location) && (
                  <span className="soldout-note">{soldOutDaysMsg(location)}</span>
                )}
              </button>

            {/* {frequency === 'TWICE' && location && (
              <div className="selected-days-display">
                {daysMap[location].join(' and ')} selected
              </div>
            )} */}
          </div>

        </div>
      )}
      {/* --- Sugar Land TWICE: pick 2 sections --- */}
{location === 'SUGARLAND' && frequency === 'TWICE' && (
  <div className="step fade-in" ref={twiceStepRef}>
    <h2 className="questions">
      {twiceDayStep === 'Thursday'
        ? 'Choose your Thursday section'
        : 'Choose your Monday section'}
    </h2>

    {/* Step content */}
    {(['Monday','Thursday'] as DayKey[])
      .filter(day => day === (twiceDayStep ?? 'Monday'))
      .map(day => (
        <div key={day} className="day-option-wrapper">
          {/* <h3 className="day-header">{day}</h3> */}
          <div className="button-group">
            {sugarlandSectionsByDay(day).map(sec => {
              const selected = selectedSections.some(s => s.id === sec.id);
              const soldOut = sec.seatsRemaining === 0;
              const timeNote = sec.startTime && sec.endTime ? ` • ${sec.startTime}–${sec.endTime}` : '';
              const startNote = sec.label === 'B' ? ' • Starts Sep 15' : '';
              const priceNote = ` • $${(sec.priceCents / 100).toFixed(0)}`;

              return (
                <button
                  key={sec.id}
                  disabled={soldOut}
                  className={`${selected ? 'active' : ''} ${soldOut ? 'sold-out' : ''}`}
                  onClick={() => pickSectionForDay(sec)}
                >
                  <span className="day-label">{day} {sec.label}</span>
                  <span className="mini-note">{timeNote}{startNote}{priceNote}</span>
                </button>
              );
            })}
          </div>

          {/* Step controls */}
          <div className="button-group" style={{ marginTop: 12 }}>
            {twiceDayStep === 'Thursday' && (
              <button type="button" className="outline" onClick={() => setTwiceDayStep('Monday')}>
                ← Back to Monday
              </button>
            )}
            {twiceDayStep === 'Monday' && selectedSections.some(s => s.day === 'Monday') && (
              <button type="button" onClick={() => setTwiceDayStep('Thursday')}>
                Next: pick Thursday →
              </button>
            )}
          </div>
        </div>
      ))}

    {/* Live summary of chosen sections + total */}
    <div style={{ marginTop: 16 }}>
      <p><strong>Chosen:</strong>{' '}
        {selectedSections.length === 0
          ? '—'
          : selectedSections
              .sort((a,b) => (a.day < b.day ? -1 : 1))
              .map(s => `${s.day} ${s.label}`)
              .join(', ')
        }
      </p>
      <p className="total">Total: ${calcTotalSugarLand()}</p>
    </div>
  </div>
)}



      

      {/* --- Sugar Land ONCE: Section-based --- */}
      {location === 'SUGARLAND' && frequency === 'ONCE' && (
        <div className="step fade-in" ref={dayRef}>
          <h2 className="questions">Choose your class</h2>
          {(['Monday','Thursday'] as DayKey[]).map(day => (
            <div key={day} className="day-option-wrapper">
              {/* <h3 className="day-header">{day}</h3> */}
              <div className="button-group">
                {sugarlandSectionsByDay(day).map(sec => {
                  const selected = selectedSections.some(s => s.id === sec.id);
                  const soldOut = sec.seatsRemaining === 0;
                  const timeNote = sec.startTime && sec.endTime ? ` • ${sec.startTime}–${sec.endTime}` : '';
                  const startNote = sec.label === 'B' ? ' • Starts Sep 15' : '';
                  const priceNote = ` • $${(sec.priceCents / 100).toFixed(0)}`;

                  return (
                    <button
                      key={sec.id}
                      disabled={soldOut}
                      className={`${selected ? 'active' : ''} ${soldOut ? 'sold-out' : ''}`}
                      onClick={() => toggleSection(sec)}
                      aria-pressed={selected}
                    >
                      <span className="day-label">{day} {sec.label}</span>
                      <span className="mini-note">{timeNote}{startNote}{priceNote}</span>
                      <span className="spot-note">
                        {soldOut ? 'Sold out' :
                          sec.seatsRemaining <= 5 ? `Hurry! only ${sec.seatsRemaining} left!` : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <p className="total">Total: ${calcTotalSugarLand()}</p>
        </div>
      )}

      {/* --- KATY ONCE: Legacy --- */}
      {location === 'KATY' && frequency === 'ONCE' && (
        <div className="step fade-in" ref={dayRef}>
          <h2 className="questions">Choose your day of the week (classes start the week of August 25th,2025)</h2>
          <div className="button-group">
            {daysMap[location].map(day => (
              <div className="day-option-wrapper" key={day}>
                <div className="day-option">
                  <button
                    onClick={() => setSelectedDay(day)}
                    className={`${selectedDay === day ? 'active' : ''} ${isSoldOut(location, day) ? 'sold-out' : ''}`}
                    disabled={isSoldOut(location, day)}
                  >
                    <span className="day-label">{day}</span>
                    <span className="spot-note">
                      {isSoldOut(location, day) ? 'Sold out' : lowSpotsMsg(location, day)}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {formVisible && !submitted && (
        <div className="step fade-in" ref={formRef}>
          <h2 className="student-reg-title">Student Registration</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Student's FIRST and LAST Name" required value={studentName} onChange={e => setStudentName(e.target.value)} />
            <select
              className="form-input"
              required
              value={age}
              onChange={e => setAge(e.target.value)}
            >
              <option value="">Student Age</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>


            <input type="text" placeholder="Parent/Guardian FIRST and LAST Name" required value={parentName} onChange={e => setParentName(e.target.value)} />
            <input type="text" placeholder="Phone" required value={phone} onChange={e => setPhone(e.target.value)} />
            <input placeholder="Email" required type="email" value={email} onChange={e => setEmail(e.target.value)} />

            <p className="total">Total: ${calculateTotal()}</p>

            <fieldset>
              <legend>Select Payment Method:</legend>
              <label><input type="radio" name="payment" value="Cash" onChange={e => setPaymentMethod(e.target.value)} required /> Cash</label>
              <label><input type="radio" name="payment" value="Zelle" onChange={e => setPaymentMethod(e.target.value)} /> Zelle</label>
              <label><input type="radio" name="payment" value="Check" onChange={e => setPaymentMethod(e.target.value)} /> Check</label>
            </fieldset>

            <div className="liability-section">
              <h3 className="liability-title">Liability Waiver</h3>
              <div className="liability-text">
                <p>
                  {personalizedWaiverText(
                    `On behalf of myself and my child/children participating in dance classes and related activities (“PARTICIPANT”), I acknowledge and understand the risks of physical injury inherent to dance classes and performances, including, without limitation, the risk of PARTICIPANT’s serious bodily injury or death. I understand that it is my responsibility to consult with a physician prior to and regarding PARTICIPANT’s participation in classes offered by BAILA KIDS.`
                  )}
                </p>
                <p>
                  {personalizedWaiverText(
                    `On behalf of myself, and PARTICIPANT, I willingly assume such risks and I hereby expressly waive, release and hold harmless BAILA KIDS, its principals, officers, employees, agents, independent contractors and dance teachers (“RELEASEES”) from any and all liability, claims, judgments, or demands, arising from injuries sustained or illnesses contracted by PARTICIPANT while attending or participating in any dance classes, camps, rehearsals, workshops, birthday parties, events or performances. I covenant not to make or bring any such claim against BAILA KIDS or any other releasee and forever release and discharge BAILA KIDS and all other releasees from liability under such claims.`
                  )}
                </p>
                <p>
                  {personalizedWaiverText(
                    `Further, I hereby represent that PARTICIPANT has no physical or mental disability or impairment or any illness that will endanger PARTICIPANT or others in connection with PARTICIPANT's participation in the dance classes and performances offered by BAILA KIDS. Furthermore, I agree to obey the class and facility rules and take full responsibility for PARTICIPANT’s behavior in addition to any damage that PARTICIPANT may cause to the facilities utilized by BAILA KIDS. In the event that I observe any unsafe conduct or conditions before, during or after classes offered by BAILA KIDS, I agree to report the unsafe conduct or conditions to the owner, director, instructor or staff member as soon as possible.`
                  )}
                </p>
              </div>


              <label className="liability-checkbox">
                <input
                  type="checkbox"
                  checked={liabilityAccepted}
                  onChange={e => setLiabilityAccepted(e.target.checked)}
                />
                I ACCEPT AND ACKNOWLEDGE
              </label>
            </div>


            {formError && <p className="error">{formError}</p>}

            {formVisible && !submitted && (
              <div className="summary-box">
                <h3 className='summary-title'>Summary: Please confirm that all information is correct</h3>
                <ul>
                  <li><strong>Location:</strong> {location}</li>
                  <li><strong>Frequency:</strong> {frequency === 'ONCE' ? 'Once a week' : 'Twice a week'}</li>
                  {location === 'SUGARLAND' ? (
                    <>
                      <li>
                        <strong>Selected Class(es):</strong>{' '}
                        {selectedSections.length === 0
                          ? '—'
                          : selectedSections
                              .map(s => {
                                const time = s.startTime && s.endTime ? ` (${s.startTime}–${s.endTime})` : '';
                                return `${s.day} ${s.label}${time}`;
                              })
                              .join(', ')
                        }
                      </li>
                      <li>
                        <strong>Start Date{selectedSections?.length > 1 ? 's' : ''}:</strong>{' '}
                        {selectedSections.length === 0
                          ? '—'
                          : selectedSections
                              .map(s => {
                                // API gives ISO; trim to YYYY-MM-DD for your formatter
                                const ymd = s.startDate ? s.startDate.slice(0, 10) : '';
                                return `${s.day}: ${formatDateNoWeekday(ymd)}`;
                              })
                              .join(' | ')
                        }
                      </li>
                    </>
                  ) : (
                    <>
                      <li><strong>Selected Day(s):</strong> {frequency === 'ONCE' ? selectedDay : daysMap[location!].join(', ')}</li>
                      <li>
                        <strong>Start Date{frequency === 'TWICE' ? 's' : ''}:</strong>{' '}
                        {frequency === 'ONCE'
                          ? formatReadableDate(startDates[location!][selectedDay!])
                          : daysMap[location!]
                              .map(day => `${day}: ${formatReadableDate(startDates[location!][day])}`)
                              .join(' | ')
                        }
                      </li>
                      <li><strong className='final-total'>Total: ${calculateTotal()}</strong></li>
                    </>
                  )}

                  <li><strong>Student:</strong> {studentName} (Age: {age})</li>
                  <li><strong>Parent:</strong> {parentName}</li>
                  <li><strong>Phone:</strong> {phone}</li>
                  <li><strong>Email:</strong> {email}</li>
                  <li><strong>
                    Payment method: </strong>{paymentMethod} 
                    {paymentMethod === 'Zelle' && (
                      <> (further instructions in confirmation email)</>
                    )}
                    {paymentMethod === ('Cash') && (
                      <> (payment must be made before first day of classes)</>
                    )}
                    {paymentMethod === ('Check') && (
                      <> (payment must be made before first day of classes)</>
                    )}
                  </li>                  
                  <li><strong  className='final-total'>Total: ${calculateTotal()}</strong></li>
                </ul>
              </div>
            )}


            <button type="submit" disabled={isSubmitting || !studentName || !age || !parentName || !phone || !email || !paymentMethod || !liabilityAccepted}>
              {isSubmitting ? 'Submitting...' : 'Register'}
            </button>
          </form>
        </div>
      )}
      </>
    )}

      {submitted && (
        <div className="confirmation">
          <h2 className="confirmation-title">🎉 Registration Complete! 🎉</h2>
          <p className="confirmation-text">
            Thank you for registering. We’ve received your information and will send you a confirmation email shortly! <br/> <strong></strong>(Check your spam folder)
          </p>
          <button className="reset-button" onClick={resetForm}>
            Submit another application
          </button>
        </div>
      )}
{waitlistOpen && (
  <div
    className="sheet"
    role="dialog"
    aria-modal="true"
    onMouseDown={(e) => { if (e.target === e.currentTarget) closeWaitlist(); }}
    onTouchStart={(e) => { if (e.target === e.currentTarget) closeWaitlist(); }}
  >
    <div className="sheet__panel" onClick={(e) => e.stopPropagation()}>
      <div className="sheet__grab" aria-hidden />
         <button
        type="button"
        className="sheet__close"
        aria-label="Close waitlist"
        onClick={closeWaitlist}
      >
        
      </button>
      <h3 className="sheet__title">We’re opening more classes soon!</h3>
      <p className="sheet__sub">Join the waitlist and we’ll email you as soon as we have information on more classes and dates!</p>

      <form onSubmit={handleWaitlistSubmit} className="sheet__form" noValidate>
        <div className="sheet__row">
          <label>Location</label>
          <input value={waitlistLoc ?? ''} readOnly />
        </div>

        <div className="sheet__row">
          <label>Requested day</label>
          {waitlistDay ? (
            <input value={waitlistDay} readOnly />
          ) : (
            <select
              value={waitlistDay}
              onChange={handleWaitlistDayChange}
              required
            >

              <option value="">Choose a day</option>
              {waitlistLoc && daysMap[waitlistLoc]
                .filter(d => isSoldOut(waitlistLoc, d))
                .map(d => <option key={d} value={d}>{d}</option>
              )}
            </select>
          )}
        </div>

        <div className="sheet__row"><label>Student name</label>
          <input required value={wlStudentName} onChange={e => setWlStudentName(e.target.value)} />
        </div>
        <div className="sheet__row"><label>Age</label>
          <input type="number" min={1} max={17} required value={wlAge} onChange={e => setWlAge(e.target.value)} />
        </div>
        <div className="sheet__row"><label>Parent/Guardian</label>
          <input required value={wlParent} onChange={e => setWlParent(e.target.value)} />
        </div>
        <div className="sheet__row"><label>Phone</label>
          <input required value={wlPhone} onChange={e => setWlPhone(e.target.value)} />
        </div>
        <div className="sheet__row"><label>Email</label>
          <input type="email" required value={wlEmail} onChange={e => setWlEmail(e.target.value)} />
        </div>
        <div className="sheet__row"><label>Notes (optional)</label>
          <input value={wlNotes} onChange={e => setWlNotes(e.target.value)} />
        </div>

        {wlMsg && <div className="sheet__msg">{wlMsg}</div>}

        <div className="sheet__actions">
          <button type="button" className="toggle-btn outline" onClick={closeWaitlist}>Cancel</button>
          <button type="submit" className="toggle-btn" disabled={wlSubmitting}>
            {wlSubmitting ? 'Joining…' : 'Join waitlist'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}




    </div>
    
  );
}
