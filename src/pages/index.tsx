import { useEffect, useMemo, useRef, useState } from 'react';

type CityKey = 'HOUSTON' | 'DALLAS';

type SchoolKey =
  | 'KATY'
  | 'SUGARLAND'
  | 'ALLEN'
  | 'FRISCO'
  | 'CASTLE_HILLS'
  | 'NORTH_DALLAS'
  | 'PRESTON_TRAIL';

export type DayKey =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday';

type FrequencyChoice = 'ONCE' | 'TWICE';
type ApiFrequency = 'ONCE_A_WEEK' | 'TWICE_A_WEEK';
type PaymentMethod = 'Cash' | 'Zelle' | 'Check';

type Section = {
  id: string;
  city: CityKey;
  school: SchoolKey;
  day: DayKey;
  label: string;
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  eligibleClasses: string[];
  priceCents: number;
  bundlePriceCents?: number | null;
  capacity: number;
  activeCount: number;
  seatsRemaining: number;
};

type SectionsResponse = {
  registrationOpen: boolean;
  sections: Section[];
  error?: string;
};

type RegistrationPayload = {
  studentName: string;
  age: number;
  parentName: string;
  phone: string;
  email: string;
  city: CityKey;
  school: SchoolKey;
  frequency: ApiFrequency;
  selectedDays: DayKey[];
  startDate: string;
  sectionIds: string[];
  liabilityAccepted: boolean;
  paymentMethod: PaymentMethod;
  waiverSignature: { name: string; address: string };
};

const SESSION_LABEL = 'Fall 2026';

const CITY_LABELS: Record<CityKey, string> = {
  HOUSTON: 'Houston',
  DALLAS: 'Dallas',
};

const SCHOOL_LABELS: Record<SchoolKey, string> = {
  KATY: 'Katy',
  SUGARLAND: 'Sugar Land',
  ALLEN: 'Allen',
  FRISCO: 'Frisco',
  CASTLE_HILLS: 'Castle Hills',
  NORTH_DALLAS: 'North Dallas',
  PRESTON_TRAIL: 'Preston Trail',
};

const CITY_ORDER: CityKey[] = ['HOUSTON', 'DALLAS'];
const SCHOOL_ORDER: SchoolKey[] = [
  'KATY',
  'SUGARLAND',
  'ALLEN',
  'FRISCO',
  'CASTLE_HILLS',
  'NORTH_DALLAS',
  'PRESTON_TRAIL',
];

const DAY_ORDER: Record<DayKey, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
};

// Keep genuine bundle discounts here. Schools without an entry use the sum
// of the selected section prices, so future schools work without UI rewrites.


const normalizeFrequency = (frequency: FrequencyChoice): ApiFrequency =>
  frequency === 'ONCE' ? 'ONCE_A_WEEK' : 'TWICE_A_WEEK';

const parseYMDLocal = (ymd: string) => {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const ymdFromIso = (value?: string | null) => value?.slice(0, 10) ?? '';

const formatMonthDayShort = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const formatDateNoWeekday = (ymd?: string) => {
  if (!ymd) return '';

  const date = parseYMDLocal(ymd);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const suffix =
    day % 10 === 1 && day % 100 !== 11
      ? 'st'
      : day % 10 === 2 && day % 100 !== 12
        ? 'nd'
        : day % 10 === 3 && day % 100 !== 13
          ? 'rd'
          : 'th';

  return `${month} ${day}${suffix}`;
};



const rangeNoteForSection = (section: Section) => {
  const startYMD = ymdFromIso(section.startDate);
  const endYMD = ymdFromIso(section.endDate);

  if (!startYMD || !endYMD) return '';

  return `• ${formatMonthDayShort(parseYMDLocal(startYMD))}–${formatMonthDayShort(
    parseYMDLocal(endYMD),
  )}`;
};

const rangeNoteForSections = (sections: Section[]) => {
  const starts = sections
    .map(section => ymdFromIso(section.startDate))
    .filter(Boolean)
    .map(parseYMDLocal);

  const ends = sections
    .map(section => ymdFromIso(section.endDate))
    .filter(Boolean)
    .map(parseYMDLocal);

  if (starts.length === 0 || ends.length === 0) return '';

  const earliestStart = new Date(
    Math.min(...starts.map(date => date.getTime())),
  );

  const latestEnd = new Date(
    Math.max(...ends.map(date => date.getTime())),
  );

  return `• ${formatMonthDayShort(earliestStart)}–${formatMonthDayShort(latestEnd)}`;
};

const sortSections = (a: Section, b: Section) =>
  DAY_ORDER[a.day] - DAY_ORDER[b.day] ||
  a.label.localeCompare(b.label) ||
  (a.startTime ?? '').localeCompare(b.startTime ?? '');

const unique = <T,>(values: T[]) => Array.from(new Set(values));

export default function Home() {
  const [registrationOpen, setRegistrationOpen] = useState<boolean | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loadError, setLoadError] = useState('');

  const [city, setCity] = useState<CityKey | null>(null);
  const [school, setSchool] = useState<SchoolKey | null>(null);
  const [frequency, setFrequency] = useState<FrequencyChoice | null>(null);
  const [selectedSections, setSelectedSections] = useState<Section[]>([]);

  const [studentName, setStudentName] = useState('');
  const [age, setAge] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [liabilityAccepted, setLiabilityAccepted] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistCity, setWaitlistCity] = useState<CityKey | null>(null);
  const [waitlistSchool, setWaitlistSchool] = useState<SchoolKey | null>(null);
  const [waitlistDay, setWaitlistDay] = useState<DayKey | ''>('');
  const [wlStudentName, setWlStudentName] = useState('');
  const [wlAge, setWlAge] = useState('');
  const [wlParent, setWlParent] = useState('');
  const [wlPhone, setWlPhone] = useState('');
  const [wlEmail, setWlEmail] = useState('');
  const [wlNotes, setWlNotes] = useState('');
  const [wlSubmitting, setWlSubmitting] = useState(false);
  const [wlMsg, setWlMsg] = useState('');

  const schoolRef = useRef<HTMLDivElement>(null);
  const frequencyRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSections = async () => {
      try {
        const response = await fetch('/api/sections');
        const data = (await response.json()) as SectionsResponse;

        if (!response.ok) {
          throw new Error(data.error || 'Could not load class schedules.');
        }

        if (!cancelled) {
          setRegistrationOpen(data.registrationOpen);
          setSections(Array.isArray(data.sections) ? data.sections : []);
          setLoadError('');
        }
      } catch (error) {
        console.error('GET /api/sections failed', error);
        if (!cancelled) {
          setRegistrationOpen(false);
          setLoadError('We could not load the class schedules. Please refresh and try again.');
        }
      }
    };

    void loadSections();
    return () => {
      cancelled = true;
    };
  }, []);

  const availableCities = useMemo(
    () =>
      CITY_ORDER.filter(cityKey =>
        sections.some(section => section.city === cityKey),
      ),
    [sections],
  );

  const availableSchools = useMemo(() => {
    if (!city) return [];

    return SCHOOL_ORDER.filter(schoolKey =>
      sections.some(
        section => section.city === city && section.school === schoolKey,
      ),
    );
  }, [city, sections]);

  const schoolSections = useMemo(() => {
    if (!city || !school) return [];

    return sections
      .filter(section => section.city === city && section.school === school)
      .sort(sortSections);
  }, [city, school, sections]);

  const onceSections = schoolSections;

  const twiceGroups = useMemo(() => {
    const byLabel = new Map<string, Section[]>();

    for (const section of schoolSections) {
      const current = byLabel.get(section.label) ?? [];
      current.push(section);
      byLabel.set(section.label, current);
    }

    return Array.from(byLabel.entries())
      .map(([label, groupSections]) => {
        const bundleSections = groupSections.filter(
          section => section.bundlePriceCents != null,
        );

        return {
          label,
          sections: bundleSections.sort(sortSections),
        };
      })
      .filter(group => {
        const distinctDays = unique(group.sections.map(section => section.day));
        return distinctDays.length === 2;
      });
  }, [schoolSections]);

  const onceAvailable = onceSections.some(section => section.seatsRemaining > 0);
  const twiceAvailable = twiceGroups.some(group =>
    group.sections.every(section => section.seatsRemaining > 0),
  );

  const soldOutDays = useMemo(
    () =>
      unique(
        schoolSections
          .filter(section => section.seatsRemaining === 0)
          .map(section => section.day),
      ).sort((a, b) => DAY_ORDER[a] - DAY_ORDER[b]),
    [schoolSections],
  );

  const expectedSectionCount = frequency === 'TWICE' ? 2 : 1;
  const formVisible =
    !!city &&
    !!school &&
    !!frequency &&
    selectedSections.length === expectedSectionCount;

  const selectedDays = useMemo(
    () =>
      unique(selectedSections.map(section => section.day)).sort(
        (a, b) => DAY_ORDER[a] - DAY_ORDER[b],
      ),
    [selectedSections],
  );

  const totalCents = useMemo(() => {
    if (selectedSections.length === 0) return 0;

    if (frequency === 'TWICE') {
      const bundlePrice = selectedSections[0]?.bundlePriceCents;

      return (
        bundlePrice ??
        selectedSections.reduce((sum, section) => sum + section.priceCents, 0)
      );
    }

    return selectedSections[0]?.priceCents ?? 0;
  }, [frequency, selectedSections]);

  const isFridayClass = selectedSections.some(section => section.day === 'Friday');

  useEffect(() => {
    if (city) {
      schoolRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [city]);

  useEffect(() => {
    if (school) {
      frequencyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [school]);

  useEffect(() => {
    if (frequency) {
      scheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [frequency]);

  useEffect(() => {
    if (formVisible) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [formVisible]);

  useEffect(() => {
    document.body.classList.toggle('modal-open', waitlistOpen);
    return () => document.body.classList.remove('modal-open');
  }, [waitlistOpen]);

  const selectCity = (nextCity: CityKey) => {
    setCity(nextCity);
    setSchool(null);
    setFrequency(null);
    setSelectedSections([]);
    setFormError('');
  };

  const selectSchool = (nextSchool: SchoolKey) => {
    setSchool(nextSchool);
    setFrequency(null);
    setSelectedSections([]);
    setFormError('');
  };

  const selectFrequency = (nextFrequency: FrequencyChoice) => {
    setFrequency(nextFrequency);
    setSelectedSections([]);
    setFormError('');
  };

  const selectOneSection = (section: Section) => {
    if (section.seatsRemaining <= 0) return;
    setSelectedSections([section]);
    setFormError('');
  };

  const selectTwiceGroup = (groupSections: Section[]) => {
    if (groupSections.some(section => section.seatsRemaining <= 0)) return;
    setSelectedSections(groupSections);
    setFormError('');
  };

  const openWaitlist = (section?: Section) => {
    setWaitlistCity(section?.city ?? city);
    setWaitlistSchool(section?.school ?? school);
    setWaitlistDay(section?.day ?? '');
    setWaitlistOpen(true);
    setWlMsg('');
  };

  const closeWaitlist = () => {
    setWaitlistOpen(false);
    setWaitlistCity(null);
    setWaitlistSchool(null);
    setWaitlistDay('');
    setWlStudentName('');
    setWlAge('');
    setWlParent('');
    setWlPhone('');
    setWlEmail('');
    setWlNotes('');
    setWlMsg('');
  };

  const waitlistDays = useMemo(() => {
    if (!waitlistCity || !waitlistSchool) return [];

    return unique(
      sections
        .filter(
          section =>
            section.city === waitlistCity &&
            section.school === waitlistSchool &&
            section.seatsRemaining === 0,
        )
        .map(section => section.day),
    ).sort((a, b) => DAY_ORDER[a] - DAY_ORDER[b]);
  }, [sections, waitlistCity, waitlistSchool]);

  const handleWaitlistSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!waitlistCity || !waitlistSchool || !waitlistDay) {
      setWlMsg('Please choose a sold-out class day.');
      return;
    }

    setWlSubmitting(true);
    setWlMsg('');

    try {
      const response = await fetch('/api/waitList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: wlStudentName.trim(),
          age: Number(wlAge),
          parentName: wlParent.trim(),
          phone: wlPhone.trim(),
          email: wlEmail.trim(),
          city: waitlistCity,
          school: waitlistSchool,
          requestedDay: waitlistDay,
          notes: wlNotes.trim(),
        }),
      });

      const data = (await response.json()) as { success: boolean; error?: string };
      setWlMsg(
        response.ok && data.success
          ? 'You’re on the list! We’ll email you as soon as we have information on more classes and dates! '
          : data.error || 'Something went wrong. Please try again.',
      );
    } catch {
      setWlMsg('Network error. Please try again.');
    } finally {
      setWlSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const cleanStudentName = studentName.trim().replace(/\s+/g, ' ');
    const cleanParentName = parentName.trim().replace(/\s+/g, ' ');
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const parsedAge = Number.parseInt(age, 10);
    const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!city || !school || !frequency) {
      setFormError('Please choose a city, school, and class schedule.');
      return;
    }

    if (selectedSections.length !== expectedSectionCount) {
      setFormError(
        frequency === 'TWICE'
          ? 'Please choose one complete two-day schedule.'
          : 'Please choose one class.',
      );
      return;
    }

    if (!cleanStudentName || !cleanParentName || !cleanEmail || !cleanPhone) {
      setFormError('All fields are required.');
      return;
    }

    if (Number.isNaN(parsedAge) || parsedAge < 1 || parsedAge > 17) {
      setFormError('Please enter a valid student age between 1 and 17.');
      return;
    }

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

    const firstStartDate = selectedSections
      .map(section => ymdFromIso(section.startDate))
      .filter(Boolean)
      .sort()[0];

    if (!firstStartDate) {
      setFormError('The selected class is missing a start date.');
      return;
    }

    const payload: RegistrationPayload = {
      studentName: cleanStudentName,
      age: parsedAge,
      parentName: cleanParentName,
      phone: cleanPhone,
      email: cleanEmail,
      city,
      school,
      frequency: normalizeFrequency(frequency),
      selectedDays,
      startDate: firstStartDate,
      sectionIds: selectedSections.map(section => section.id),
      liabilityAccepted: true,
      paymentMethod,
      waiverSignature: { name: cleanParentName, address: cleanEmail },
    };

    setIsSubmitting(true);
    setFormError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Registration failed.');
      }

      const confirmationResponse = await fetch('/api/sendConfirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!confirmationResponse.ok) {
        console.error('Registration succeeded, but confirmation email failed.');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Registration submit failed', error);
      setFormError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setCity(null);
    setSchool(null);
    setFrequency(null);
    setSelectedSections([]);
    setStudentName('');
    setAge('');
    setParentName('');
    setPhone('');
    setEmail('');
    setPaymentMethod('');
    setLiabilityAccepted(false);
    setFormError('');
  };

  const personalizedWaiverText = (text: string) =>
    studentName
      ? text.replaceAll('PARTICIPANT', studentName.toUpperCase())
      : text;

  if (registrationOpen === null) {
    return <div>Loading…</div>;
  }

  if (loadError) {
    return (
      <div className="registration-closed">
        <h1>Registration unavailable</h1>
        <p>{loadError}</p>
      </div>
    );
  }

  if (!registrationOpen) {
    return (
      <div className="registration-closed">
        <h1>{SESSION_LABEL} Registration Opens Soon</h1>
        <p>Registration is not open yet. Please check back soon.</p>
        <p>Thank you!</p>
      </div>
    );
  }

  return (
    <div className="registration-wrapper">
    <div className="registration-card">
      <div className="background-doodles" />

      <div className="logo-container">
        <img src="/bailakids/logo.png" alt="Baila Kids Logo" className="logo" />
      </div>

      {!submitted && (
        <>
          <div className="step">
            <h1 className="reg-title">Welcome to the Baila Kids class registration!</h1>
            <h1 className="title-moreinfo">
              This registration is valid for the {SESSION_LABEL} session
            </h1>
            <h2 className="price-info">
              All prices listed below are the total session amount
            </h2>
            <h2 className="questions">First, which city?</h2>

            <div className="button-group">
              {availableCities.map(cityOption => (
                <button
                  key={cityOption}
                  type="button"
                  onClick={() => selectCity(cityOption)}
                  className={city === cityOption ? 'active' : ''}
                >
                  {CITY_LABELS[cityOption]}
                </button>
              ))}
            </div>
          </div>

          {city && (
            <div className="step fade-in" ref={schoolRef}>
              <h2 className="questions">Which school location?</h2>
              <div className="button-group">
                {availableSchools.map(schoolOption => (
                  <button
                    key={schoolOption}
                    type="button"
                    onClick={() => selectSchool(schoolOption)}
                    className={school === schoolOption ? 'active' : ''}
                  >
                    {SCHOOL_LABELS[schoolOption]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {school && (
            <div className="step fade-in" ref={frequencyRef}>
              <h2 className="questions">How often do you want classes?</h2>
              <div className="button-group">
                <button
                  type="button"
                  onClick={() => selectFrequency('ONCE')}
                  className={frequency === 'ONCE' ? 'active' : ''}
                  disabled={!onceAvailable}
                >
                  1 Day / Week
                  {!onceAvailable && <span className="soldout-note">Sold out</span>}
                </button>

                <div className="frequency-button-wrapper">
                <button
                  type="button"
                  onClick={() => selectFrequency('TWICE')}
                  className={frequency === 'TWICE' ? 'active' : ''}
                  disabled={!twiceAvailable}
                >
                  2 Days / Week
                  {!twiceAvailable && (
                    <span className="soldout-note">There is no two day schedule available for this location.</span>
                  )}
                </button>
                 <div className="bundle-save-badge">
                  SAVE 5%
                </div>
                </div>
              </div>

              {soldOutDays.length > 0 && (
                <p className="soldout-note">
                  Sold-out day{soldOutDays.length === 1 ? '' : 's'}: {soldOutDays.join(', ')}
                </p>
              )}
            </div>
          )}

          {school && frequency === 'ONCE' && (
            <div className="step fade-in" ref={scheduleRef}>
              <h2 className="questions">Choose your class</h2>


              <div className="button-group">
                {onceSections.map(section => {
                  const selected = selectedSections.some(item => item.id === section.id);
                  const soldOut = section.seatsRemaining <= 0;
                  const time =
                    section.startTime && section.endTime
                      ? ` • ${section.startTime}–${section.endTime}`
                      : '';
                  const price = ` • $${(section.priceCents / 100).toFixed(0)}`;

                  return (
                    <div className="day-option-wrapper" key={section.id}>
                      <div className="day-option">
                        <button
                          type="button"
                          disabled={soldOut}
                          className={`choice-card ${selected ? 'active' : ''} ${
                            soldOut ? 'sold-out' : ''
                          }`}
                          onClick={() => selectOneSection(section)}
                          aria-pressed={selected}
                        >
                          <div className="schedule-card">
                            <div className="schedule-top">
                              <span className="group-name">
                                {section.day} · Group {section.label}
                              </span>
                              <span className="price-tag">
                                ${(section.priceCents / 100).toFixed(0)}
                              </span>
                            </div>

                            <div className="schedule-meta-row">
                              <span className="schedule-meta-label">Time</span>
                              <span className="schedule-meta-value">
                                {time.replace(' • ', '')}
                              </span>
                            </div>

                            <div className="schedule-meta-row">
                              <span className="schedule-meta-label">Session</span>
                              <span className="schedule-meta-value">
                                {rangeNoteForSection(section).replace('• ', '')}
                              </span>
                            </div>

                            <div className="schedule-meta-row">
                              <span className="schedule-meta-label">Classes</span>
                              <span className="schedule-meta-value">
                                {section.eligibleClasses.join(', ')}
                              </span>
                            </div>

                            {section.seatsRemaining <= 5 && !soldOut && (
                              <div className="spots-warning">
                                Only {section.seatsRemaining} spot{
                                  section.seatsRemaining === 1 ? '' : 's'
                                } left
                              </div>
                            )}

                            {soldOut && <div className="soldout-pill">Sold out</div>}
                          </div>
                        </button>

                        {soldOut && (
                          <button
                            type="button"
                            className="waitlist-btn"
                            onClick={() => openWaitlist(section)}
                          >
                            Join waitlist
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="total">Total: ${(totalCents / 100).toFixed(0)}</p>
            </div>
          )}

          {school && frequency === 'TWICE' && (
            <div className="step fade-in" ref={scheduleRef}>
              <h2 className="questions">Choose your two-day schedule</h2>

              <div className="button-group">
                {twiceGroups.map(group => {
                  const selected =
                    selectedSections.length === 2 &&
                    group.sections.every(section =>
                      selectedSections.some(item => item.id === section.id),
                    );
                  const soldOut = group.sections.some(section => section.seatsRemaining <= 0);
                  const days = group.sections.map(section => section.day).join(' & ');
                  const timeLabels = unique(
                    group.sections
                      .map(section =>
                        section.startTime && section.endTime
                          ? `${section.startTime}–${section.endTime}`
                          : '',
                      )
                      .filter(Boolean),
                  );
                  const time = timeLabels.length > 0 ? ` • ${timeLabels.join(' / ')}` : '';
                  const groupTotal =
                    group.sections[0].bundlePriceCents ??
                    group.sections.reduce((sum, section) => sum + section.priceCents, 0);
                  const minimumRemaining = Math.min(
                    ...group.sections.map(section => section.seatsRemaining),
                  );

                  return (
                    <div className="day-option-wrapper" key={group.label}>
                      <div className="day-option">
                        <button
                          type="button"
                          disabled={soldOut}
                          className={`choice-card ${selected ? 'active' : ''} ${
                            soldOut ? 'sold-out' : ''
                          }`}
                          onClick={() => selectTwiceGroup(group.sections)}
                          aria-pressed={selected}
                        >
                          <div className="schedule-card">
                            
                            <div className="schedule-top">
                              <span className="group-name">
                                Group {group.label}
                              </span>
                              <span className="price-tag">
                                ${(groupTotal / 100).toFixed(0)}
                              </span>
                            </div>
                            <div className="schedule-days">{days}</div>

                            <div className="schedule-meta-row">
                              <span className="schedule-meta-label">Time</span>
                              <span className="schedule-meta-value">
                                {time.replace(' • ', '')}
                              </span>
                            </div>

                            <div className="schedule-meta-row">
                              <span className="schedule-meta-label">Session</span>
                              <span className="schedule-meta-value">
                                {rangeNoteForSections(group.sections).replace('• ', '')}
                              </span>
                            </div>

                            <div className="schedule-meta-row">
                              <span className="schedule-meta-label">Classes</span>
                              <span className="schedule-meta-value">
                                {group.sections[0].eligibleClasses.join(', ')}
                              </span>
                            </div>
                            {minimumRemaining <= 5 && !soldOut && (
                                <div className="spots-warning">
                                  Hurry! Only {minimumRemaining} spot{minimumRemaining===1?"":"s"} left
                                </div>
                            )}

                            {soldOut && (
                                <div className="soldout-pill">
                                  Sold Out
                                </div>
                            )}

                          </div>

                        </button>

                        {soldOut && (
                          <button
                            type="button"
                            className="waitlist-btn"
                            onClick={() => openWaitlist(group.sections.find(s => s.seatsRemaining <= 0))}
                          >
                            Join waitlist
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="selection-summary">
                <div className="summary-header">
                  <span className="summary-title">Your selection</span>
                  <span className="summary-total">
                    Total: ${(totalCents / 100).toFixed(0)}
                  </span>
                </div>
                <div className="chip-row">
                  <span
                    className={`chip ${
                      selectedSections.length === 2 ? 'chip-ok' : 'chip-missing'
                    }`}
                  >
                    {selectedSections.length === 2
                      ? `Group ${selectedSections[0].label} • ${selectedDays.join(' & ')}`
                      : 'Choose a complete two-day schedule'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {formVisible && (
            <div className="step fade-in" ref={formRef}>
              <h2 className="student-reg-title">Student Registration</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Student's FIRST and LAST Name"
                  required
                  value={studentName}
                  onChange={event => setStudentName(event.target.value)}
                />

                <select
                  className="form-input"
                  required
                  value={age}
                  onChange={event => setAge(event.target.value)}
                >
                  <option value="">Student Age</option>
                  {isFridayClass ? (
                    <>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </>
                  ) : (
                    <>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </>
                  )}
                </select>

                <input
                  type="text"
                  placeholder="Parent/Guardian FIRST and LAST Name"
                  required
                  value={parentName}
                  onChange={event => setParentName(event.target.value)}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  required
                  value={phone}
                  onChange={event => setPhone(event.target.value)}
                />
                <input
                  placeholder="Email"
                  required
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                />

                <p className="total">Total: ${(totalCents / 100).toFixed(0)}</p>

                <fieldset>
                  <legend>Select Payment Method:</legend>
                  {(['Cash', 'Zelle', 'Check'] as const).map(method => (
                    <label key={method}>
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        required={method === 'Cash'}
                      />{' '}
                      {method}
                    </label>
                  ))}
                </fieldset>

                <div className="liability-section">
                  <h3 className="liability-title">Liability Waiver</h3>
                  <div className="liability-text">
                    <p>
                      {personalizedWaiverText(
                        `On behalf of myself and my child/children participating in dance classes and related activities (“PARTICIPANT”), I acknowledge and understand the risks of physical injury inherent to dance classes and performances, including, without limitation, the risk of PARTICIPANT’s serious bodily injury or death. I understand that it is my responsibility to consult with a physician prior to and regarding PARTICIPANT’s participation in classes offered by BAILA KIDS.`,
                      )}
                    </p>
                    <p>
                      {personalizedWaiverText(
                        `On behalf of myself, and PARTICIPANT, I willingly assume such risks and I hereby expressly waive, release and hold harmless BAILA KIDS, its principals, officers, employees, agents, independent contractors and dance teachers (“RELEASEES”) from any and all liability, claims, judgments, or demands, arising from injuries sustained or illnesses contracted by PARTICIPANT while attending or participating in any dance classes, camps, rehearsals, workshops, birthday parties, events or performances. I covenant not to make or bring any such claim against BAILA KIDS or any other releasee and forever release and discharge BAILA KIDS and all other releasees from liability under such claims.`,
                      )}
                    </p>
                    <p>
                      {personalizedWaiverText(
                        `Further, I hereby represent that PARTICIPANT has no physical or mental disability or impairment or any illness that will endanger PARTICIPANT or others in connection with PARTICIPANT's participation in the dance classes and performances offered by BAILA KIDS. Furthermore, I agree to obey the class and facility rules and take full responsibility for PARTICIPANT’s behavior in addition to any damage that PARTICIPANT may cause to the facilities utilized by BAILA KIDS. In the event that I observe any unsafe conduct or conditions before, during or after classes offered by BAILA KIDS, I agree to report the unsafe conduct or conditions to the owner, director, instructor or staff member as soon as possible.`,
                      )}
                    </p>
                  </div>

                  <label className="liability-checkbox">
                    <input
                      type="checkbox"
                      checked={liabilityAccepted}
                      onChange={event => setLiabilityAccepted(event.target.checked)}
                    />
                    I ACCEPT AND ACKNOWLEDGE
                  </label>
                </div>

                {formError && <p className="error">{formError}</p>}

                <div className="summary-box">
                  <h3 className="summary-title">
                    Summary: Please confirm that all information is correct
                  </h3>
                  <ul>
                    <li>
                      <strong>City:</strong> {city ? CITY_LABELS[city] : '—'}
                    </li>
                    <li>
                      <strong>School:</strong> {school ? SCHOOL_LABELS[school] : '—'}
                    </li>
                    <li>
                      <strong>Frequency:</strong>{' '}
                      {frequency === 'ONCE' ? 'Once a week' : 'Twice a week'}
                    </li>
                    <li>
                      <strong>Selected Class(es):</strong>{' '}
                      {selectedSections
                        .map(section => {
                          const time =
                            section.startTime && section.endTime
                              ? ` (${section.startTime}–${section.endTime})`
                              : '';
                          return `${section.day} ${section.label}${time}`;
                        })
                        .join(', ')}
                    </li>
                    <li>
                      <strong>Start Date{selectedSections.length > 1 ? 's' : ''}:</strong>{' '}
                      {selectedSections
                        .map(section => {
                          const ymd = ymdFromIso(section.startDate);
                          return `${section.day}: ${formatDateNoWeekday(ymd)}`;
                        })
                        .join(' | ')}
                    </li>
                    <li>
                      <strong>Student:</strong> {studentName} (Age: {age})
                    </li>
                    <li>
                      <strong>Parent:</strong> {parentName}
                    </li>
                    <li>
                      <strong>Phone:</strong> {phone}
                    </li>
                    <li>
                      <strong>Email:</strong> {email}
                    </li>
                    <li>
                      <strong>Payment method:</strong> {paymentMethod}
                      {paymentMethod === 'Zelle' &&
                        ' (further instructions in confirmation email)'}
                      {(paymentMethod === 'Cash' || paymentMethod === 'Check') &&
                        ' (payment must be made before the first day of classes)'}
                    </li>
                    <li>
                      <strong className="final-total">
                        Total: ${(totalCents / 100).toFixed(0)}
                      </strong>
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !studentName ||
                    !age ||
                    !parentName ||
                    !phone ||
                    !email ||
                    !paymentMethod ||
                    !liabilityAccepted
                  }
                >
                  {isSubmitting ? 'Submitting...' : 'Register'}
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {submitted && (
        <div className="confirmation">
          <h2 className="confirmation-title"> Registration Complete! </h2>
          <p className="confirmation-text">
            Thank you for registering. We’ve received your information and will send you a
            confirmation email shortly! <br /> (Check your spam folder)
          </p>
          <button className="reset-button" type="button" onClick={resetForm}>
            Submit another application
          </button>
        </div>
      )}

      {waitlistOpen && (
        <div
          className="sheet"
          role="dialog"
          aria-modal="true"
          onMouseDown={event => {
            if (event.target === event.currentTarget) closeWaitlist();
          }}
          onTouchStart={event => {
            if (event.target === event.currentTarget) closeWaitlist();
          }}
        >
          <div className="sheet__panel" onClick={event => event.stopPropagation()}>
            <div className="sheet__grab" aria-hidden />
            <button
              type="button"
              className="sheet__close"
              aria-label="Close waitlist"
              onClick={closeWaitlist}
            />

            <h3 className="sheet__title">We’re opening more classes soon!</h3>
            <p className="sheet__sub">
              Join the waitlist and we’ll email you as soon as we have information on more
              classes and dates!
            </p>

            <form onSubmit={handleWaitlistSubmit} className="sheet__form" noValidate>
              <div className="sheet__row">
                <label>City</label>
                <input value={waitlistCity ? CITY_LABELS[waitlistCity] : ''} readOnly />
              </div>

              <div className="sheet__row">
                <label>School</label>
                <input value={waitlistSchool ? SCHOOL_LABELS[waitlistSchool] : ''} readOnly />
              </div>

              <div className="sheet__row">
                <label>Requested day</label>
                {waitlistDay ? (
                  <input value={waitlistDay} readOnly />
                ) : (
                  <select
                    value={waitlistDay}
                    onChange={event => setWaitlistDay(event.target.value as DayKey | '')}
                    required
                  >
                    <option value="">Choose a day</option>
                    {waitlistDays.map(day => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="sheet__row">
                <label>Student name</label>
                <input
                  required
                  value={wlStudentName}
                  onChange={event => setWlStudentName(event.target.value)}
                />
              </div>
              <div className="sheet__row">
                <label>Age</label>
                <input
                  type="number"
                  min={1}
                  max={17}
                  required
                  value={wlAge}
                  onChange={event => setWlAge(event.target.value)}
                />
              </div>
              <div className="sheet__row">
                <label>Parent/Guardian</label>
                <input
                  required
                  value={wlParent}
                  onChange={event => setWlParent(event.target.value)}
                />
              </div>
              <div className="sheet__row">
                <label>Phone</label>
                <input
                  required
                  value={wlPhone}
                  onChange={event => setWlPhone(event.target.value)}
                />
              </div>
              <div className="sheet__row">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={wlEmail}
                  onChange={event => setWlEmail(event.target.value)}
                />
              </div>
              <div className="sheet__row">
                <label>Notes (optional)</label>
                <input
                  value={wlNotes}
                  onChange={event => setWlNotes(event.target.value)}
                />
              </div>

              {wlMsg && <div className="sheet__msg">{wlMsg}</div>}

              <div className="sheet__actions">
                <button
                  type="button"
                  className="toggle-btn outline"
                  onClick={closeWaitlist}
                >
                  Cancel
                </button>
                <button type="submit" className="toggle-btn" disabled={wlSubmitting}>
                  {wlSubmitting ? 'Joining…' : 'Join waitlist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}