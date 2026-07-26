--
-- PostgreSQL database dump
--

\restrict 8qXEhvGN2E2GQhF4lZp51gq3uNraSYpnhOjFRA8HOyg7zuze3Af1rGGCCq1qdwO

-- Dumped from database version 17.10 (2947584)
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: student-registration_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "student-registration_owner";

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: student-registration_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: ClassFrequency; Type: TYPE; Schema: public; Owner: student-registration_owner
--

CREATE TYPE public."ClassFrequency" AS ENUM (
    'ONCE_A_WEEK',
    'TWICE_A_WEEK'
);


ALTER TYPE public."ClassFrequency" OWNER TO "student-registration_owner";

--
-- Name: Day; Type: TYPE; Schema: public; Owner: student-registration_owner
--

CREATE TYPE public."Day" AS ENUM (
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
);


ALTER TYPE public."Day" OWNER TO "student-registration_owner";

--
-- Name: EnrollmentStatus; Type: TYPE; Schema: public; Owner: student-registration_owner
--

CREATE TYPE public."EnrollmentStatus" AS ENUM (
    'ACTIVE',
    'WAITLISTED',
    'CANCELLED'
);


ALTER TYPE public."EnrollmentStatus" OWNER TO "student-registration_owner";

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: student-registration_owner
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'PAID',
    'FAILED'
);


ALTER TYPE public."PaymentStatus" OWNER TO "student-registration_owner";

--
-- Name: SchoolLocation; Type: TYPE; Schema: public; Owner: student-registration_owner
--

CREATE TYPE public."SchoolLocation" AS ENUM (
    'KATY',
    'SUGARLAND'
);


ALTER TYPE public."SchoolLocation" OWNER TO "student-registration_owner";

--
-- Name: Session; Type: TYPE; Schema: public; Owner: student-registration_owner
--

CREATE TYPE public."Session" AS ENUM (
    'FALL_2024',
    'SPRING_2025',
    'FALL_2025',
    'SPRING_2026'
);


ALTER TYPE public."Session" OWNER TO "student-registration_owner";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AppConfig; Type: TABLE; Schema: public; Owner: student-registration_owner
--

CREATE TABLE public."AppConfig" (
    key text NOT NULL,
    value text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AppConfig" OWNER TO "student-registration_owner";

--
-- Name: ClassSection; Type: TABLE; Schema: public; Owner: student-registration_owner
--

CREATE TABLE public."ClassSection" (
    id text NOT NULL,
    location public."SchoolLocation" NOT NULL,
    day public."Day" NOT NULL,
    label text DEFAULT 'A'::text NOT NULL,
    "startDate" timestamp(3) without time zone,
    "startTime" text,
    "endTime" text,
    capacity integer DEFAULT 22 NOT NULL,
    "priceCents" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    session public."Session" DEFAULT 'FALL_2024'::public."Session" NOT NULL
);


ALTER TABLE public."ClassSection" OWNER TO "student-registration_owner";

--
-- Name: Enrollment; Type: TABLE; Schema: public; Owner: student-registration_owner
--

CREATE TABLE public."Enrollment" (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "sectionId" text NOT NULL,
    status public."EnrollmentStatus" DEFAULT 'ACTIVE'::public."EnrollmentStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    session public."Session" DEFAULT 'FALL_2024'::public."Session" NOT NULL
);


ALTER TABLE public."Enrollment" OWNER TO "student-registration_owner";

--
-- Name: Student; Type: TABLE; Schema: public; Owner: student-registration_owner
--

CREATE TABLE public."Student" (
    id text NOT NULL,
    "studentName" text NOT NULL,
    age integer NOT NULL,
    "parentName" text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    location public."SchoolLocation" NOT NULL,
    frequency public."ClassFrequency" NOT NULL,
    "selectedDays" text[],
    "startDate" timestamp(3) without time zone NOT NULL,
    "paymentStatus" public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "paymentMethod" text,
    "liabilityAccepted" boolean DEFAULT false NOT NULL,
    "waiverName" text,
    "waiverAddress" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    session public."Session" DEFAULT 'FALL_2024'::public."Session" NOT NULL
);


ALTER TABLE public."Student" OWNER TO "student-registration_owner";

--
-- Name: WaitingList; Type: TABLE; Schema: public; Owner: student-registration_owner
--

CREATE TABLE public."WaitingList" (
    id text NOT NULL,
    "studentName" text NOT NULL,
    age integer NOT NULL,
    "parentName" text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    location public."SchoolLocation" NOT NULL,
    "requestedDay" text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    session public."Session" DEFAULT 'FALL_2024'::public."Session" NOT NULL
);


ALTER TABLE public."WaitingList" OWNER TO "student-registration_owner";

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: student-registration_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO "student-registration_owner";

--
-- Data for Name: AppConfig; Type: TABLE DATA; Schema: public; Owner: student-registration_owner
--

COPY public."AppConfig" (key, value, "updatedAt") FROM stdin;
ACTIVE_SESSION	SPRING_2026	2025-12-28 01:22:18.609
REGISTRATION_OPEN	true	2025-12-28 02:08:46.871
\.


--
-- Data for Name: ClassSection; Type: TABLE DATA; Schema: public; Owner: student-registration_owner
--

COPY public."ClassSection" (id, location, day, label, "startDate", "startTime", "endTime", capacity, "priceCents", "isActive", session) FROM stdin;
cmew8bhnn0000uuk0rouwv1zq	SUGARLAND	Monday	B	2025-09-15 00:00:00	3:00 PM	3:30 PM	22	19500	t	FALL_2025
cmew8jgel0000uukwl0jmosps	SUGARLAND	Monday	A	2025-08-25 00:00:00	2:10 PM\t	2:45 PM	22	23000	t	FALL_2025
cmew8k41b0000uu90nvncv4xb	KATY	Wednesday	A	2025-08-27 00:00:00	2:10 PM	2:45 PM	22	24500	t	FALL_2025
cmew8jnup0000uutosw0n4xci	SUGARLAND	Thursday	A	2025-08-28 00:00:00	2:10 PM	2:45 PM	22	24500	t	FALL_2025
cmew8k1qs0000uuy0uw206p1q	KATY	Tuesday	A	2025-08-26 00:00:00	2:10 PM	2:45 PM	22	24500	t	FALL_2025
cmew8jqjo0000uuycrjvh45sg	SUGARLAND	Thursday	B	2025-09-18 00:00:00	3:00 PM	3:30 PM	12	19500	t	FALL_2025
7807f5ce-7a67-461f-9ce2-10c004d4f026	SUGARLAND	Friday	A	2026-01-23 00:00:00	2:10 PM	2:45 PM	12	28000	t	SPRING_2026
d52fe3c6-3db3-4935-a460-c700c9ee41d2	SUGARLAND	Friday	B	2026-01-23 00:00:00	3:00 PM	3:30 PM	12	28000	t	SPRING_2026
87b31ee5-f6e0-492d-ba71-7fff9ed9e938	SUGARLAND	Thursday	B	2026-01-22 00:00:00	3:00 PM	3:30 PM	18	28000	t	SPRING_2026
780f9ffc-f0c8-43ce-b4b9-13fcc57896b4	SUGARLAND	Monday	B	2026-01-26 00:00:00	3:00 PM	3:30 PM	18	26500	t	SPRING_2026
820051e3-b268-466a-8ad1-6dc0b8857d49	KATY	Tuesday	A	2026-01-20 00:00:00	2:10 PM	2:45 PM	18	28000	t	SPRING_2026
1fa5ecc8-9f1f-4987-b4de-aebd67715a49	SUGARLAND	Monday	A	2026-01-26 00:00:00	2:10 PM	2:45 PM	18	26500	t	SPRING_2026
bb9532ca-a618-44e5-88f2-dc445516e5a0	SUGARLAND	Thursday	A	2026-01-22 00:00:00	2:10 PM	2:45 PM	18	28000	t	SPRING_2026
a098131f-9090-4dc3-a7ff-6aaae1b86ebf	KATY	Wednesday	A	2026-01-21 00:00:00	2:10 PM	2:45 PM	18	28000	t	SPRING_2026
\.


--
-- Data for Name: Enrollment; Type: TABLE DATA; Schema: public; Owner: student-registration_owner
--

COPY public."Enrollment" (id, "studentId", "sectionId", status, "createdAt", session) FROM stdin;
cmjxk9ape0001la04ns6753ra	e000328e-4eb1-4c36-b6fe-42b662edaf99	780f9ffc-f0c8-43ce-b4b9-13fcc57896b4	ACTIVE	2026-01-03 00:24:44.402	SPRING_2026
cmjxk9aq00003la04exmn95e9	e000328e-4eb1-4c36-b6fe-42b662edaf99	87b31ee5-f6e0-492d-ba71-7fff9ed9e938	ACTIVE	2026-01-03 00:24:44.424	SPRING_2026
cmk1lalkl0001la040a7lno9j	ed157fa5-e959-48d7-94f4-f878d88348fc	87b31ee5-f6e0-492d-ba71-7fff9ed9e938	ACTIVE	2026-01-05 20:04:49.462	SPRING_2026
cmk1ljd3i0001l704rx0rcedg	78e2c36a-9ad3-48c9-b41a-05ce111f5092	780f9ffc-f0c8-43ce-b4b9-13fcc57896b4	ACTIVE	2026-01-05 20:11:38.382	SPRING_2026
cmk1lv3g10003l704ak7yhpag	bb17eec4-2a92-4283-a6b1-8b1e26252bdf	780f9ffc-f0c8-43ce-b4b9-13fcc57896b4	ACTIVE	2026-01-05 20:20:45.746	SPRING_2026
cmk1lv3gh0005l704jp2a515t	bb17eec4-2a92-4283-a6b1-8b1e26252bdf	87b31ee5-f6e0-492d-ba71-7fff9ed9e938	ACTIVE	2026-01-05 20:20:45.761	SPRING_2026
cmk1mlygz0001ju042ntkgb7a	ae067ce0-2721-4a88-ac9a-7965e4e47baa	780f9ffc-f0c8-43ce-b4b9-13fcc57896b4	ACTIVE	2026-01-05 20:41:39.012	SPRING_2026
cmk1mlyhq0003ju048pca85x0	ae067ce0-2721-4a88-ac9a-7965e4e47baa	87b31ee5-f6e0-492d-ba71-7fff9ed9e938	ACTIVE	2026-01-05 20:41:39.039	SPRING_2026
cmk1mokn00001l104yt7m460o	659cb558-f981-4580-a8a3-e75fde335bfb	d52fe3c6-3db3-4935-a460-c700c9ee41d2	ACTIVE	2026-01-05 20:43:41.051	SPRING_2026
cmk1nbqvr0001jp04ru0bioa7	a5366fb2-5cf6-4e9c-b457-052c1d0cdf40	87b31ee5-f6e0-492d-ba71-7fff9ed9e938	ACTIVE	2026-01-05 21:01:42.232	SPRING_2026
cmk1nqryl0001l804sczlm2at	0d5d5efe-64d0-45fd-ad3a-2e4f1a7fd00a	1fa5ecc8-9f1f-4987-b4de-aebd67715a49	ACTIVE	2026-01-05 21:13:23.469	SPRING_2026
cmk1tpbm90001l104owy6h2nn	13ffe710-4379-45b0-bfd9-2a80da3daa71	1fa5ecc8-9f1f-4987-b4de-aebd67715a49	ACTIVE	2026-01-06 00:00:13.33	SPRING_2026
cmk1tpbmy0003l104i4bz0nna	13ffe710-4379-45b0-bfd9-2a80da3daa71	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-06 00:00:13.354	SPRING_2026
cmk3iwcs60001l204viq1ucpy	ad8df1f5-2f2b-4991-88cc-399778ea283a	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-07 04:33:18.007	SPRING_2026
cmk45e44x0001l504i2ww8mqn	9230b9c2-dffc-4dd2-b6f1-cae72a7ad771	1fa5ecc8-9f1f-4987-b4de-aebd67715a49	ACTIVE	2026-01-07 15:02:58.161	SPRING_2026
cmk46hzib0001jv04tuie45xt	1aca3b61-d9bc-4892-bccd-c64139e6fe1a	780f9ffc-f0c8-43ce-b4b9-13fcc57896b4	ACTIVE	2026-01-07 15:33:58.403	SPRING_2026
cmk46hzj00003jv04wmbrc2pw	1aca3b61-d9bc-4892-bccd-c64139e6fe1a	87b31ee5-f6e0-492d-ba71-7fff9ed9e938	ACTIVE	2026-01-07 15:33:58.428	SPRING_2026
cmk654qj20001ky04ws730sb5	d898bd8b-50c2-4b85-ab43-e14b22705759	780f9ffc-f0c8-43ce-b4b9-13fcc57896b4	ACTIVE	2026-01-09 00:31:12.974	SPRING_2026
cmk654qk00003ky042ap7upb2	d898bd8b-50c2-4b85-ab43-e14b22705759	87b31ee5-f6e0-492d-ba71-7fff9ed9e938	ACTIVE	2026-01-09 00:31:13.008	SPRING_2026
cmk6zuw020001jv048kfatrcb	c2eb95e5-8fac-458f-96b4-28ee38f36e70	d52fe3c6-3db3-4935-a460-c700c9ee41d2	ACTIVE	2026-01-09 14:51:21.603	SPRING_2026
cmk7bb0fx0001jj04toiag8c7	6f921190-f2b0-448b-b569-4d21fd5bc930	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-09 20:11:49.629	SPRING_2026
cmk7foj8t0001l404yq5egj9y	d5ed431c-1ffb-4b23-a384-952af60fc89a	1fa5ecc8-9f1f-4987-b4de-aebd67715a49	ACTIVE	2026-01-09 22:14:18.989	SPRING_2026
cmk7foj9f0003l404szryvrio	d5ed431c-1ffb-4b23-a384-952af60fc89a	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-09 22:14:19.011	SPRING_2026
cmk9a2uob0001l504lnnfp8xb	b5fb751f-33be-44be-a898-f19825585c97	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-11 05:13:01.643	SPRING_2026
cmkbix7ha0001la04kuj79as4	6df9e0b7-44e0-4881-a141-e67ccae27e7d	87b31ee5-f6e0-492d-ba71-7fff9ed9e938	ACTIVE	2026-01-12 18:56:07.199	SPRING_2026
cmkbketqg0001jr042ct6s7p4	fd147473-3e77-41c9-9f04-74f5f05bd2ce	1fa5ecc8-9f1f-4987-b4de-aebd67715a49	ACTIVE	2026-01-12 19:37:48.808	SPRING_2026
cmkbq0k5o0001jv042o17jyuo	79759d38-34bc-4948-b314-03001d5c7be3	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-12 22:14:40.909	SPRING_2026
cmkbq3oyz0001l404m34krb3s	a2dd042d-4cf7-44f6-994d-ed52c3bd2845	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-12 22:17:07.116	SPRING_2026
cmkcyxsdq0001la05k8rou7hz	d7e70964-8461-4a93-bdd6-992f4903f3fc	1fa5ecc8-9f1f-4987-b4de-aebd67715a49	ACTIVE	2026-01-13 19:12:14.318	SPRING_2026
cmkcyxseb0003la05oskbkzgq	d7e70964-8461-4a93-bdd6-992f4903f3fc	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-13 19:12:14.34	SPRING_2026
cmkcyynnh0005la05xgjyn6ng	d4f62e45-75e6-4f66-b4fe-a0526044eeb4	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-13 19:12:54.846	SPRING_2026
cmkcyz3al0007la053eoi2lzk	11c19778-95c0-481b-a60b-bca76c994d79	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-13 19:13:15.117	SPRING_2026
cmkg9iv710001l104gp4n0hhq	49f2ada2-b385-4467-8a61-6adb67a64961	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-16 02:31:52.43	SPRING_2026
cmkgdao8m0001kz04na7i2euf	2013e445-31bc-4379-b4b1-3cf170436d83	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-16 04:17:28.631	SPRING_2026
cmkgdbmum0003kz04yrgnvype	b960230a-84cc-48da-88bc-ae30fead8ac2	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-16 04:18:13.487	SPRING_2026
cmko9yhsj0001l704cw3404cz	7deaeab3-8b41-4d5b-981c-17b762c6a670	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-21 17:06:10.963	SPRING_2026
cmko9zyba0003l704wlot15xo	232aeccb-89ea-4a19-b5ed-0401a4d28acb	d52fe3c6-3db3-4935-a460-c700c9ee41d2	ACTIVE	2026-01-21 17:07:19.031	SPRING_2026
cmkocngt50001l104tojor3pq	4d160c02-ca69-471c-9d13-0fd3d771bc61	7807f5ce-7a67-461f-9ce2-10c004d4f026	ACTIVE	2026-01-21 18:21:35.321	SPRING_2026
cmkodu8po0001if04n5k6q95j	61a1b801-f9f2-4f2a-a80b-0c1dc1699e2d	d52fe3c6-3db3-4935-a460-c700c9ee41d2	ACTIVE	2026-01-21 18:54:51.036	SPRING_2026
cmkohxp040001js047mdn02m4	fe6b33c8-6198-4081-bb34-9ed045afb335	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-21 20:49:30.58	SPRING_2026
cmkoi5iqs0003js04pd5foygx	095587c3-47b9-4840-87d5-a0f67a3eef2b	780f9ffc-f0c8-43ce-b4b9-13fcc57896b4	ACTIVE	2026-01-21 20:55:35.717	SPRING_2026
cmkowctiw0001l204ldydqi58	469cad44-9e80-4355-8c6c-0b1c4d4e7027	7807f5ce-7a67-461f-9ce2-10c004d4f026	ACTIVE	2026-01-22 03:33:10.904	SPRING_2026
cmkpluszg0001l50436496skt	c20eeb78-136c-4f09-9632-a23bc1b5978d	7807f5ce-7a67-461f-9ce2-10c004d4f026	ACTIVE	2026-01-22 15:27:00.412	SPRING_2026
9987e650-0db9-4e62-bce4-d719057235ba	e2ac2ba3-58ca-4f6d-bf10-bd6ec9b62aed	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2026-01-22 15:33:55.195	FALL_2024
eca6a69b-8d66-46d3-b72f-8b13bdd943be	baad6ce9-cd7f-49c7-aff8-63afd2fc9225	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2026-01-22 15:34:18.674	FALL_2024
bf82a5e0-8551-425a-949a-8d4702385974	a2ee7824-dbd5-44dd-b36d-a07cf332ea6f	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2026-01-22 15:34:27.209	FALL_2024
cmkfm1yn30001jr04gxdznsgv	d37d5bcd-2ebd-471b-9936-cf6493a694aa	d52fe3c6-3db3-4935-a460-c700c9ee41d2	ACTIVE	2026-01-15 15:34:52.575	SPRING_2026
cmkgerhqi0001l504071hdxpc	d6246a1f-4080-466b-9fc3-464c090c8bb8	d52fe3c6-3db3-4935-a460-c700c9ee41d2	ACTIVE	2026-01-16 04:58:32.97	SPRING_2026
cmkbno7k50001l404o2vrkxqx	6257e248-1ea1-4a15-a6ed-99608dbab123	d52fe3c6-3db3-4935-a460-c700c9ee41d2	ACTIVE	2026-01-12 21:09:05.477	SPRING_2026
cmew8v7ct0001uuv8efiqya6i	5102fe8b-5f38-4c37-b538-6bda61890e3d	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:33.235	FALL_2025
cmew8v7qx0003uuv8blxretph	5102fe8b-5f38-4c37-b538-6bda61890e3d	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:33.754	FALL_2025
cmkoa2xrx0001ju04wm3px5d2	12cf22f6-72fc-4767-b2a8-dd8c5f44dc35	1fa5ecc8-9f1f-4987-b4de-aebd67715a49	ACTIVE	2026-01-21 17:09:38.301	SPRING_2026
7dfd90ef-bdb5-4fa5-9efe-436740360d70	78e2c36a-9ad3-48c9-b41a-05ce111f5092	87b31ee5-f6e0-492d-ba71-7fff9ed9e938	ACTIVE	2026-01-21 17:52:52.867	SPRING_2026
91b2ab62-5f30-44c8-943a-149d53f88be6	64d58951-72e4-4beb-bdcd-c0490e9c2b4e	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2026-01-22 15:34:36.258	FALL_2024
e7711f50-74bc-4e3d-8a05-b111abc43fad	f9549711-c130-405f-a064-92077c7cf244	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2026-01-22 15:34:43.216	FALL_2024
7709d4aa-e0c5-4791-b15f-0bbdad91da59	f34d971c-b008-4682-b76d-060d38a18a23	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2026-01-22 15:34:49.941	FALL_2024
0a44715b-5b60-4733-8e71-b3e371ff8212	9411459f-b5d4-45a9-a5d5-4849f3605c8d	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2026-01-22 15:34:56.473	FALL_2024
cmkod5tn20001ju04y0v3hasa	c57689fc-9c56-468f-bb89-5d8a443d7cf8	7807f5ce-7a67-461f-9ce2-10c004d4f026	ACTIVE	2026-01-21 18:35:51.758	SPRING_2026
c9e7ee16-e981-4eb4-8986-707eacef53e8	3529faa6-0d9c-4d66-94eb-79f5ae517b8c	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2026-01-22 15:34:12.135	FALL_2024
507bab8b-3b19-4d7b-8466-d431ce502499	3d4723c1-9a9f-459a-8c50-a01fb155346f	cmew8k41b0000uu90nvncv4xb	ACTIVE	2026-01-22 15:35:41.541	FALL_2024
611852ab-85ed-4d8f-b6ae-63e01cd0a304	233bc8c1-6359-4890-89c4-1d32529699d2	cmew8k41b0000uu90nvncv4xb	ACTIVE	2026-01-22 15:36:02.941	FALL_2024
d5343dcb-8593-4f1d-9d34-cccb780a6a7b	bad0413e-4df9-47b7-ae22-f09d1603b0ea	cmew8k41b0000uu90nvncv4xb	ACTIVE	2026-01-22 15:36:10.966	FALL_2024
17bffb32-ddb6-4f3f-b600-9cd20e069472	d7e87460-3ab5-42ee-91c0-393aa75850e9	cmew8k41b0000uu90nvncv4xb	ACTIVE	2026-01-22 15:36:18.929	FALL_2024
a27092dd-79e0-41cb-9dbe-5bafd5558ffa	24a25e7d-0a41-4111-830e-7898ed7be082	cmew8k41b0000uu90nvncv4xb	ACTIVE	2026-01-22 15:36:27.283	FALL_2024
cml1607ss0001jp04dpxeeehd	2a16d78c-4be7-4791-abc4-8eff95f0c334	1fa5ecc8-9f1f-4987-b4de-aebd67715a49	ACTIVE	2026-01-30 17:36:33.148	SPRING_2026
cml1g4hl30001kt04yg44azmw	b2f2e5c8-6e96-4e12-a1e3-46b0740e518a	7807f5ce-7a67-461f-9ce2-10c004d4f026	ACTIVE	2026-01-30 22:19:48.615	SPRING_2026
cml1hes2m0001l604me806n4j	e7de3adb-95be-4e39-9d23-e2a5965de996	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-30 22:55:48.382	SPRING_2026
cml8l7lwt0001l20495rspyl0	1957ad3d-b8a2-44fe-a29b-dadce71fad21	1fa5ecc8-9f1f-4987-b4de-aebd67715a49	ACTIVE	2026-02-04 22:16:35.501	SPRING_2026
cmlos9y5o0001i8048wfhyzd4	7ef4c457-74b4-4d5a-9821-ec39c6d3b786	1fa5ecc8-9f1f-4987-b4de-aebd67715a49	ACTIVE	2026-02-16 06:18:40.812	SPRING_2026
cmm9bf9o60001js042gkdu5ve	8ecee708-9b86-42e9-884f-b44d971a1fc7	1fa5ecc8-9f1f-4987-b4de-aebd67715a49	ACTIVE	2026-03-02 15:10:05.238	SPRING_2026
cmm9bfv5x0003js04jecdkvd7	9154cb52-dd38-41ae-a19b-a324ac390b4c	1fa5ecc8-9f1f-4987-b4de-aebd67715a49	ACTIVE	2026-03-02 15:10:33.094	SPRING_2026
cmew8v7zp0005uuv8ymht0pe2	a46ad716-ea58-4ab5-a0f4-1beb5f50cf52	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:34.07	FALL_2025
cmew8v88f0007uuv80eyceqy4	723e8d8d-906a-4b6f-bb41-3b0e70a5c5f4	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:34.383	FALL_2025
cmew8v8hj0009uuv85fd9n7vv	291a149c-1db5-4c6f-a76b-4cd749289a01	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:34.711	FALL_2025
cmew8v8q7000buuv8wl3asfgh	9b80540e-b7ad-4364-a4cc-607e679b83ed	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:35.023	FALL_2025
cmew8v975000fuuv8wc8o118m	e1d01961-11ca-4c54-aeb9-c8d80c754e5b	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:35.634	FALL_2025
cmew8v9ge000huuv8u1lkil6o	40cf1042-66bc-426a-9782-ea7a96062508	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-08-29 02:59:35.966	FALL_2025
cmew8v9p5000juuv8g1dc3320	398b8009-dc55-4ffe-af42-5d9579f6e6c6	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:36.281	FALL_2025
cmew8va78000nuuv8oxch6f9l	bbfaa558-84bb-49ff-9033-1830963a2996	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:36.932	FALL_2025
cmew8vapy000ruuv8up02nacq	a29614e0-142b-4337-bb07-88957e9b1ea7	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:37.606	FALL_2025
cmew8vayt000tuuv8h6edxzdv	160de9de-d809-471b-9e26-1bcb064b290d	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:37.925	FALL_2025
cmew8vb81000vuuv8cq3ijf76	160de9de-d809-471b-9e26-1bcb064b290d	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:38.257	FALL_2025
cmew8vbhq000xuuv8shrgaqrv	e73aaeaa-ecda-4d96-868d-b84e77691af6	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:38.606	FALL_2025
cmew8vbrx000zuuv8z5zl6l3e	608cbbeb-b132-48c5-affe-54e510c80a35	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-08-29 02:59:38.974	FALL_2025
cmew8vc2l0011uuv85docmk9h	608cbbeb-b132-48c5-affe-54e510c80a35	cmew8k41b0000uu90nvncv4xb	ACTIVE	2025-08-29 02:59:39.357	FALL_2025
cmew8vcbs0013uuv8wb3xvdvb	f7cf43d5-75a0-4040-8c2b-220a90bd71d4	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:39.688	FALL_2025
cmew8vcuc0017uuv8g677zyxk	e15a09f0-d4ed-4266-ae04-89ce4213a7a1	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:40.357	FALL_2025
cmew8vd2y0019uuv83o004mkv	e15a09f0-d4ed-4266-ae04-89ce4213a7a1	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:40.666	FALL_2025
cmew8vn34003fuuv8zewyf0bl	e11d0750-fde6-4254-baa1-0bc5c03363d3	cmew8k41b0000uu90nvncv4xb	ACTIVE	2025-08-29 02:59:53.632	FALL_2025
cmew8vnc9003huuv844o8h4jy	c86c6b61-9859-4a5d-bcc7-76527a84b64d	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:53.961	FALL_2025
cmew8vnlp003juuv8wutcml4h	66370281-3a1e-4b3b-8ce5-54a548c5d181	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-08-29 02:59:54.301	FALL_2025
cmew8vnv4003luuv829t631ov	1e2e2772-8d46-44e9-a7ac-09e41250cee1	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:54.64	FALL_2025
cmew8vo74003nuuv8t5r4g8aj	f7580384-1b43-47e0-b723-277f2485534a	cmew8k41b0000uu90nvncv4xb	ACTIVE	2025-08-29 02:59:55.073	FALL_2025
cmf2yafd80001i5041zwf0245	2b6099f8-a149-428f-a8d5-3ded704adddf	cmew8jqjo0000uuycrjvh45sg	ACTIVE	2025-09-02 19:37:50.925	FALL_2025
cmf2ybdie0003i504y9rx8gm6	7b967aa7-38f8-4e43-a2bc-7eddfd432eb9	cmew8jqjo0000uuycrjvh45sg	ACTIVE	2025-09-02 19:38:35.174	FALL_2025
cmf40941w0001jx0455mv7apv	34e53863-99ee-4fce-9e66-e7a4028b7563	cmew8jqjo0000uuycrjvh45sg	ACTIVE	2025-09-03 13:20:35.012	FALL_2025
cmf409f990001ju04st60nruq	d81eaa4b-56c0-4cb6-be1e-6224d65bc7eb	cmew8bhnn0000uuk0rouwv1zq	ACTIVE	2025-09-03 13:20:49.534	FALL_2025
cmf409f9p0003ju04r9e0uyw1	d81eaa4b-56c0-4cb6-be1e-6224d65bc7eb	cmew8jqjo0000uuycrjvh45sg	ACTIVE	2025-09-03 13:20:49.55	FALL_2025
cmf40i5820005ju041q61mbz2	912b2a7b-6cdf-4756-811d-9725217f9036	cmew8jqjo0000uuycrjvh45sg	ACTIVE	2025-09-03 13:27:36.435	FALL_2025
cmf40iosq0007ju04zprd59pn	dd6886a0-ae3f-4d57-bc1a-686aeadccba0	cmew8bhnn0000uuk0rouwv1zq	ACTIVE	2025-09-03 13:28:01.803	FALL_2025
cmf41q9430001kz0442j8iugb	886e4a28-61dc-4fbf-90af-fbf027c92ae4	cmew8jqjo0000uuycrjvh45sg	ACTIVE	2025-09-03 14:01:54.339	FALL_2025
cmf43m00g0001l404dma7n83p	78ced4fd-0b84-4eb6-831d-6c817ddb76c5	cmew8jqjo0000uuycrjvh45sg	ACTIVE	2025-09-03 14:54:35.153	FALL_2025
cmf46dfym0001k00430triacj	69c5a877-81b1-4b87-9cc6-012e06de938f	cmew8bhnn0000uuk0rouwv1zq	ACTIVE	2025-09-03 16:11:54.766	FALL_2025
cmf46dfzy0003k004ztvyw93r	69c5a877-81b1-4b87-9cc6-012e06de938f	cmew8jqjo0000uuycrjvh45sg	ACTIVE	2025-09-03 16:11:54.814	FALL_2025
cmew8vdbo001buuv8joqccqnm	09e7573f-92e9-4eba-b5a0-25f0c6929387	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:40.981	FALL_2025
cmew8vdkh001duuv8qckbvwrf	0994f3dd-f8df-4c8a-a91d-aaf7f544c474	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:41.297	FALL_2025
cmew8vdtq001fuuv89aeu4rho	0994f3dd-f8df-4c8a-a91d-aaf7f544c474	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:41.63	FALL_2025
cmew8ve2h001huuv832a2fmp0	ba901ffd-3216-41ce-b953-4fce5f399d98	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-08-29 02:59:41.945	FALL_2025
cmew8vebc001juuv8zfaphm5s	ba901ffd-3216-41ce-b953-4fce5f399d98	cmew8k41b0000uu90nvncv4xb	ACTIVE	2025-08-29 02:59:42.264	FALL_2025
cmew8vekg001luuv8br24pp8v	e564f584-77e9-4e6a-adb9-0f864c806a5d	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:42.593	FALL_2025
cmew8veu6001nuuv8k51ducua	e564f584-77e9-4e6a-adb9-0f864c806a5d	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:42.942	FALL_2025
cmew8vf3w001puuv86mhkz97i	8e384677-b55d-4a4b-b62b-073b272be6de	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:43.292	FALL_2025
cmew8vfdm001ruuv85ha69tjf	99b71e70-d6bf-4dc4-82ab-f77bb3e6ff3d	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:43.642	FALL_2025
cmew8vfp1001tuuv83fz5k0yb	ac9523df-a46f-438d-a515-9cfc227e1c38	cmew8k41b0000uu90nvncv4xb	ACTIVE	2025-08-29 02:59:44.053	FALL_2025
cmew8vfyc001vuuv8ess3qdij	a6be9d81-b38a-4ca9-8164-b7c15e43b3d8	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-08-29 02:59:44.388	FALL_2025
cmew8vg7n001xuuv8yaetwudq	ea856bce-275a-41a8-8831-2abe1de20e3d	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:44.723	FALL_2025
cmew8vgqh0021uuv81nvcszbk	93a6913a-1829-4884-a533-e3ca625ca1ee	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:45.401	FALL_2025
cmew8vgzu0023uuv86adi5z8z	93a6913a-1829-4884-a533-e3ca625ca1ee	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:45.738	FALL_2025
cmew8vhak0025uuv8d9i2zrm2	f3886af6-62ad-4a65-97bd-5066ff2292fb	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:46.124	FALL_2025
cmew8vhjo0027uuv8dcekqrgf	a317152e-7b99-4486-81ff-c2924e612415	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:46.453	FALL_2025
cmew8vhse0029uuv898vxsef7	02070f5b-21d6-4403-a6f7-1e0b82afdc7a	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:46.766	FALL_2025
cmew8vi16002buuv8w7xzdzuw	02070f5b-21d6-4403-a6f7-1e0b82afdc7a	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:47.082	FALL_2025
cmew8via1002duuv8u24zgcy6	a2d6b761-a6bd-4c4f-83c6-9555a3e18824	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:47.401	FALL_2025
cmew8viit002fuuv8jhwbkmo0	815a18ac-972d-41eb-82d7-cdfd1cecc1d2	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:47.717	FALL_2025
cmew8visy002huuv8ksgjxvq2	b3c3d7bc-c748-47dd-a0ba-f719ef15c5f2	cmew8k41b0000uu90nvncv4xb	ACTIVE	2025-08-29 02:59:48.082	FALL_2025
cmew8vj1p002juuv8maoltaw7	e96c128a-b6be-47c4-925d-5679c8e1f5e0	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:48.397	FALL_2025
cmew8vjaf002luuv85nsgscly	1d76d70c-89ad-4a69-990d-438b37f6071e	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:48.711	FALL_2025
cmew8vjji002nuuv8z8fzuhiw	570cf3b6-a836-4e5c-abd9-84826090764c	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-08-29 02:59:49.038	FALL_2025
cmew8vjsl002puuv8t635zdm1	0a0772db-cc6f-432e-bd60-dc690eb127e3	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-08-29 02:59:49.365	FALL_2025
cmew8vkat002tuuv836v7pv1a	2d7c183a-3154-4f46-9708-b141e705f55d	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:50.021	FALL_2025
cmew8vkk6002vuuv8ons3xgdz	7ffb6d85-2156-4c99-a31c-00c96c40c0ea	cmew8k41b0000uu90nvncv4xb	ACTIVE	2025-08-29 02:59:50.358	FALL_2025
cmew8vkti002xuuv8tbo82w85	45274181-f4d2-4317-8b0b-1c2f57f8f8fd	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:50.695	FALL_2025
cmew8vl2p002zuuv8v6w43d1p	54e31378-33c1-4705-a61e-6b8d9b8678f4	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:51.025	FALL_2025
cmew8vlbn0031uuv8st21s94z	e954534f-ef93-4bbd-b861-a7d7e432eb2c	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-08-29 02:59:51.348	FALL_2025
cmew8vlkz0033uuv8hes6blvq	e954534f-ef93-4bbd-b861-a7d7e432eb2c	cmew8k41b0000uu90nvncv4xb	ACTIVE	2025-08-29 02:59:51.683	FALL_2025
cmew8vlu60035uuv8od579pvw	59eef48f-7e96-410b-b6d3-2e0d307e5655	cmew8jnup0000uutosw0n4xci	ACTIVE	2025-08-29 02:59:52.015	FALL_2025
cmew8vm2s0037uuv85gmirrzt	1d8b19a2-d5de-4733-b396-8990fbf80f8f	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-08-29 02:59:52.324	FALL_2025
cmew8vmba0039uuv8jz5cf6qa	040905a8-516f-4557-9b9f-8de61da3a55a	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-08-29 02:59:52.63	FALL_2025
cmew8vmk3003buuv8khk9vf5s	8ca07577-60e7-4afe-848e-6b3d02276a3c	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-08-29 02:59:52.947	FALL_2025
cmew8vmt0003duuv8qjzrs6dg	b405501a-29e8-43d2-8c5f-3b850c597cbf	cmew8k41b0000uu90nvncv4xb	ACTIVE	2025-08-29 02:59:53.268	FALL_2025
cmew8vagp000puuv8tgpio1e5	e00f8eca-6da4-4370-9f6a-7479e35c951e	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-08-29 02:59:37.273	FALL_2025
cmew8v8yp000duuv8slq43p8m	bea9a949-eb57-4e9a-879a-bf3bb1d05010	cmew8bhnn0000uuk0rouwv1zq	ACTIVE	2025-08-29 02:59:35.329	FALL_2025
cmew8v9yd000luuv894hb2jem	77ed2448-8192-4c1a-b375-bda7bf5d6ed3	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-08-29 02:59:36.613	FALL_2025
cmew8vcl90015uuv8f2wctfvw	f6658ecc-b08a-4a7f-89be-22cd6a92f66c	cmew8jqjo0000uuycrjvh45sg	ACTIVE	2025-08-29 02:59:40.029	FALL_2025
8671cd03-f106-4fa5-a42b-bf159ed67c09	e04fdc55-5db5-4174-b194-257b6273a791	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-09-04 02:40:50.141	FALL_2025
cmf5xmdo50001ju04ufd1gw3m	a6c5a434-c102-42a1-a928-2dc07b6a8d4c	cmew8jqjo0000uuycrjvh45sg	ACTIVE	2025-09-04 21:42:27.51	FALL_2025
cmfbhqq990001l5042jur3hv6	fd4e2aa3-4ace-4772-8d5b-5b32a947e2b5	cmew8jgel0000uukwl0jmosps	ACTIVE	2025-09-08 19:04:33.645	FALL_2025
cmflmadks0001kz04ucegt4gw	54029270-ac76-47ec-9c5e-82d1fc45f4c7	cmew8bhnn0000uuk0rouwv1zq	ACTIVE	2025-09-15 21:09:30.556	FALL_2025
bf57a210-af3a-4f44-a902-0f420757be54	1a4c4ee5-3fa5-449c-9405-0082e88685a6	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-09-15 21:53:52.592	FALL_2025
6716643e-6f3e-4fae-b0d1-b65a84509d09	78ced4fd-0b84-4eb6-831d-6c817ddb76c5	cmew8bhnn0000uuk0rouwv1zq	ACTIVE	2025-10-09 17:53:22.906	FALL_2025
a3d59d48-932f-47e8-8993-2f5c568d2fc2	e96c128a-b6be-47c4-925d-5679c8e1f5e0	cmew8jqjo0000uuycrjvh45sg	ACTIVE	2025-10-09 17:56:37.354	FALL_2025
bbbfdcf7-83ab-48cd-93ae-d067b85a7d0d	e44b35ee-b8ce-4bf0-9a0b-05f9b931d8c2	cmew8k1qs0000uuy0uw206p1q	ACTIVE	2025-10-14 02:21:07.312	FALL_2025
d5239a3b-09b2-43ee-8748-efc2384fc53f	e287f1e4-4df4-4d72-8b85-5bdc9a982a4d	cmew8k41b0000uu90nvncv4xb	ACTIVE	2025-10-22 17:45:35.402	FALL_2025
cmkpmqe0x0001la04pvbo21uc	92c2f85d-8806-41cc-a3c8-347d726b70be	7807f5ce-7a67-461f-9ce2-10c004d4f026	ACTIVE	2026-01-22 15:51:34.018	SPRING_2026
cmkpwxikl0001i90403wm2due	6171ecae-7c0a-4691-aa4d-3fe349e2e99b	d52fe3c6-3db3-4935-a460-c700c9ee41d2	ACTIVE	2026-01-22 20:37:02.662	SPRING_2026
cmkpydupw0001ib044pcda513	91885b11-4389-4bc3-aac5-358df41bac4e	d52fe3c6-3db3-4935-a460-c700c9ee41d2	ACTIVE	2026-01-22 21:17:44.517	SPRING_2026
cmkq0r61n0001jm04ld0iflf4	9901f2f9-d617-4370-a2fe-0012e0cd3ece	7807f5ce-7a67-461f-9ce2-10c004d4f026	ACTIVE	2026-01-22 22:24:04.955	SPRING_2026
cmkq5vjv50001l204wmc6q063	b1ef3440-7553-4006-a48f-8c6d9393657e	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-23 00:47:27.569	SPRING_2026
cmkq68zr80001k104vl322tvu	73d5a904-ead3-4b97-ae8e-ccab18d38edd	7807f5ce-7a67-461f-9ce2-10c004d4f026	ACTIVE	2026-01-23 00:57:54.693	SPRING_2026
cmkredi6e0001l704mts5vh4d	36c0be6f-8efa-4771-8db8-f562afed7305	d52fe3c6-3db3-4935-a460-c700c9ee41d2	ACTIVE	2026-01-23 21:33:08.295	SPRING_2026
cmkzjykdn0001lb04httdp7jp	5171f7f6-f8e2-4ad5-9ad6-e85760befdf7	bb9532ca-a618-44e5-88f2-dc445516e5a0	ACTIVE	2026-01-29 14:31:38.411	SPRING_2026
\.


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: student-registration_owner
--

COPY public."Student" (id, "studentName", age, "parentName", phone, email, location, frequency, "selectedDays", "startDate", "paymentStatus", "paymentMethod", "liabilityAccepted", "waiverName", "waiverAddress", "createdAt", "updatedAt", session) FROM stdin;
d898bd8b-50c2-4b85-ab43-e14b22705759	Breleigh Chang	3	Eileen Chang	2817019460	eechang11@gmail.com	SUGARLAND	TWICE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Eileen Chang	eechang11@gmail.com	2026-01-09 00:31:12.949	2026-01-09 14:22:28.016	SPRING_2026
bb17eec4-2a92-4283-a6b1-8b1e26252bdf	Benji Bolonesi	5	Sandy Bolonesi	2818968555	sandy.bolonesi@gmail.com	SUGARLAND	TWICE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Sandy Bolonesi	sandy.bolonesi@gmail.com	2026-01-05 20:20:45.73	2026-01-05 21:29:08.3	SPRING_2026
e000328e-4eb1-4c36-b6fe-42b662edaf99	Tallulah Rodriguez	3	Candice Trybull	3122179211	trybull@icloud.com	SUGARLAND	TWICE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Candice Trybull	trybull@icloud.com	2026-01-03 00:24:44.36	2026-01-05 21:29:23.912	SPRING_2026
ae067ce0-2721-4a88-ac9a-7965e4e47baa	Mia Mouton	5	Elizabeth Mouton	9856474238	elizabethavalos765@gmail.com	SUGARLAND	TWICE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Elizabeth Mouton	elizabethavalos765@gmail.com	2026-01-05 20:41:38.983	2026-01-06 00:17:27.949	SPRING_2026
659cb558-f981-4580-a8a3-e75fde335bfb	Sebastian Mouton	3	Elizabeth Mouton	9856474238	elizabethavalos765@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-23 00:00:00	PAID	Zelle	t	Elizabeth Mouton	elizabethavalos765@gmail.com	2026-01-05 20:43:41.035	2026-01-06 00:18:00.253	SPRING_2026
64d58951-72e4-4beb-bdcd-c0490e9c2b4e	Jake bermudez	4	Carissa Bermudez	8324508700	caribba2000@yahoo.com	KATY	ONCE_A_WEEK	{Tuesday}	2026-01-20 00:00:00	PAID	Zelle	t	Carissa Bermudez	caribba2000@yahoo.com	2026-01-06 20:32:10.745	2026-01-06 21:03:45.289	SPRING_2026
baad6ce9-cd7f-49c7-aff8-63afd2fc9225	Emma Betancourt	4	Arianne Betancourt	2819486320	arianne00@hotmail.com	KATY	ONCE_A_WEEK	{Tuesday}	2026-01-20 00:00:00	PAID	Zelle	t	Arianne Betancourt	arianne00@hotmail.com	2026-01-09 20:18:35.939	2026-01-09 20:19:45.916	SPRING_2026
b5fb751f-33be-44be-a898-f19825585c97	Aleyda Hernandez	3	Jessica Vazquez	832-908-7719	Vazquez.jess09@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Jessica Vazquez	Vazquez.jess09@gmail.com	2026-01-11 05:13:01.549	2026-01-11 16:32:22.688	SPRING_2026
6257e248-1ea1-4a15-a6ed-99608dbab123	Alessandro Montalbano	3	Maria Delgado	8329454377	marialedelgadol@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Maria Delgado	marialedelgadol@gmail.com	2026-01-12 21:09:05.456	2026-01-13 13:10:46.335	SPRING_2026
d5ed431c-1ffb-4b23-a384-952af60fc89a	Micaela Rubio	4	Claudia Canales	2813014055	clau_2306@hotmail.com	SUGARLAND	TWICE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Claudia Canales	clau_2306@hotmail.com	2026-01-09 22:14:18.953	2026-01-13 15:11:24.679	SPRING_2026
e2ac2ba3-58ca-4f6d-bf10-bd6ec9b62aed	Andrea Kennion	4	Elma Cantu	6823916965	elma_sarahi_c@hotmail.com	KATY	TWICE_A_WEEK	{Tuesday,Wednesday}	2026-01-20 00:00:00	PAID	Zelle	t	Elma Cantu	elma_sarahi_c@hotmail.com	2026-01-13 18:53:20.675	2026-01-13 20:28:05.417	SPRING_2026
6df9e0b7-44e0-4881-a141-e67ccae27e7d	Ezra Shipley	5	Sulma Shipley	8328453491	ninaestelar@yahoo.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Sulma Shipley	ninaestelar@yahoo.com	2026-01-12 18:56:07.174	2026-01-13 20:30:08.59	SPRING_2026
a2ee7824-dbd5-44dd-b36d-a07cf332ea6f	Ijemma Onwunumagha	4	Lina Martinez	8328302690	onwufam@gmail.com	KATY	TWICE_A_WEEK	{Tuesday,Wednesday}	2026-01-20 00:00:00	PAID	Zelle	t	Lina Martinez	onwufam@gmail.com	2026-01-13 01:05:05.837	2026-01-14 12:32:12.636	SPRING_2026
ed157fa5-e959-48d7-94f4-f878d88348fc	Trace Thornborrow	5	Kristin Thornborrow	281-832-5428	kristinthornborrow@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Kristin Thornborrow	kristinthornborrow@gmail.com	2026-01-05 20:04:49.437	2026-01-15 19:41:01.154	SPRING_2026
79759d38-34bc-4948-b314-03001d5c7be3	Manuel Fernandez	5	Esther Diaz	2134223599	Abimilec@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Esther Diaz	Abimilec@gmail.com	2026-01-12 22:14:40.885	2026-01-20 00:36:02.055	SPRING_2026
a2dd042d-4cf7-44f6-994d-ed52c3bd2845	Eliana Morales	4	Vanessa Ortiz	8324754872	ortizvanessa13@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Vanessa Ortiz	ortizvanessa13@gmail.com	2026-01-12 22:17:07.1	2026-01-22 15:33:09.713	SPRING_2026
78e2c36a-9ad3-48c9-b41a-05ce111f5092	Adelyn Cheng	5	Anna Cheng	2812362732	anna.lianekeo@gmail.com	SUGARLAND	TWICE_A_WEEK	{Monday,Thursday}	2026-01-26 00:00:00	PAID	Zelle	t	Anna Cheng	anna.lianekeo@gmail.com	2026-01-05 20:11:38.365	2026-01-21 17:52:52.867	SPRING_2026
f9549711-c130-405f-a064-92077c7cf244	Noelia Ramirez	3	Elena Ramirez	832-368-8986	evrodriges@gmail.com	KATY	ONCE_A_WEEK	{Tuesday}	2026-01-20 00:00:00	PAID	Zelle	t	Elena Ramirez	evrodriges@gmail.com	2026-01-10 23:54:41.253	2026-01-20 23:57:55.948	SPRING_2026
3529faa6-0d9c-4d66-94eb-79f5ae517b8c	Dan Vu	3	Tricia Tran	7144873154	triciahtran@yahoo.com	KATY	TWICE_A_WEEK	{Tuesday,Wednesday}	2026-01-20 00:00:00	PAID	Cash	t	Tricia Tran	triciahtran@yahoo.com	2026-01-08 01:11:29.022	2026-01-21 18:05:01.029	SPRING_2026
a5366fb2-5cf6-4e9c-b457-052c1d0cdf40	Mason Brown	5	Tiffani Brown	8327211236	tiffanibro@msn.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Tiffani Brown	tiffanibro@msn.com	2026-01-05 21:01:42.209	2026-01-25 17:59:03.746	SPRING_2026
c2eb95e5-8fac-458f-96b4-28ee38f36e70	Dane	3	Brandi Wade	8329781408	brandianise@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-23 00:00:00	PAID	Zelle	t	Brandi Wade	brandianise@gmail.com	2026-01-09 14:51:21.578	2026-01-22 20:11:22.513	SPRING_2026
fd147473-3e77-41c9-9f04-74f5f05bd2ce	Aeris White	4	Kabrina White	8324185641	whitefamily2827@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Kabrina White	whitefamily2827@gmail.com	2026-01-12 19:37:48.771	2026-01-27 18:08:14.765	SPRING_2026
9230b9c2-dffc-4dd2-b6f1-cae72a7ad771	Sterling Durrett	5	Brandie Durrett	832-423-4455	brandied@me.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Check	t	Brandie Durrett	brandied@me.com	2026-01-07 15:02:58.135	2026-02-04 22:19:07.323	SPRING_2026
ad8df1f5-2f2b-4991-88cc-399778ea283a	Kennedy Williams	4	christallyn williams	6505333374	christallyn@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	christallyn williams	christallyn@gmail.com	2026-01-07 04:33:17.983	2026-02-05 15:49:00.763	SPRING_2026
13ffe710-4379-45b0-bfd9-2a80da3daa71	Ariella Siy	5	Evelyn Siy	9175753467	eveysiy@gmail.com	SUGARLAND	TWICE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Evelyn Siy	eveysiy@gmail.com	2026-01-06 00:00:13.308	2026-02-05 16:06:49.944	SPRING_2026
1aca3b61-d9bc-4892-bccd-c64139e6fe1a	Kayden Ahrendt	4	Denise Ahrendt	8328784504	deniseahrendt@yahoo.com	SUGARLAND	TWICE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Denise Ahrendt	deniseahrendt@yahoo.com	2026-01-07 15:33:58.378	2026-02-08 22:56:19.063	SPRING_2026
0d5d5efe-64d0-45fd-ad3a-2e4f1a7fd00a	Rio Etienne	3	Ashley Ramos	8455486880	ashley.rskool@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Ashley Ramos	ashley.rskool@gmail.com	2026-01-05 21:13:23.446	2026-02-16 19:37:27.076	SPRING_2026
5102fe8b-5f38-4c37-b538-6bda61890e3d	Edie Guajardo	5	Amanda Guajardo	8322321917	mandi5895@icloud.com	SUGARLAND	TWICE_A_WEEK	{Monday,Thursday}	2025-08-25 00:00:00	PAID	Zelle	t	Amanda Guajardo	mandi5895@icloud.com	2025-08-12 17:08:43.533	2025-08-13 00:19:50.269	FALL_2025
a46ad716-ea58-4ab5-a0f4-1beb5f50cf52	Ariella Siy	4	Evelyn Siy	9175753467	eveysiy@gmail.com	SUGARLAND	ONCE_A_WEEK	{Thursday}	2025-08-28 00:00:00	PAID	Zelle	t	Evelyn Siy	eveysiy@gmail.com	2025-08-12 17:33:45.31	2025-08-13 15:20:34.045	FALL_2025
6f921190-f2b0-448b-b569-4d21fd5bc930	Luna Carranza	3	Romina Carranza	2817815730	Romriccio@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Romina Carranza	Romriccio@gmail.com	2026-01-09 20:11:49.605	2026-01-13 19:00:30.355	SPRING_2026
c57689fc-9c56-468f-bb89-5d8a443d7cf8	Arie Cheng	3	Anna Cheng	2812362732	anna.lianekeo@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-23 00:00:00	PAID	Zelle	t	Anna Cheng	anna.lianekeo@gmail.com	2026-01-21 18:35:51.743	2026-01-21 18:38:42.717	SPRING_2026
12cf22f6-72fc-4767-b2a8-dd8c5f44dc35	Evelyn Saenz	3	Evelyn Saenz	9152522324	evelynarana77@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Evelyn Saenz	evelynarana77@gmail.com	2026-01-21 17:09:38.285	2026-01-22 02:06:52.117	SPRING_2026
469cad44-9e80-4355-8c6c-0b1c4d4e7027	Cecilia Pena	2	Erin Pena	2488756677	eringpena@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-23 00:00:00	PAID	Zelle	t	Erin Pena	eringpena@gmail.com	2026-01-22 03:33:10.883	2026-01-22 16:15:15.888	SPRING_2026
6171ecae-7c0a-4691-aa4d-3fe349e2e99b	Amara Antoine	2	Rahel Abraham	7132944335	rabraham@pm.me	SUGARLAND	ONCE_A_WEEK	{}	2026-01-23 00:00:00	PAID	Zelle	t	Rahel Abraham	rabraham@pm.me	2026-01-22 20:37:02.641	2026-01-22 22:06:10.882	SPRING_2026
b1ef3440-7553-4006-a48f-8c6d9393657e	Kirby Tran	4	Giovanna Tran	415-310-6520	gio.alba0508@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Giovanna Tran	gio.alba0508@gmail.com	2026-01-23 00:47:27.547	2026-01-23 14:15:40.678	SPRING_2026
73d5a904-ead3-4b97-ae8e-ccab18d38edd	Mia Camila Jaramillo	3	Haydee Pamela Lopez Villa	3464815747	hp.lopezvilla@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-23 00:00:00	PAID	Zelle	t	Haydee Pamela Lopez Villa	hp.lopezvilla@gmail.com	2026-01-23 00:57:54.669	2026-01-23 14:16:20.523	SPRING_2026
91885b11-4389-4bc3-aac5-358df41bac4e	Millie Mejia	2	Jialu Zhao	4435630572	zhaojialu2012@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-23 00:00:00	PAID	Zelle	t	Jialu Zhao	zhaojialu2012@gmail.com	2026-01-22 21:17:44.495	2026-01-23 19:46:06.362	SPRING_2026
92c2f85d-8806-41cc-a3c8-347d726b70be	Emma Moore	2	Caitlyn Moore	5127835301	Caitlynmooree@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-23 00:00:00	PAID	Check	t	Caitlyn Moore	Caitlynmooree@gmail.com	2026-01-22 15:51:33.996	2026-01-23 22:56:30.271	SPRING_2026
9901f2f9-d617-4370-a2fe-0012e0cd3ece	Luca Martinez	3	Jaqueline Martinez	8329417730	jaquelineolgamartinez9@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Check	t	Jaqueline Martinez	jaquelineolgamartinez9@gmail.com	2026-01-22 22:24:04.924	2026-01-23 22:57:03.466	SPRING_2026
93a6913a-1829-4884-a533-e3ca625ca1ee	Micaela Rubio	4	Claudia Canales Guillermo	2813014055	clau_2306@hotmail.com	SUGARLAND	TWICE_A_WEEK	{Monday,Thursday}	2025-08-25 00:00:00	PAID	Zelle	t	Claudia Canales Guillermo	clau_2306@hotmail.com	2025-08-18 19:53:20.387	2025-08-18 20:03:34.052	FALL_2025
5171f7f6-f8e2-4ad5-9ad6-e85760befdf7	Leonardo Zovath	3	Fernanda Zovath	2819198674	fernanda.zovath@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Fernanda Zovath	fernanda.zovath@gmail.com	2026-01-29 14:31:38.389	2026-01-29 18:39:29.994	SPRING_2026
b2f2e5c8-6e96-4e12-a1e3-46b0740e518a	Julian Ellis	2	Johana Castano	9144799665	johana.castanor@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-23 00:00:00	PAID	Zelle	t	Johana Castano	johana.castanor@gmail.com	2026-01-30 22:19:48.593	2026-01-30 22:38:56.735	SPRING_2026
e7de3adb-95be-4e39-9d23-e2a5965de996	Isabella Ellis	5	Johana Castano	9144799665	johana.castanor@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Johana Castano	johana.castanor@gmail.com	2026-01-30 22:55:48.362	2026-02-02 20:53:53.069	SPRING_2026
1957ad3d-b8a2-44fe-a29b-dadce71fad21	Julie Tec	5	Juliette Tec	713-775-4545	julietec84@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Juliette Tec	julietec84@gmail.com	2026-02-04 22:16:35.478	2026-02-05 14:00:22.761	SPRING_2026
2a16d78c-4be7-4791-abc4-8eff95f0c334	Gabriel Smayling	4	Anna Escobar Smayling	713-478-3500	anna1825@sbcglobal.net	SUGARLAND	ONCE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Anna Escobar Smayling	anna1825@sbcglobal.net	2026-01-30 17:36:33.127	2026-02-05 15:57:38.604	SPRING_2026
7ef4c457-74b4-4d5a-9821-ec39c6d3b786	Aria Ramirez	4	Leslie Ramirez	8479776918	trevinoleslie7@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Leslie Ramirez	trevinoleslie7@gmail.com	2026-02-16 06:18:40.791	2026-02-16 19:35:53.395	SPRING_2026
36c0be6f-8efa-4771-8db8-f562afed7305	Ziarah Inayatali	2	Farheen Inayatali	8329730045	farheeninayatali@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-23 00:00:00	PAID	Zelle	t	Farheen Inayatali	farheeninayatali@gmail.com	2026-01-23 21:33:08.275	2026-02-17 18:20:00.624	SPRING_2026
8ecee708-9b86-42e9-884f-b44d971a1fc7	Max Osuan	5	Nelly Osuan	713-562-1657	nellyosuan@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-26 00:00:00	PENDING	Zelle	t	Nelly Osuan	nellyosuan@gmail.com	2026-03-02 15:10:05.214	2026-03-02 15:10:05.214	SPRING_2026
9154cb52-dd38-41ae-a19b-a324ac390b4c	Isabella osuan	6	Nelly Osuan	713-562-1657	nellyosuan@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-26 00:00:00	PENDING	Zelle	t	Nelly Osuan	nellyosuan@gmail.com	2026-03-02 15:10:33.083	2026-03-02 15:10:33.083	SPRING_2026
d6246a1f-4080-466b-9fc3-464c090c8bb8	Olivia Patton	3	Chris Patton	7134177790	chris.allen.patton@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Chris Patton	chris.allen.patton@gmail.com	2026-01-16 04:58:32.944	2026-01-16 12:24:26.506	SPRING_2026
912b2a7b-6cdf-4756-811d-9725217f9036	Camila Auvert	5	Gabrielle Auvert	3184585066	gabauvert@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2025-09-18 00:00:00	PAID	Zelle	t	Gabrielle Auvert	gabauvert@gmail.com	2025-09-03 13:27:36.417	2025-09-03 14:40:46.611	FALL_2025
9411459f-b5d4-45a9-a5d5-4849f3605c8d	Sebastian Sanabria	4	Angie Blanco	8327830282	angiesblanco@gmail.com	KATY	ONCE_A_WEEK	{Tuesday}	2026-01-20 00:00:00	PAID	Cash	t	Angie Blanco	angiesblanco@gmail.com	2026-01-20 15:34:21.081	2026-01-20 15:36:26.386	SPRING_2026
f34d971c-b008-4682-b76d-060d38a18a23	Samuel Valdivieso	4	Laura Villegas	9173491984	jaimeylaurav@gmail.com	KATY	ONCE_A_WEEK	{Tuesday}	2026-01-20 00:00:00	PAID	Zelle	t	Laura Villegas	jaimeylaurav@gmail.com	2026-01-21 14:25:41.19	2026-01-21 15:28:16.567	SPRING_2026
291a149c-1db5-4c6f-a76b-4cd749289a01	Kennedy Williams	4	Christallyn Williams	6505333374	christallyn@gmail.com	SUGARLAND	ONCE_A_WEEK	{Thursday}	2025-08-28 00:00:00	PAID	Zelle	t	Christallyn Williams	christallyn@gmail.com	2025-08-12 17:21:16.865	2025-08-12 18:30:30.419	FALL_2025
bea9a949-eb57-4e9a-879a-bf3bb1d05010	Mia Mouton	4	Elizabeth Mouton	9856474238	elizabethavalos765@gmail.com	SUGARLAND	ONCE_A_WEEK	{Monday}	2025-08-25 00:00:00	PAID	Zelle	t	Elizabeth Mouton	elizabethavalos765@gmail.com	2025-08-12 15:54:59.15	2025-08-12 20:23:30.736	FALL_2025
e1d01961-11ca-4c54-aeb9-c8d80c754e5b	Eliana Morales	3	Vanessa Ortiz	8324754872	ortizvanessa13@gmail.com	SUGARLAND	ONCE_A_WEEK	{Thursday}	2025-08-28 00:00:00	PAID	Zelle	t	Vanessa Ortiz	ortizvanessa13@gmail.com	2025-08-14 23:49:32.407	2025-08-15 00:21:11.178	FALL_2025
2b6099f8-a149-428f-a8d5-3ded704adddf	Zoey Hurd	5	Michael Hurd	5207329235	michael.hurd33@yahoo.com	SUGARLAND	ONCE_A_WEEK	{}	2025-09-18 00:00:00	PAID	Zelle	t	Michael Hurd	michael.hurd33@yahoo.com	2025-09-02 19:37:50.9	2025-09-03 16:08:28.171	FALL_2025
69c5a877-81b1-4b87-9cc6-012e06de938f	David Pachuilo	4	Marisabel Pachuilo	8325615150	marisabel.pachuilo@yahoo.com	SUGARLAND	TWICE_A_WEEK	{}	2025-09-15 00:00:00	PAID	Zelle	t	Marisabel Pachuilo	marisabel.pachuilo@yahoo.com	2025-09-03 16:11:54.75	2025-09-04 15:43:34.272	FALL_2025
dd6886a0-ae3f-4d57-bc1a-686aeadccba0	Knox Till	4	Courtney Till	8323358618	courtney.cebolao@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2025-09-15 00:00:00	PAID	Zelle	t	Courtney Till	courtney.cebolao@gmail.com	2025-09-03 13:28:01.794	2025-09-08 22:29:33.625	FALL_2025
fd4e2aa3-4ace-4772-8d5b-5b32a947e2b5	Salomon Moussazadeh	3	Patricia Moussazadeh	7139669957	p.b3458@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2025-08-25 00:00:00	PAID	Zelle	t	Patricia Moussazadeh	p.b3458@gmail.com	2025-09-08 19:04:33.622	2025-09-09 01:39:10.223	FALL_2025
1a4c4ee5-3fa5-449c-9405-0082e88685a6	Kataleya Blackshear	5	Daisy Lopez	8327660109	daisykim0808@gmail.com	KATY	ONCE_A_WEEK	{Tuesday}	2025-08-26 00:00:00	PAID	Zelle	t	Daisy Lopez	daisykim0808@gmail.com	2025-09-15 20:37:51.39	2025-09-15 21:52:41.864	FALL_2025
54029270-ac76-47ec-9c5e-82d1fc45f4c7	Adelyn Cheng	4	Anna Cheng	2812362732	anna.lianekeo@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2025-09-15 00:00:00	PAID	Zelle	t	Anna Cheng	anna.lianekeo@gmail.com	2025-09-15 21:09:30.529	2025-09-15 21:53:37.389	FALL_2025
886e4a28-61dc-4fbf-90af-fbf027c92ae4	Mason Brown-Mooore	4	Tiffani Brown	8327211236	tiffanibro@msn.com	SUGARLAND	ONCE_A_WEEK	{}	2025-09-18 00:00:00	PAID	Zelle	t	Tiffani Brown	tiffanibro@msn.com	2025-09-03 14:01:54.314	2025-09-16 23:33:47.577	FALL_2025
a6c5a434-c102-42a1-a928-2dc07b6a8d4c	Aleyda hernandez	3	Jessica Vazquez	8329087719	vazquez.jess09@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2025-09-18 00:00:00	PAID	Cash	t	Jessica Vazquez	vazquez.jess09@gmail.com	2025-09-04 21:42:27.475	2025-09-18 13:49:03.17	FALL_2025
78ced4fd-0b84-4eb6-831d-6c817ddb76c5	Benji Bolonesi	4	Sandy Bolonesi	2818968555	sandy.bolonesi@gmail.com	SUGARLAND	TWICE_A_WEEK	{Monday}	2025-09-18 00:00:00	PAID	Zelle	t	Sandy Bolonesi	sandy.bolonesi@gmail.com	2025-09-03 14:54:35.103	2025-10-09 17:53:22.906	FALL_2025
e96c128a-b6be-47c4-925d-5679c8e1f5e0	Valentina Vazquez	3	Paula Vazquez	832-595-4299	pvazquez1005@outlook.com	SUGARLAND	TWICE_A_WEEK	{Monday,Thursday}	2025-08-25 00:00:00	PAID	Cash	t	Paula Vazquez	pvazquez1005@outlook.com	2025-08-20 20:14:40.761	2025-10-09 17:56:37.354	FALL_2025
e44b35ee-b8ce-4bf0-9a0b-05f9b931d8c2	Hailey Andersen	4	Laura Yilo	8323225725	lauramichelleyilo@gmail.com	KATY	ONCE_A_WEEK	{Tuesday}	2025-08-26 00:00:00	PAID	Zelle	t	Laura Yilo	lauramichelleyilo@gmail.com	2025-10-14 02:11:52.877	2025-10-14 02:21:34.951	FALL_2025
e287f1e4-4df4-4d72-8b85-5bdc9a982a4d	Alessandra Castillo	5	Vanessa Quintanilla	2816739230	vanessaq0323@gmail.com	KATY	ONCE_A_WEEK	{Wednesday}	2025-08-27 00:00:00	PENDING	Zelle	t	Vanessa Quintanilla	vanessaq0323@gmail.com	2025-10-22 14:55:38.299	2025-10-22 14:55:38.299	FALL_2025
d7e87460-3ab5-42ee-91c0-393aa75850e9	Catherine Moncayo	4	Nasly Perez	8326098616	pereznas@yahoo.com	KATY	ONCE_A_WEEK	{Wednesday}	2026-01-21 00:00:00	PAID	Zelle	t	Nasly Perez	pereznas@yahoo.com	2026-01-21 17:02:17.755	2026-01-21 22:51:13.005	SPRING_2026
11c19778-95c0-481b-a60b-bca76c994d79	Zara Hurd	4	Cindy Hurd	8326419582	churd06@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Cindy Hurd	churd06@gmail.com	2026-01-13 19:13:15.107	2026-01-22 14:02:13.888	SPRING_2026
49f2ada2-b385-4467-8a61-6adb67a64961	Luca Perez	6	Brianda Perez	7133840263	bjaramillo18@yahoo.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Brianda Perez	bjaramillo18@yahoo.com	2026-01-16 02:31:52.408	2026-01-22 13:55:16.096	SPRING_2026
d4f62e45-75e6-4f66-b4fe-a0526044eeb4	Zoey Hurd	5	Cindy Hurd	8326419582	churd06@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Cindy Hurd	churd06@gmail.com	2026-01-13 19:12:54.834	2026-01-22 14:02:45.505	SPRING_2026
d7e70964-8461-4a93-bdd6-992f4903f3fc	Camila Auvert	5	Gabrielle Auvert	3184585066	gabauvert@gmail.com	SUGARLAND	TWICE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Gabrielle Auvert	gabauvert@gmail.com	2026-01-13 19:12:14.283	2026-01-22 17:23:55.738	SPRING_2026
2013e445-31bc-4379-b4b1-3cf170436d83	Austin Hooper	5	Jeannine Soto	5126940290	jeannies_2@me.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Jeannine Soto	jeannies_2@me.com	2026-01-16 04:17:28.609	2026-01-22 20:11:44.62	SPRING_2026
b960230a-84cc-48da-88bc-ae30fead8ac2	Asher Hooper	3	Jeannine Soto	5126940290	jeannies_2@me.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Jeannine Soto	jeannies_2@me.com	2026-01-16 04:18:13.478	2026-01-22 20:11:53.045	SPRING_2026
d37d5bcd-2ebd-471b-9936-cf6493a694aa	Isadora Abraham	3	Denise Abraham	7137248444	morenodb14@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Denise Abraham	morenodb14@gmail.com	2026-01-15 15:34:52.552	2026-01-23 14:36:26.669	SPRING_2026
233bc8c1-6359-4890-89c4-1d32529699d2	Carlota Delgado	5	Melany quinones	7867689296	melanyy992@hotmail.com	KATY	ONCE_A_WEEK	{Wednesday}	2026-01-21 00:00:00	PAID	Zelle	t	Melany quinones	melanyy992@hotmail.com	2026-01-21 16:46:35.608	2026-01-28 20:57:07.525	SPRING_2026
3d4723c1-9a9f-459a-8c50-a01fb155346f	Aria Lewis’Fayard	4	Dan Lewis	8326415960	dancarolewis@gmail.com	KATY	ONCE_A_WEEK	{Wednesday}	2026-01-21 00:00:00	PAID	Zelle	t	Dan Lewis	dancarolewis@gmail.com	2026-01-14 02:19:19.67	2026-02-27 18:11:47.615	SPRING_2026
40cf1042-66bc-426a-9782-ea7a96062508	Jake Bermudez	3	Carissa Bermudez	8324508700	caribba2000@yahoo.com	KATY	ONCE_A_WEEK	{Tuesday}	2025-08-26 00:00:00	PAID	Zelle	t	Carissa Bermudez	caribba2000@yahoo.com	2025-08-15 14:18:59.471	2025-08-15 14:25:42.787	FALL_2025
398b8009-dc55-4ffe-af42-5d9579f6e6c6	Asher Hooper	3	Jeannine Soto	5126940290	jeannies_2@me.com	SUGARLAND	ONCE_A_WEEK	{Monday}	2025-08-25 00:00:00	PAID	Zelle	t	Jeannine Soto	jeannies_2@me.com	2025-08-15 14:36:48.582	2025-08-15 14:59:41.951	FALL_2025
77ed2448-8192-4c1a-b375-bda7bf5d6ed3	Austin Hooper	5	Jeannine Soto	5126940290	jeannies_2@me.com	SUGARLAND	ONCE_A_WEEK	{Monday}	2025-08-25 00:00:00	PAID	Zelle	t	Jeannine Soto	jeannies_2@me.com	2025-08-15 14:37:11.933	2025-08-16 14:13:10.439	FALL_2025
bbfaa558-84bb-49ff-9033-1830963a2996	Manuel Fernandez	5	Esther Diaz	2134223599	Abimilec@gmail.com	SUGARLAND	ONCE_A_WEEK	{Thursday}	2025-08-28 00:00:00	PAID	Zelle	t	Esther Diaz	Abimilec@gmail.com	2025-08-14 16:38:05.812	2025-08-16 14:54:11.077	FALL_2025
f7cf43d5-75a0-4040-8c2b-220a90bd71d4	Ezra	4	Sulma Shipley	832-845-3491	shipleyej@gmail.com	SUGARLAND	ONCE_A_WEEK	{Thursday}	2025-08-28 00:00:00	PAID	Zelle	t	Sulma Shipley	shipleyej@gmail.com	2025-08-18 18:48:57.386	2025-09-03 14:19:38.488	FALL_2025
a29614e0-142b-4337-bb07-88957e9b1ea7	Xavier Puentes	3	Nicole Puentes	361-737-6202	dawnpuentes17@gmail.com	SUGARLAND	ONCE_A_WEEK	{Thursday}	2025-08-28 00:00:00	PAID	Zelle	t	Nicole Puentes	dawnpuentes17@gmail.com	2025-08-15 04:09:01.181	2025-08-19 01:26:11.848	FALL_2025
160de9de-d809-471b-9e26-1bcb064b290d	Breleigh Chang	3	Eileen Chang	2817019460	eechang11@gmail.com	SUGARLAND	TWICE_A_WEEK	{Monday,Thursday}	2025-08-25 00:00:00	PAID	Zelle	t	Eileen Chang	eechang11@gmail.com	2025-08-18 03:47:48.51	2025-08-18 12:09:11.138	FALL_2025
e73aaeaa-ecda-4d96-868d-b84e77691af6	Camila Auvert	5	Gabrielle Auvert	3184585066	gabauvert@gmail.com	SUGARLAND	ONCE_A_WEEK	{Monday}	2025-08-25 00:00:00	PAID	Zelle	t	Gabrielle Auvert	gabauvert@gmail.com	2025-08-18 14:25:01.701	2025-08-18 14:28:03.611	FALL_2025
608cbbeb-b132-48c5-affe-54e510c80a35	Amalia Calderin	5	Lina Duque	8323284350	linaduque388@gmail.com	KATY	TWICE_A_WEEK	{Tuesday,Wednesday}	2025-08-26 00:00:00	PAID	Zelle	t	Lina Duque	linaduque388@gmail.com	2025-08-14 14:12:59.852	2025-08-18 18:03:36.5	FALL_2025
f6658ecc-b08a-4a7f-89be-22cd6a92f66c	Evelyn Saenz	3	Evelyn Saenz	9152522324	evelynarana77@gmail.com	SUGARLAND	ONCE_A_WEEK	{Thursday}	2025-08-28 00:00:00	PAID	Zelle	t	Evelyn Saenz	evelynarana77@gmail.com	2025-08-18 18:32:50.403	2025-08-18 20:04:14.909	FALL_2025
e15a09f0-d4ed-4266-ae04-89ce4213a7a1	Ava Puentes	5	Nicole Puentes	361-737-6202	dawnpuentes17@gmail.com	SUGARLAND	TWICE_A_WEEK	{Monday,Thursday}	2025-08-25 00:00:00	PAID	Zelle	t	Nicole Puentes	dawnpuentes17@gmail.com	2025-08-15 04:08:12.878	2025-08-19 01:25:52.506	FALL_2025
09e7573f-92e9-4eba-b5a0-25f0c6929387	Maria Christina McIntosh	4	Maria Veracierto	8324078324	maria.veracierto@gmail.com	SUGARLAND	ONCE_A_WEEK	{Thursday}	2025-08-28 00:00:00	PAID	Zelle	t	Maria Veracierto	maria.veracierto@gmail.com	2025-08-16 00:55:37.983	2025-08-19 02:16:45.68	FALL_2025
0994f3dd-f8df-4c8a-a91d-aaf7f544c474	Elena Jodlowski	5	Alexandra Jodlowski	9562045434	dehoyos.alexandra@gmail.com	SUGARLAND	TWICE_A_WEEK	{Monday,Thursday}	2025-08-25 00:00:00	PAID	Zelle	t	Alexandra Jodlowski	dehoyos.alexandra@gmail.com	2025-08-18 18:49:39.237	2025-08-20 19:10:52.139	FALL_2025
ba901ffd-3216-41ce-b953-4fce5f399d98	Ijemma Onwunumagha	3	Lina Martinez	8328302690	onwufam@gmail.com	KATY	TWICE_A_WEEK	{Tuesday,Wednesday}	2025-08-26 00:00:00	PAID	Zelle	t	Lina Martinez	onwufam@gmail.com	2025-08-16 16:42:52.444	2025-08-21 18:40:21.634	FALL_2025
e564f584-77e9-4e6a-adb9-0f864c806a5d	Isabella Osuan	5	Uyi Osuan	8322608676	uyiosuan@gmail.com	SUGARLAND	TWICE_A_WEEK	{Monday,Thursday}	2025-08-25 00:00:00	PAID	Zelle	t	Uyi Osuan	uyiosuan@gmail.com	2025-08-12 16:59:09.248	2025-08-25 13:51:07.074	FALL_2025
8e384677-b55d-4a4b-b62b-073b272be6de	Luna Caballero Listyasari	4	Daniar Listyasari	8326770228	daniar.listyasari@gmail.com	SUGARLAND	ONCE_A_WEEK	{Monday}	2025-08-25 00:00:00	PAID	Check	t	Daniar Listyasari	daniar.listyasari@gmail.com	2025-08-13 18:02:46.184	2025-08-25 18:42:52.919	FALL_2025
99b71e70-d6bf-4dc4-82ab-f77bb3e6ff3d	Sterling Durrett	5	Brandie Durrett	8324234455	brandied@me.com	SUGARLAND	ONCE_A_WEEK	{Monday}	2025-08-25 00:00:00	PAID	Check	t	Brandie Durrett	brandied@me.com	2025-08-14 21:00:03.033	2025-08-25 18:43:53.839	FALL_2025
ac9523df-a46f-438d-a515-9cfc227e1c38	Emiliano Moctezuma	3	Vanessa Laverde	8329644270	cvlaverde16@gmail.com	KATY	ONCE_A_WEEK	{Wednesday}	2025-08-27 00:00:00	PAID	Zelle	t	Vanessa Laverde	cvlaverde16@gmail.com	2025-08-14 00:33:37.315	2025-08-27 13:43:54.107	FALL_2025
a6be9d81-b38a-4ca9-8164-b7c15e43b3d8	Caroline Moncayo	4	Nasly Perez	8326098616	pereznas@yahoo.com	KATY	ONCE_A_WEEK	{Tuesday}	2025-08-27 00:00:00	PAID	Zelle	t	Nasly Perez	pereznas@yahoo.com	2025-08-18 16:34:28.965	2025-08-26 18:07:52.085	FALL_2025
9b80540e-b7ad-4364-a4cc-607e679b83ed	Kirby Tran	4	Giovanna Albarran	4153106520	gio_0508@yahoo.com	SUGARLAND	ONCE_A_WEEK	{Thursday}	2025-08-28 00:00:00	PAID	Cash	t	Giovanna Albarran	gio_0508@yahoo.com	2025-08-12 18:41:55.666	2025-09-02 14:19:56.428	FALL_2025
ea856bce-275a-41a8-8831-2abe1de20e3d	Ciel Chukwunyere	3	Chelsea Chukwunyere	8327853347	cchukwunyere18@gmail.com	SUGARLAND	ONCE_A_WEEK	{Monday}	2025-08-25 00:00:00	PAID	Zelle	t	Chelsea Chukwunyere	cchukwunyere18@gmail.com	2025-08-12 18:01:55.892	2025-09-08 17:12:06.841	FALL_2025
e00f8eca-6da4-4370-9f6a-7479e35c951e	Luka Estrada	3	Edward Estrada	281-818-0938	edwardestrada_08@yahoo.com	KATY	ONCE_A_WEEK	{Tuesday}	2025-08-27 00:00:00	PAID	Zelle	t	Edward Estrada	edwardestrada_08@yahoo.com	2025-08-16 20:28:50.97	2025-08-16 20:49:09.881	FALL_2025
723e8d8d-906a-4b6f-bb41-3b0e70a5c5f4	Valeria Garcia	4	Veronica Campos	7872447988	veronicacamposlaw@gmail.com	SUGARLAND	ONCE_A_WEEK	{Thursday}	2025-08-28 00:00:00	PAID	Cash	t	Veronica Campos	veronicacamposlaw@gmail.com	2025-08-12 17:10:36.524	2025-09-05 17:39:55.768	FALL_2025
f3886af6-62ad-4a65-97bd-5066ff2292fb	Mayen Obott	3	Nse-obung Inyang	832-407-3954	nseinyang@gmail.com	SUGARLAND	ONCE_A_WEEK	{Monday}	2025-08-25 00:00:00	PAID	Zelle	t	Nse-obung Inyang	nseinyang@gmail.com	2025-08-19 15:02:41.443	2025-08-19 15:09:30.988	FALL_2025
a317152e-7b99-4486-81ff-c2924e612415	Juliette Tec	4	Julie Tec	7137754545	julietec84@gmail.com	SUGARLAND	ONCE_A_WEEK	{Monday}	2025-08-25 00:00:00	PAID	Zelle	t	Julie Tec	julietec84@gmail.com	2025-08-19 17:02:04.964	2025-08-19 17:11:48.707	FALL_2025
02070f5b-21d6-4403-a6f7-1e0b82afdc7a	Blake Tolbert	4	Michelle Tolbert	8324889046	femconsult@outlook.com	SUGARLAND	TWICE_A_WEEK	{Monday,Thursday}	2025-08-25 00:00:00	PAID	Zelle	t	Michelle Tolbert	femconsult@outlook.com	2025-08-18 19:41:04.073	2025-08-19 21:52:02.789	FALL_2025
a2d6b761-a6bd-4c4f-83c6-9555a3e18824	Savanna Ramirez	3	Joanna Ramirez	713-391-7412	joannabalesca@gmail.com	SUGARLAND	ONCE_A_WEEK	{Monday}	2025-08-25 00:00:00	PAID	Zelle	t	Joanna Ramirez	joannabalesca@gmail.com	2025-08-20 23:30:36.747	2025-08-21 00:36:08.749	FALL_2025
815a18ac-972d-41eb-82d7-cdfd1cecc1d2	Aeris White	3	Kabrina White	8324185641	whitefamily2827@gmail.com	SUGARLAND	ONCE_A_WEEK	{Monday}	2025-08-25 00:00:00	PAID	Zelle	t	Kabrina White	whitefamily2827@gmail.com	2025-08-20 22:25:16.658	2025-08-21 13:13:30.454	FALL_2025
1d76d70c-89ad-4a69-990d-438b37f6071e	Luca Perez	5	Brianda Perez	7133840263	bjaramillo18@yahoo.com	SUGARLAND	ONCE_A_WEEK	{Thursday}	2025-08-28 00:00:00	PAID	Zelle	t	Brianda Perez	bjaramillo18@yahoo.com	2025-08-19 00:27:24.925	2025-08-22 12:36:00.79	FALL_2025
570cf3b6-a836-4e5c-abd9-84826090764c	Sebastian Sanabria	3	Angie Blanco	8327830282	angiesblanco@gmail.com	KATY	ONCE_A_WEEK	{Tuesday}	2025-08-26 00:00:00	PAID	Zelle	t	Angie Blanco	angiesblanco@gmail.com	2025-08-23 18:54:38.163	2025-08-23 20:30:50.587	FALL_2025
2d7c183a-3154-4f46-9708-b141e705f55d	Olivia Mehta	3	Fabiola Mehta	2812501122	fabiolamfernandez@gmail.com	SUGARLAND	ONCE_A_WEEK	{Monday}	2025-08-25 00:00:00	PAID	Zelle	t	Fabiola Mehta	fabiolamfernandez@gmail.com	2025-08-21 01:37:30.008	2025-08-25 12:30:45.127	FALL_2025
7ffb6d85-2156-4c99-a31c-00c96c40c0ea	Emma Betancourt	4	Arianne Betancourt	2819486320	arianne00@hotmail.com	KATY	ONCE_A_WEEK	{Wednesday}	2025-08-27 00:00:00	PAID	Zelle	t	Arianne Betancourt	arianne00@hotmail.com	2025-08-23 16:41:31.612	2025-08-25 13:16:44.589	FALL_2025
45274181-f4d2-4317-8b0b-1c2f57f8f8fd	Tallulah Rodriguez	3	Candice Trybull	3122179211	trybull@icloud.com	SUGARLAND	ONCE_A_WEEK	{Monday}	2025-08-25 00:00:00	PAID	Check	t	Candice Trybull	trybull@icloud.com	2025-08-20 01:39:13.647	2025-08-25 14:06:21.867	FALL_2025
54e31378-33c1-4705-a61e-6b8d9b8678f4	Rylie Phillips	4	Miranda Phillips	8328415549	Mirandae6@gmail.com	SUGARLAND	ONCE_A_WEEK	{Thursday}	2025-08-28 00:00:00	PAID	Cash	t	Miranda Phillips	Mirandae6@gmail.com	2025-08-18 19:02:08.392	2025-08-25 17:55:47.403	FALL_2025
e954534f-ef93-4bbd-b861-a7d7e432eb2c	Andrea Kennion Cantu	4	Elma S. Cantu Ayala	6823916965	elma_sarahi_c@hotmail.com	KATY	TWICE_A_WEEK	{Tuesday,Wednesday}	2025-08-26 00:00:00	PAID	Zelle	t	Elma S. Cantu Ayala	elma_sarahi_c@hotmail.com	2025-08-25 20:03:46.413	2025-08-25 20:15:11.275	FALL_2025
59eef48f-7e96-410b-b6d3-2e0d307e5655	Maxwell Osuan	4	Uyi Osuan	8322608676	uyiosuan@gmail.com	SUGARLAND	ONCE_A_WEEK	{Thursday}	2025-08-25 00:00:00	PAID	Zelle	t	Uyi Osuan	uyiosuan@gmail.com	2025-08-25 22:50:50.544	2025-08-26 00:44:45.394	FALL_2025
1d8b19a2-d5de-4733-b396-8990fbf80f8f	Amelia Morales	4	Sarahi Tapia	661-998-0946	sarahi.tapiadpz@gmail.com	KATY	ONCE_A_WEEK	{Tuesday}	2025-08-26 00:00:00	PAID	Zelle	t	Sarahi Tapia	sarahi.tapiadpz@gmail.com	2025-08-26 11:41:50.52	2025-08-26 12:33:37.784	FALL_2025
040905a8-516f-4557-9b9f-8de61da3a55a	Daniel lee	5	Shinyoung park	339-204-7460	shinyoung80@gmail.com	KATY	ONCE_A_WEEK	{Tuesday}	2025-08-26 00:00:00	PAID	Zelle	t	Shinyoung park	shinyoung80@gmail.com	2025-08-20 14:19:15.083	2025-08-26 13:47:40.718	FALL_2025
8ca07577-60e7-4afe-848e-6b3d02276a3c	Catherine Moncayo	4	Nasly Perez	8326098616	pereznas@yahoo.com	KATY	ONCE_A_WEEK	{Tuesday}	2025-08-27 00:00:00	PAID	Zelle	t	Nasly Perez	pereznas@yahoo.com	2025-08-18 16:35:04.775	2025-08-26 18:07:55.436	FALL_2025
b405501a-29e8-43d2-8c5f-3b850c597cbf	Jimena Falcon	5	Janis Falcon	8325526974	janisalvarado16@hotmail.com	KATY	ONCE_A_WEEK	{Wednesday}	2025-08-27 00:00:00	PAID	Zelle	t	Janis Falcon	janisalvarado16@hotmail.com	2025-08-27 14:17:56.841	2025-08-27 14:33:55.066	FALL_2025
e11d0750-fde6-4254-baa1-0bc5c03363d3	Carlota delgado	5	Melany quinones	7867689296	melanyy992@hotmail.com	KATY	ONCE_A_WEEK	{Wednesday}	2025-08-27 00:00:00	PAID	Zelle	t	Melany quinones	melanyy992@hotmail.com	2025-08-26 14:06:57.456	2025-08-27 19:49:11.184	FALL_2025
c86c6b61-9859-4a5d-bcc7-76527a84b64d	Rio Etienne	3	Ashley Ramos	8455486880	ashley.rskool@gmail.com	SUGARLAND	ONCE_A_WEEK	{Monday}	2025-08-25 00:00:00	PAID	Zelle	t	Ashley Ramos	ashley.rskool@gmail.com	2025-08-27 18:00:59.034	2025-08-27 21:50:37.008	FALL_2025
66370281-3a1e-4b3b-8ce5-54a548c5d181	Aria Lewis	4	Dan Lewis	8325385311	dancarolewis@gmail.com	KATY	ONCE_A_WEEK	{Tuesday}	2025-08-26 00:00:00	PENDING	Zelle	t	Dan Lewis	dancarolewis@gmail.com	2025-08-21 02:25:03.873	2025-08-28 00:07:22.668	FALL_2025
1e2e2772-8d46-44e9-a7ac-09e41250cee1	Chase Korenek	5	Klint Korenek	8325207402	klint@korenekconstruction.com	SUGARLAND	ONCE_A_WEEK	{Thursday}	2025-08-28 00:00:00	PAID	Cash	t	Klint Korenek	klint@korenekconstruction.com	2025-08-19 03:16:19.97	2025-08-28 23:31:23.352	FALL_2025
7b967aa7-38f8-4e43-a2bc-7eddfd432eb9	Zara Hurd	3	Michael Hurd	5207329235	michael.hurd33@yahoo.com	SUGARLAND	ONCE_A_WEEK	{}	2025-09-18 00:00:00	PAID	Zelle	t	Michael Hurd	michael.hurd33@yahoo.com	2025-09-02 19:38:35.165	2025-09-03 16:08:37.715	FALL_2025
b3c3d7bc-c748-47dd-a0ba-f719ef15c5f2	Lana Krawczak	5	Matthew Krawczak	8107065100	krawdady@gmail.com	KATY	ONCE_A_WEEK	{Wednesday}	2025-08-27 00:00:00	PAID	Zelle	t	Matthew Krawczak	krawdady@gmail.com	2025-08-21 14:28:39.246	2025-09-03 20:07:08.786	FALL_2025
f7580384-1b43-47e0-b723-277f2485534a	Cyndi King	5	Sacreea King	3107144292	mssacreeq@yahoo.com	KATY	ONCE_A_WEEK	{Wednesday}	2025-08-27 00:00:00	PAID	Cash	t	Sacreea King	mssacreeq@yahoo.com	2025-08-28 18:03:52.675	2025-09-03 23:47:48.152	FALL_2025
34e53863-99ee-4fce-9e66-e7a4028b7563	Camila Nguyen	3	Cinthya Carrasco	7136533532	ccarrascobarcenas@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2025-09-18 00:00:00	PAID	Zelle	t	Cinthya Carrasco	ccarrascobarcenas@gmail.com	2025-09-03 13:20:34.988	2025-09-04 15:14:57.985	FALL_2025
e04fdc55-5db5-4174-b194-257b6273a791	Benicio Ball	4	Nathalia Ball	7137246749	c.nathalia1989@gmail.com	KATY	ONCE_A_WEEK	{Tuesday}	2025-08-26 00:00:00	PAID	Zelle	t	Nathalia Ball	c.nathalia1989@gmail.com	2025-09-01 12:38:14.92	2025-09-05 20:09:53.012	FALL_2025
0a0772db-cc6f-432e-bd60-dc690eb127e3	Sophia Ball	5	Nathalia Ball	7137246749	c.nathalia1989@gmail.com	KATY	ONCE_A_WEEK	{Tuesday}	2025-08-26 00:00:00	PAID	Zelle	t	Nathalia Ball	c.nathalia1989@gmail.com	2025-08-24 18:57:23.167	2025-09-05 20:10:09.738	FALL_2025
d81eaa4b-56c0-4cb6-be1e-6224d65bc7eb	Kayden Ahrendt	3	Denise Ahrendt	8328784504	deniseahrendt@yahoo.com	SUGARLAND	TWICE_A_WEEK	{}	2025-09-15 00:00:00	PAID	Zelle	t	Denise Ahrendt	deniseahrendt@yahoo.com	2025-09-03 13:20:49.518	2025-09-16 17:15:05.403	FALL_2025
61a1b801-f9f2-4f2a-a80b-0c1dc1699e2d	Houston Serrano	3	Kimberly Handstad	6122054941	kimberly.eqedu@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-23 00:00:00	PAID	Zelle	t	Kimberly Handstad	kimberly.eqedu@gmail.com	2026-01-21 18:54:51.016	2026-01-21 21:06:53.434	SPRING_2026
bad0413e-4df9-47b7-ae22-f09d1603b0ea	Caroline Moncayo	4	Nasly Perez	8326098616	pereznas@yahoo.com	KATY	ONCE_A_WEEK	{Wednesday}	2026-01-21 00:00:00	PAID	Zelle	t	Nasly Perez	pereznas@yahoo.com	2026-01-21 17:01:46.589	2026-01-21 22:51:02.619	SPRING_2026
fe6b33c8-6198-4081-bb34-9ed045afb335	VALERIA GARCIA	5	VERONICA CAMPOS	7872447988	veronicacamposlaw@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	VERONICA CAMPOS	veronicacamposlaw@gmail.com	2026-01-21 20:49:30.56	2026-01-21 23:11:14.558	SPRING_2026
232aeccb-89ea-4a19-b5ed-0401a4d28acb	Chance Korenek	3	Klint Korenek	8325207402	klint@korenekconstruction.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-23 00:00:00	PAID	Zelle	t	Klint Korenek	klint@korenekconstruction.com	2026-01-21 17:07:19.022	2026-01-23 22:55:37.87	SPRING_2026
7deaeab3-8b41-4d5b-981c-17b762c6a670	Chase Korenrk	5	Klint Korenek	8325207402	klint@korenekconstruction.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-22 00:00:00	PAID	Zelle	t	Klint Korenek	klint@korenekconstruction.com	2026-01-21 17:06:10.945	2026-01-23 22:55:51.278	SPRING_2026
095587c3-47b9-4840-87d5-a0f67a3eef2b	Blake Tolbert	4	Michelle Tolbert	8324889046	femconsult@outlook.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-26 00:00:00	PAID	Zelle	t	Michelle Tolbert	femconsult@outlook.com	2026-01-21 20:55:35.699	2026-02-05 19:37:47.052	SPRING_2026
24a25e7d-0a41-4111-830e-7898ed7be082	Jimena Falcon	5	Janis Falcon	8325526974	janisalvarado16@hotmail.com	KATY	ONCE_A_WEEK	{Wednesday}	2026-01-21 00:00:00	PAID	Zelle	t	Janis Falcon	janisalvarado16@hotmail.com	2026-01-22 02:30:26.673	2026-02-04 13:51:39.797	SPRING_2026
c20eeb78-136c-4f09-9632-a23bc1b5978d	Adaluz Aguado	2	Adaluz Castilla	9363140747	castilla.adaluz@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-23 00:00:00	PAID	Zelle	t	Adaluz Castilla	castilla.adaluz@gmail.com	2026-01-22 15:27:00.379	2026-02-16 19:38:26.817	SPRING_2026
4d160c02-ca69-471c-9d13-0fd3d771bc61	Sophia Espinoza	3	Samantha Nichols	8323120881	sash1029@gmail.com	SUGARLAND	ONCE_A_WEEK	{}	2026-01-23 00:00:00	PAID	Zelle	t	Samantha Nichols	sash1029@gmail.com	2026-01-21 18:21:35.297	2026-02-17 17:27:49.07	SPRING_2026
\.


--
-- Data for Name: WaitingList; Type: TABLE DATA; Schema: public; Owner: student-registration_owner
--

COPY public."WaitingList" (id, "studentName", age, "parentName", phone, email, location, "requestedDay", notes, "createdAt", session) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: student-registration_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
bf782938-0f34-48e7-95f3-70945ca2edfc	14c29bfed6373f488aa5b63171cd3dbc6033251e79568c55ab68113c2bb18d3a	2025-08-08 05:39:16.934044+00	20250808053916_add_payment_waiver_fields	\N	\N	2025-08-08 05:39:16.634166+00	1
07683f41-fb7e-4751-86c9-48ed5bc70450	32b0c983ee91ae2e061780be69c4496bda58a7280af36d10c17823de92d157de	2025-08-21 18:05:12.879317+00	20250821180512_add_waitinglist	\N	\N	2025-08-21 18:05:12.502166+00	1
b4720c6d-b392-4630-83a6-8bf92642237a	0abd2475c1d92cb5c8a3297f148d165fedbebed6a218c4dc78328624bdf68d9d	2025-08-28 22:49:39.684025+00	20250828224938_add_class_sections	\N	\N	2025-08-28 22:49:39.265675+00	1
4825ea21-c494-4ccd-95d4-bc4631c43de7	b2fa200adfa5f768702a5eae44a1813a542cc02e7610f258b77b5b079c5e6d24	2025-12-27 01:05:51.975642+00	20251227010551_add_session_support	\N	\N	2025-12-27 01:05:51.597437+00	1
\.


--
-- Name: AppConfig AppConfig_pkey; Type: CONSTRAINT; Schema: public; Owner: student-registration_owner
--

ALTER TABLE ONLY public."AppConfig"
    ADD CONSTRAINT "AppConfig_pkey" PRIMARY KEY (key);


--
-- Name: ClassSection ClassSection_pkey; Type: CONSTRAINT; Schema: public; Owner: student-registration_owner
--

ALTER TABLE ONLY public."ClassSection"
    ADD CONSTRAINT "ClassSection_pkey" PRIMARY KEY (id);


--
-- Name: Enrollment Enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: student-registration_owner
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY (id);


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: student-registration_owner
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: WaitingList WaitingList_pkey; Type: CONSTRAINT; Schema: public; Owner: student-registration_owner
--

ALTER TABLE ONLY public."WaitingList"
    ADD CONSTRAINT "WaitingList_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: student-registration_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ClassSection_location_day_label_session_key; Type: INDEX; Schema: public; Owner: student-registration_owner
--

CREATE UNIQUE INDEX "ClassSection_location_day_label_session_key" ON public."ClassSection" USING btree (location, day, label, session);


--
-- Name: Enrollment_studentId_sectionId_key; Type: INDEX; Schema: public; Owner: student-registration_owner
--

CREATE UNIQUE INDEX "Enrollment_studentId_sectionId_key" ON public."Enrollment" USING btree ("studentId", "sectionId");


--
-- Name: Enrollment Enrollment_sectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: student-registration_owner
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES public."ClassSection"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Enrollment Enrollment_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: student-registration_owner
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: student-registration_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict 8qXEhvGN2E2GQhF4lZp51gq3uNraSYpnhOjFRA8HOyg7zuze3Af1rGGCCq1qdwO

