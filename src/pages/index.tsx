import { useState, useRef, useEffect } from 'react';
// import { useTranslation } from 'next-i18next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// import '@/styles/registration.css'; // Local scoped CSS in /styles


// Utility types

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
  frequency: 'ONCE_A_WEEK' | 'TWICE_A_WEEK';
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

  const [studentName, setStudentName] = useState('');
  const [age, setAge] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  const frequencyRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location && frequencyRef.current) {
      frequencyRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [location]);

  useEffect(() => {
    if (frequency === 'ONCE' && dayRef.current) {
      dayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (frequency === 'TWICE') {
      setFormVisible(true);
    }

  }, [frequency]);

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
  const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)+$/;
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


  const payload: RegistrationPayload = {
    studentName: cleanStudentName,
    age: parsedAge,
    parentName: cleanParentName,
    phone: cleanPhone,
    email: cleanEmail,
    location: location!,
    frequency: frequency === 'ONCE' ? 'ONCE_A_WEEK' : 'TWICE_A_WEEK',
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
  } else {
    setFormError('Something went wrong. Please try again.');
  }

  setFormVisible(false);
  setLocation(null);
  setIsSubmitting(false);
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



  const calculateTotal = () => {
    if (!location || !frequency) return 0;
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
            <button onClick={() => setFrequency('TWICE')} className={frequency === 'TWICE' ? 'active' : ''}>
              2 Days / Week <span className="price-text">(${prices[location].both})</span>
                <span className="days-text">{daysMap[location].join(' and ')}</span>

            </button>
            {frequency === 'TWICE' && location && (
              <div className="selected-days-display">
                {daysMap[location].join(' and ')} selected
              </div>
            )}
          </div>

        </div>
      )}

      {location && frequency === 'ONCE' && (
        <div className="step fade-in" ref={dayRef}>
          <h2 className="questions">Choose your day of the week (classes start the week of August 25th,2025)</h2>
            <div className="button-group">

              {daysMap[location].map(day => (
                <div className="day-option-wrapper" key={day}>
                  <div className="day-option">
                    <button
                      onClick={() => setSelectedDay(day)}
                      className={selectedDay === day ? 'active' : ''}
                    >
                      {day}
                      {location === 'SUGARLAND' && day === 'Monday' && (
                        <span style={{ fontSize: '0.75rem', display: 'block', marginTop: '4px', color: '#fff' }}>
                          No class on Memorial Day!
                        </span>
                      )}
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

    </div>
  );
}
