--
-- PostgreSQL database dump
--

\restrict R4NpGf2Rwv8MdEgzBvKuypgwRDXgYjokbehkDMANaKjp3A9UHZzyKejL5hHmAfx

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_settings (
    key text NOT NULL,
    value text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.admin_settings OWNER TO postgres;

--
-- Name: ads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ads (
    id integer NOT NULL,
    slot text NOT NULL,
    image_url text,
    link_url text,
    alt_text text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ads OWNER TO postgres;

--
-- Name: ads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ads_id_seq OWNER TO postgres;

--
-- Name: ads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ads_id_seq OWNED BY public.ads.id;


--
-- Name: enquiries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enquiries (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'unread'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.enquiries OWNER TO postgres;

--
-- Name: enquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.enquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enquiries_id_seq OWNER TO postgres;

--
-- Name: enquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.enquiries_id_seq OWNED BY public.enquiries.id;


--
-- Name: fixtures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fixtures (
    id integer NOT NULL,
    date text NOT NULL,
    "time" text,
    home_team text NOT NULL,
    away_team text NOT NULL,
    competition text DEFAULT 'DStv Premiership'::text NOT NULL,
    venue text NOT NULL,
    ticket_url text,
    completed boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.fixtures OWNER TO postgres;

--
-- Name: fixtures_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fixtures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fixtures_id_seq OWNER TO postgres;

--
-- Name: fixtures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fixtures_id_seq OWNED BY public.fixtures.id;


--
-- Name: gallery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gallery (
    id integer NOT NULL,
    title text NOT NULL,
    type text DEFAULT 'photo'::text NOT NULL,
    url text NOT NULL,
    thumbnail_url text,
    category text DEFAULT 'matches'::text NOT NULL,
    caption text,
    published_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.gallery OWNER TO postgres;

--
-- Name: gallery_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gallery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gallery_id_seq OWNER TO postgres;

--
-- Name: gallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gallery_id_seq OWNED BY public.gallery.id;


--
-- Name: league_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.league_table (
    id integer NOT NULL,
    "position" integer NOT NULL,
    team text NOT NULL,
    logo_url text,
    played integer DEFAULT 0 NOT NULL,
    won integer DEFAULT 0 NOT NULL,
    drawn integer DEFAULT 0 NOT NULL,
    lost integer DEFAULT 0 NOT NULL,
    goals_for integer DEFAULT 0 NOT NULL,
    goals_against integer DEFAULT 0 NOT NULL,
    goal_difference integer DEFAULT 0 NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    is_golden_arrows boolean DEFAULT false NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    season integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.league_table OWNER TO postgres;

--
-- Name: league_table_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.league_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.league_table_id_seq OWNER TO postgres;

--
-- Name: league_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.league_table_id_seq OWNED BY public.league_table.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text,
    category text DEFAULT 'club'::text NOT NULL,
    image_url text NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    author text DEFAULT 'Golden Arrows FC'::text NOT NULL,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    published_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.news OWNER TO postgres;

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_id_seq OWNER TO postgres;

--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: players; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.players (
    id integer NOT NULL,
    name text NOT NULL,
    "position" text NOT NULL,
    number integer NOT NULL,
    nationality text NOT NULL,
    age integer,
    photo_url text,
    bio text,
    appearances integer DEFAULT 0 NOT NULL,
    goals integer DEFAULT 0 NOT NULL,
    assists integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    instagram text,
    facebook text,
    twitter text
);


ALTER TABLE public.players OWNER TO postgres;

--
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.players_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.players_id_seq OWNER TO postgres;

--
-- Name: players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;


--
-- Name: results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.results (
    id integer NOT NULL,
    date text NOT NULL,
    home_team text NOT NULL,
    away_team text NOT NULL,
    home_score integer NOT NULL,
    away_score integer NOT NULL,
    competition text DEFAULT 'DStv Premiership'::text NOT NULL,
    venue text,
    scorers text[] DEFAULT '{}'::text[] NOT NULL,
    match_report text,
    highlight_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.results OWNER TO postgres;

--
-- Name: results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.results_id_seq OWNER TO postgres;

--
-- Name: results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.results_id_seq OWNED BY public.results.id;


--
-- Name: slides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.slides (
    id integer NOT NULL,
    title text NOT NULL,
    image_url text NOT NULL,
    subtitle text,
    link text,
    link_label text,
    sort_order integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.slides OWNER TO postgres;

--
-- Name: slides_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.slides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.slides_id_seq OWNER TO postgres;

--
-- Name: slides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.slides_id_seq OWNED BY public.slides.id;


--
-- Name: social_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.social_posts (
    id integer NOT NULL,
    platform character varying(20) NOT NULL,
    post_url text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT social_posts_platform_check CHECK (((platform)::text = ANY (ARRAY[('facebook'::character varying)::text, ('instagram'::character varying)::text])))
);


ALTER TABLE public.social_posts OWNER TO postgres;

--
-- Name: social_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.social_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_posts_id_seq OWNER TO postgres;

--
-- Name: social_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.social_posts_id_seq OWNED BY public.social_posts.id;


--
-- Name: sponsors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sponsors (
    id integer NOT NULL,
    name text NOT NULL,
    logo_url text NOT NULL,
    website_url text,
    tier text DEFAULT 'partner'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sponsors OWNER TO postgres;

--
-- Name: sponsors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sponsors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sponsors_id_seq OWNER TO postgres;

--
-- Name: sponsors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sponsors_id_seq OWNED BY public.sponsors.id;


--
-- Name: staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff (
    id integer NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    photo_url text,
    bio text,
    nationality text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    instagram text,
    facebook text,
    twitter text
);


ALTER TABLE public.staff OWNER TO postgres;

--
-- Name: staff_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.staff_id_seq OWNER TO postgres;

--
-- Name: staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.staff_id_seq OWNED BY public.staff.id;


--
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name text NOT NULL,
    crest_url text,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teams_id_seq OWNER TO postgres;

--
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- Name: ads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ads ALTER COLUMN id SET DEFAULT nextval('public.ads_id_seq'::regclass);


--
-- Name: enquiries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enquiries ALTER COLUMN id SET DEFAULT nextval('public.enquiries_id_seq'::regclass);


--
-- Name: fixtures id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fixtures ALTER COLUMN id SET DEFAULT nextval('public.fixtures_id_seq'::regclass);


--
-- Name: gallery id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery ALTER COLUMN id SET DEFAULT nextval('public.gallery_id_seq'::regclass);


--
-- Name: league_table id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.league_table ALTER COLUMN id SET DEFAULT nextval('public.league_table_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: players id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq'::regclass);


--
-- Name: results id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.results ALTER COLUMN id SET DEFAULT nextval('public.results_id_seq'::regclass);


--
-- Name: slides id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.slides ALTER COLUMN id SET DEFAULT nextval('public.slides_id_seq'::regclass);


--
-- Name: social_posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_posts ALTER COLUMN id SET DEFAULT nextval('public.social_posts_id_seq'::regclass);


--
-- Name: sponsors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sponsors ALTER COLUMN id SET DEFAULT nextval('public.sponsors_id_seq'::regclass);


--
-- Name: staff id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff ALTER COLUMN id SET DEFAULT nextval('public.staff_id_seq'::regclass);


--
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- Data for Name: admin_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_settings (key, value, updated_at) FROM stdin;
admin_password	@GoldenArrow2026	2026-06-25 16:59:31.260498+00
\.


--
-- Data for Name: ads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ads (id, slot, image_url, link_url, alt_text, updated_at) FROM stdin;
88	fixtures-right-1	\N	\N	\N	2026-06-26 22:02:32.168872+00
89	fixtures-right-2	\N	\N	\N	2026-06-26 22:02:32.168872+00
90	fixtures-right-3	\N	\N	\N	2026-06-26 22:02:32.168872+00
91	results-left-1	\N	\N	\N	2026-06-26 22:02:32.168872+00
92	results-left-2	\N	\N	\N	2026-06-26 22:02:32.168872+00
93	results-left-3	\N	\N	\N	2026-06-26 22:02:32.168872+00
94	results-right-1	\N	\N	\N	2026-06-26 22:02:32.168872+00
95	results-right-2	\N	\N	\N	2026-06-26 22:02:32.168872+00
96	results-right-3	\N	\N	\N	2026-06-26 22:02:32.168872+00
97	table-left-1	\N	\N	\N	2026-06-26 22:02:32.168872+00
98	table-left-2	\N	\N	\N	2026-06-26 22:02:32.168872+00
99	table-left-3	\N	\N	\N	2026-06-26 22:02:32.168872+00
100	table-right-1	\N	\N	\N	2026-06-26 22:02:32.168872+00
101	table-right-2	\N	\N	\N	2026-06-26 22:02:32.168872+00
102	table-right-3	\N	\N	\N	2026-06-26 22:02:32.168872+00
103	fixtures-left	\N	\N	\N	2026-06-26 22:02:58.624751+00
104	fixtures-right	\N	\N	\N	2026-06-26 22:02:58.632698+00
105	results-left	\N	\N	\N	2026-06-26 22:02:58.635665+00
106	results-right	\N	\N	\N	2026-06-26 22:02:58.637756+00
107	table-left	\N	\N	\N	2026-06-26 22:02:58.641406+00
110	table-right	\N	\N	\N	2026-06-26 22:02:58.64491+00
87	fixtures-left-3	\N	\N	\N	2026-06-26 22:48:33.625+00
86	fixtures-left-2	\N	\N	\N	2026-06-26 22:48:37.268+00
85	fixtures-left-1	/api/uploads/1782556689182-vbm17d.jpeg	\N	\N	2026-06-27 10:38:15.527+00
\.


--
-- Data for Name: enquiries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enquiries (id, first_name, last_name, email, subject, message, status, created_at) FROM stdin;
1	Test	User	test@test.com	Website Test	This is a test enquiry to confirm the form works correctly.	resolved	2026-06-02 07:40:04.757247+00
\.


--
-- Data for Name: fixtures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fixtures (id, date, "time", home_team, away_team, competition, venue, ticket_url, completed, created_at) FROM stdin;
6	2026-08-14	15:00	Golden Arrows FC	Mamelodi Sundowns	DStv Premiership	Princess Magogo Stadium	\N	f	2026-06-26 17:56:07.118722+00
1	2026-06-14	15:00	Golden Arrows FC	Mamelodi Sundowns	DStv Premiership	Princess Magogo Stadium	\N	t	2026-06-01 10:51:26.789401+00
2	2026-06-21	15:00	AmaZulu FC	Golden Arrows FC	DStv Premiership	Moses Mabhida Stadium	\N	t	2026-06-01 10:51:28.040813+00
3	2026-06-28	15:00	Golden Arrows FC	Orlando Pirates	DStv Premiership	Princess Magogo Stadium	\N	t	2026-06-01 10:51:29.259643+00
4	2026-07-05	15:00	Kaizer Chiefs	Golden Arrows FC	DStv Premiership	FNB Stadium	\N	t	2026-06-01 10:51:30.702173+00
5	2026-07-12	15:00	Golden Arrows FC	Cape Town City	DStv Premiership	Princess Magogo Stadium	\N	t	2026-06-01 10:51:31.907605+00
\.


--
-- Data for Name: gallery; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gallery (id, title, type, url, thumbnail_url, category, caption, published_at, created_at) FROM stdin;
\.


--
-- Data for Name: league_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.league_table (id, "position", team, logo_url, played, won, drawn, lost, goals_for, goals_against, goal_difference, points, is_golden_arrows, updated_at, season) FROM stdin;
353	1	Orlando Pirates	https://statistic-cdn.scoreaxis.com/team/2fab2dc66865b76fd0ac6175e3d600c4675008a17633fd464ef3ab3d3b59febe-60-60.png	30	21	6	3	58	12	46	69	f	2026-06-27 18:30:05.231231+00	2025
354	2	Mamelodi Sundowns FC	https://statistic-cdn.scoreaxis.com/team/c48a1afce57edd50429551cdfae010d1de9a9ea75b0bbbc80e13b4aac9ca4402-60-60.png	30	20	8	2	57	21	36	68	f	2026-06-27 18:30:05.231231+00	2025
355	3	Kaizer Chiefs	https://statistic-cdn.scoreaxis.com/team/4b5d40da4b020975e1d698092b3f3efae333a8ae288502bd096fc82919ea60c0-60-60.png	30	15	9	6	33	19	14	54	f	2026-06-27 18:30:05.231231+00	2025
356	4	AmaZulu FC	https://statistic-cdn.scoreaxis.com/team/e4ba801bbc79e0c1e10d0934487259ec48192610cff5410c490a70743ae97ea1-60-60.png	30	13	8	9	32	28	4	47	f	2026-06-27 18:30:05.231231+00	2025
357	5	Sekhukhune United	https://statistic-cdn.scoreaxis.com/team/23a95c375f61eb68e87fc64602064b00924a06fb011c71a95156ba5268db9cba-60-60.png	30	11	11	8	32	27	5	44	f	2026-06-27 18:30:05.231231+00	2025
358	6	Lamontville Golden Arrows	https://statistic-cdn.scoreaxis.com/team/a0e358cec51e88c27636ce1663e629fc7333df96d02a42a2028a4f3a586dd8ea-60-60.png	30	11	8	11	34	33	1	41	t	2026-06-27 18:30:05.231231+00	2025
359	7	Polokwane City	https://statistic-cdn.scoreaxis.com/team/1465d378ff733531f62ea9a3e96ca47b04d455d1a0533f5abc8948d475e1eac6-60-60.png	30	9	13	8	21	21	0	40	f	2026-06-27 18:30:05.231231+00	2025
360	8	Durban City	https://statistic-cdn.scoreaxis.com/team/2261d63e689c53444b403371c315d8f72d7f787a86aa45326fc4440a7225c32b-60-60.png	30	10	9	11	25	26	-1	39	f	2026-06-27 18:30:05.231231+00	2025
361	9	Stellenbosch	https://statistic-cdn.scoreaxis.com/team/52e98272013fafe28577b7aad6ad794e46545cd5bf4d03e8e952558648bb9003-60-60.png	30	9	10	11	26	30	-4	37	f	2026-06-27 18:30:05.231231+00	2025
362	10	Siwelele	https://statistic-cdn.scoreaxis.com/team/121008f1718d0f984de69f978c1af2c0503b0b5d67679f41ba9eddb1fc2d9468-60-60.png	30	8	13	9	24	28	-4	37	f	2026-06-27 18:30:05.231231+00	2025
363	11	Richards Bay	https://statistic-cdn.scoreaxis.com/team/f984a3169ae7af557b696e94999853948b643b5bfbaa164c58a7b428c4817e7a-60-60.png	30	7	13	10	23	30	-7	34	f	2026-06-27 18:30:05.231231+00	2025
364	12	TS Galaxy	https://statistic-cdn.scoreaxis.com/team/81c8bf024a9ecf13b27c7eecf02b870f68047ef51406df757e8f684d5aa6f422-60-60.png	30	8	8	14	30	38	-8	32	f	2026-06-27 18:30:05.231231+00	2025
365	13	Chippa United	https://statistic-cdn.scoreaxis.com/team/65723c4e7b466bc9410c608ea0f306af62b1e3e7799c517769ab5b78520db3b1-60-60.png	30	6	10	14	24	44	-20	28	f	2026-06-27 18:30:05.231231+00	2025
366	14	Marumo Gallants	https://statistic-cdn.scoreaxis.com/team/67c0a7bccaf8d3c63d4ee350e59e17030028b889ae4adb1a85b39856545240da-60-60.png	30	4	13	13	21	38	-17	25	f	2026-06-27 18:30:05.231231+00	2025
367	15	Magesi FC	https://statistic-cdn.scoreaxis.com/team/fd00a7b8a82022e844718b8cceabcb78c8c31bb287ab6554662183a01ee4575d-60-60.png	30	5	9	16	24	43	-19	24	f	2026-06-27 18:30:05.231231+00	2025
368	16	Orbit College	https://statistic-cdn.scoreaxis.com/team/48f643d08636f5ddb00b3388b06340804d5ccc7267f053407bdb6e8a575f9296-60-60.png	30	6	6	18	21	47	-26	24	f	2026-06-27 18:30:05.231231+00	2025
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (id, title, slug, excerpt, content, category, image_url, featured, author, tags, published_at, created_at) FROM stdin;
3	Pre-Season Camp Announced for July 2025	preseason-camp-july-2025	The squad will head to a specially arranged pre-season training camp to prepare for the 2025/26 DStv Premiership season.	The squad will head to a specially arranged pre-season training camp to prepare for the 2025/26 DStv Premiership season.	club-news	https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800	f	Arrows Media	{pre-season,training}	2026-05-08 10:52:13.500985+00	2026-06-01 10:52:13.500985+00
4	Junior Arrows Youth Academy Trials Open	youth-academy-trials-2025	Golden Arrows FC is pleased to announce open trials for the Junior Arrows Youth Academy for talented players aged 10-16.	Golden Arrows FC is pleased to announce open trials for the Junior Arrows Youth Academy for talented players aged 10-16.	community	https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800	f	Community Team	{youth,academy,community}	2026-05-11 10:52:14.754139+00	2026-06-01 10:52:14.754139+00
5	Club Partners With Durban Community Schools	community-schools-partnership	As part of our ongoing commitment to KwaZulu-Natal, Golden Arrows has launched a new educational partnership with 10 Durban schools.	As part of our ongoing commitment to KwaZulu-Natal, Golden Arrows has launched a new educational partnership with 10 Durban schools.	community	https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800	f	Community Team	{community,education,KZN}	2026-05-10 10:52:15.913125+00	2026-06-01 10:52:15.913125+00
6	New Away Kit Unveiled for 2025/26 Season	away-kit-unveil-2025-26	Golden Arrows FC is delighted to unveil the stunning new away kit for the upcoming 2025/26 DStv Premiership season.	Golden Arrows FC is delighted to unveil the stunning new away kit for the upcoming 2025/26 DStv Premiership season.	club-news	https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800	f	Arrows Media	{kit,fashion,2025-26}	2026-05-06 10:52:17.261668+00	2026-06-01 10:52:17.261668+00
2	Knox Mutizwa Named PSL Player of the Month	knox-mutizwa-player-month	Our talismanic striker Knox Mutizwa has been recognised for his outstanding contributions in April, collecting 5 crucial goals.	Our talismanic striker Knox Mutizwa has been recognised for his outstanding contributions in April, collecting 5 crucial goals.	club-news	https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800	f	Arrows Media	{awards,knox-mutizwa}	2026-05-21 10:52:12.143813+00	2026-06-01 10:52:12.143813+00
12	Golden Arrows Sign JUNIOR SEDE DION	golden-arrows-sign-junior-sede-dion-1782208857182	Lamontville Golden Arrows FC are delighted to announce the signing of JUNIOR SEDE DION, IVORIEN forward.	IVORIEN forward JUNIOR SEDE DION joins Lamontville Golden Arrows FC. The 28-year-old signing wears the number 18 shirt and is set to strengthen the Abafana Bes'thende squad.\n\n"We are delighted to welcome JUNIOR to the club," said a club spokesperson.\n\nJUNIOR SEDE DION is available immediately and the club wishes him every success in the famous Golden Arrows colours.	Transfer News	/api/uploads/1782208717247-gow8e3.png	t	Golden Arrows FC	{Transfer,Squad,Signing}	2026-06-23 10:00:59.757227+00	2026-06-23 10:00:59.757227+00
16	Golden Arrows Appoint Jacob Mokhasi as Assistant Coach	golden-arrows-appoint-jacob-mokhasi-1782513581194	Lamontville Golden Arrows FC are pleased to announce the appointment of Jacob Mokhasi as Assistant Coach.	South African assistant coach Jacob Mokhasi joins Lamontville Golden Arrows FC as assistant coach. The 43-year-old experienced tactician is set to guide Abafana Bes'thende this season.\n\n"We are thrilled to welcome Jacob to the club and look forward to the expertise they will bring," said a club spokesperson.	Club News	/api/uploads/1782547816432-jy93zw.jpeg	f	Golden Arrows FC	{Coaching,Management,"Club News"}	2026-06-26 22:39:46.722864+00	2026-06-26 22:39:46.722864+00
14	Golden Arrows Appoint James Madidilane as Assistant Coach	golden-arrows-appoint-james-madidilane-1782403583493	Lamontville Golden Arrows FC are pleased to announce the appointment of James Madidilane as Assistant Coach.	South African assistant coach James Madidilane joins Lamontville Golden Arrows FC as assistant coach. The 47-year-old experienced tactician is set to guide Abafana Bes'thende this season.\n\n"We are thrilled to welcome James to the club and look forward to the expertise they will bring," said a club spokesperson.	Club News	/api/uploads/1782547836705-jr70ok.jpeg	f	Golden Arrows FC	{Coaching,Management,"Club News"}	2026-06-25 16:06:27.553155+00	2026-06-25 16:06:27.553155+00
13	Golden Arrows Appoint Jacob Mokhasi as Assistant Coach	golden-arrows-appoint-jacob-mokhasi-1782403540691	Lamontville Golden Arrows FC are pleased to announce the appointment of Jacob Mokhasi as Assistant Coach.	South African assistant coach Jacob Mokhasi joins Lamontville Golden Arrows FC as assistant coach. The 35-year-old experienced tactician is set to guide Abafana Bes'thende this season.\n\n"We are thrilled to welcome Jacob to the club and look forward to the expertise they will bring," said a club spokesperson.	Club News	/api/uploads/1782547853250-vhhsu1.jpeg	f	Golden Arrows FC	{Coaching,Management,"Club News"}	2026-06-25 16:05:44.742237+00	2026-06-25 16:05:44.742237+00
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.players (id, name, "position", number, nationality, age, photo_url, bio, appearances, goals, assists, created_at, instagram, facebook, twitter) FROM stdin;
2	Nkosinathi Sibisi	Goalkeeper	16	South African	24	\N	Promising backup goalkeeper pushing for a starting spot.	4	0	0	2026-06-01 10:50:33.020218+00	\N	\N	\N
3	Nhlanhla Vilakazi	Defender	5	South African	27	\N	Commanding center-back and club captain. A leader on and off the pitch.	21	1	2	2026-06-01 10:50:34.897998+00	\N	\N	\N
4	Mondli Mpungose	Defender	3	South African	25	\N	Pacey left-back who contributes going forward.	19	0	1	2026-06-01 10:50:36.051642+00	\N	\N	\N
5	Thabo Molefe	Defender	4	South African	28	\N	Experienced right-back, strong in the tackle.	20	2	0	2026-06-01 10:50:37.188766+00	\N	\N	\N
6	Sibusiso Mthembu	Defender	6	South African	23	\N	Young center-back with excellent reading of the game.	15	0	0	2026-06-01 10:50:38.426137+00	\N	\N	\N
7	Phumlani Ntanzi	Midfielder	8	South African	26	\N	Creative midfielder and the engine of Golden Arrows. An assist machine.	23	4	7	2026-06-01 10:50:39.758824+00	\N	\N	\N
8	Lungelo Dlamini	Midfielder	10	South African	24	\N	Technically gifted number 10, brilliant in tight spaces.	22	5	4	2026-06-01 10:50:40.872542+00	\N	\N	\N
9	Mxolisi Macuphu	Midfielder	14	South African	28	\N	Defensive midfielder who wins the ball and distributes simply.	18	2	3	2026-06-01 10:50:42.082897+00	\N	\N	\N
10	Nkosinathi Mthembu	Midfielder	7	South African	22	\N	Exciting wide midfielder with pace and directness.	16	3	2	2026-06-01 10:50:43.306283+00	\N	\N	\N
11	Knox Mutizwa	Forward	9	Zimbabwean	30	\N	Club legend and top scorer. Knox's goals have fired Golden Arrows to numerous victories. Lightning quick, clinical finish.	24	12	3	2026-06-01 10:50:44.563234+00	\N	\N	\N
12	Sibusiso Khumalo	Forward	11	South African	25	\N	Explosive left winger with electric pace and a nose for goal.	20	8	4	2026-06-01 10:50:45.788081+00	\N	\N	\N
13	Nduduzo Sibiya	Forward	21	South African	22	\N	Versatile attacker who can play anywhere across the front line.	14	5	2	2026-06-01 10:50:47.110223+00	\N	\N	\N
14	Serge Malema	Forward	17	South African	26			11	26	0	2026-06-01 13:49:24.794201+00	\N	\N	\N
15	Sibusiso Ngidi	Forward	27	South African	22			0	0	0	2026-06-02 07:48:11.075545+00	\N	\N	\N
16	Alan Boots	Goalkeeper	58	Zambian	26			0	0	0	2026-06-02 07:50:31.483385+00	\N	\N	\N
17	Junoir Lukichwa	Forward	16	South African	22			0	0	0	2026-06-02 18:41:56.906215+00	\N	\N	\N
18	Junior Lukichwa	Forward	19	Congolese	22			0	0	0	2026-06-02 18:44:23.308901+00	\N	\N	\N
20	JUNIOR SEDE DION	Forward	18	IVORIEN	28	/api/uploads/1782208717247-gow8e3.png		19	14	0	2026-06-23 10:00:59.317784+00	\N	\N	\N
22	James Madidilane	Assistant Coach	1	South African	47	/api/uploads/1782513476689-pipmf0.jpg		0	0	0	2026-06-25 16:06:27.115019+00	\N	\N	\N
24	Jacob Mokhasi	Assistant Coach	1	South African	43	/api/uploads/1782513498338-hn0kvj.jpg		0	0	0	2026-06-26 22:39:46.376266+00	\N	\N	\N
21	Jacob Mokhasi	Assistant Coach	1	South African	35	/api/uploads/1782513454064-k3sb9m.jpg	Represented South Africa at various youth levels, including the U-23 team. Notably part of the South African U-23 squad that participated in the Toulon Tournament in France.\nAfter retiring from professional play, Mokhasi transitioned into coaching, bringing his extensive experience to the development of future goalkeepers. \nIn July 2024, he joined Marumo Gallants as the goalkeeper coach, contributing to the team's technical staff.	0	0	0	2026-06-25 16:05:44.471382+00	\N	\N	\N
\.


--
-- Data for Name: results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.results (id, date, home_team, away_team, home_score, away_score, competition, venue, scorers, match_report, highlight_url, created_at) FROM stdin;
6	2026-06-02	Lamontville Golden Arrows	Kaizer Chiefs	2	1	DStv Premiership	Princess Magogo Stadium	{"Mthethwa 24'","Dube 67'"}	\N	\N	2026-06-02 07:49:36.029458+00
14	2025-05-24	Golden Arrows FC	Sekhukhune United	2	1	DStv Premiership	Princess Magogo Stadium	{"Knox Mutizwa 23'","Phumlani Ntanzi 67'"}	Golden Arrows secured all three points in a hard-fought home victory over Sekhukhune United. Knox Mutizwa opened the scoring with a clinical finish before Ntanzi doubled the lead with a long-range strike. Sekhukhune pulled one back late on, but Arrows held on for a crucial win.	\N	2026-06-01 10:51:32+00
15	2025-05-17	TS Galaxy	Golden Arrows FC	1	1	DStv Premiership	Mbombela Stadium	{"Lungelo Dlamini 45'"}	A hard-earned point away at TS Galaxy. Dlamini's brilliant first-half equalizer rescued a point for Arrows.	\N	2026-06-01 10:51:34+00
16	2025-05-10	Golden Arrows FC	Swallows FC	3	0	DStv Premiership	Princess Magogo Stadium	{"Knox Mutizwa 12'","Knox Mutizwa 34'","Sibusiso Khumalo 78'"}	A dominant home performance as Arrows swept Swallows aside with a commanding 3-0 victory. Knox Mutizwa bagged a brace to continue his prolific form.	\N	2026-06-01 10:51:35+00
17	2025-05-03	Mamelodi Sundowns	Golden Arrows FC	2	0	DStv Premiership	Loftus Versfeld	{}	A tough afternoon against the league leaders. Sundowns proved too strong on the day, though Golden Arrows showed tremendous fighting spirit.	\N	2026-06-01 10:51:37+00
18	2025-04-26	Golden Arrows FC	Chippa United	2	1	DStv Premiership	Princess Magogo Stadium	{"Nduduzo Sibiya 55'","Knox Mutizwa 82'"}	Knox Mutizwa's late winner delighted the Arrows faithful as the club claimed three vital points against Chippa United.	\N	2026-06-01 10:51:38+00
19	2025-04-19	Orlando Pirates	Golden Arrows FC	1	1	DStv Premiership	Orlando Stadium	{}	\N	\N	2026-06-23 10:14:55+00
20	2025-04-12	Golden Arrows FC	Stellenbosch FC	2	0	DStv Premiership	Princess Magogo Stadium	{}	\N	\N	2026-06-23 10:14:55+00
21	2025-04-05	Richards Bay FC	Golden Arrows FC	0	1	DStv Premiership	King Zwelithini Stadium	{}	\N	\N	2026-06-23 10:14:55+00
22	2025-03-29	Golden Arrows FC	AmaZulu FC	1	2	DStv Premiership	Princess Magogo Stadium	{}	\N	\N	2026-06-23 10:14:55+00
23	2025-03-22	Cape Town City	Golden Arrows FC	0	0	DStv Premiership	DHL Newlands Stadium	{}	\N	\N	2026-06-23 10:14:55+00
24	2025-03-15	Golden Arrows FC	Polokwane City	1	0	DStv Premiership	Princess Magogo Stadium	{}	\N	\N	2026-06-23 10:22:09+00
25	2025-03-08	Marumo Gallants	Golden Arrows FC	1	1	DStv Premiership	Peter Mokaba Stadium	{}	\N	\N	2026-06-23 10:22:09+00
\.


--
-- Data for Name: slides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.slides (id, title, image_url, subtitle, link, link_label, sort_order, active, created_at) FROM stdin;
4		/api/uploads/1782496002976-q3nl2t.jpg				0	t	2026-06-26 17:46:50.148305+00
3		/api/uploads/1782494883408-x9zauo.jpg				1	t	2026-06-26 17:28:48.080947+00
5		/api/uploads/1782497002183-g4y6tl.jpg				1	t	2026-06-26 18:03:26.558328+00
1	Abafana Bes'thende	/api/uploads/1780388118425-ajmqpp.jpg	The Pride of KwaZulu-Natal. Passion, Spirit, and Electric Football.			2	f	2026-06-02 08:15:52.782447+00
2	Golden Birthdays	/api/uploads/1780388317426-tq8o6q.png	We celebrate you			4	f	2026-06-02 08:18:55.311658+00
\.


--
-- Data for Name: social_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_posts (id, platform, post_url, display_order, created_at) FROM stdin;
7	facebook	https://www.facebook.com/photo?fbid=1602358955183922&set=pcb.1602359011850583	0	2026-06-23 10:55:05.779326+00
8	instagram	https://www.instagram.com/p/DZ22nT8sDoN/	0	2026-06-23 10:55:49.863755+00
9	facebook	https://www.facebook.com/photo?fbid=1599025725517245&set=a.573656698054158	0	2026-06-23 10:56:34.852095+00
10	facebook	https://www.facebook.com/photo/?fbid=1584016057018212&set=pcb.1584016107018207	0	2026-06-23 10:57:25.604082+00
11	instagram	https://www.instagram.com/p/DZ__he0sZFI/	0	2026-06-25 15:56:26.491511+00
\.


--
-- Data for Name: sponsors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sponsors (id, name, logo_url, website_url, tier, created_at) FROM stdin;
1	DStv	https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/DStv_logo.svg/200px-DStv_logo.svg.png	https://www.dstv.com	title	2026-06-01 10:52:18.738839+00
2	Nedbank	https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Nedbank_logo.svg/200px-Nedbank_logo.svg.png	https://www.nedbank.co.za	main	2026-06-01 10:52:20.093868+00
3	Castle Lager	https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Castle-lager-logo.svg/200px-Castle-lager-logo.svg.png	https://www.castlelager.co.za	partner	2026-06-01 10:52:21.620334+00
4	eThekwini Municipality	https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Coat_of_arms_of_Durban.svg/200px-Coat_of_arms_of_Durban.svg.png	https://www.durban.gov.za	partner	2026-06-01 10:52:23.025642+00
5	Hollywoodbets	https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Hollywoodbets_logo.svg/200px-Hollywoodbets_logo.svg.png	https://www.hollywoodbets.net	partner	2026-06-01 10:52:24.315736+00
\.


--
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.staff (id, name, role, photo_url, bio, nationality, created_at, instagram, facebook, twitter) FROM stdin;
1	Vusumuzi Vilakazi	Head Coach	\N	Experienced PSL coach with a calm, tactical approach. Has led the team through several memorable campaigns.	South African	2026-06-01 10:51:17.458187+00	\N	\N	\N
2	Sbusiso Dlamini	Assistant Coach	\N	Works closely with the head coach on training sessions and match preparation.	South African	2026-06-01 10:51:18.654436+00	\N	\N	\N
3	Lungelo Ntanzi	Goalkeeper Coach	\N	Specialist goalkeeper coach who develops our shot-stoppers.	South African	2026-06-01 10:51:20.015876+00	\N	\N	\N
4	Nhlanhla Cele	Fitness Coach	\N	Ensures players maintain peak physical condition throughout the season.	South African	2026-06-01 10:51:21.468931+00	\N	\N	\N
5	Dr. Sipho Khumalo	Club Doctor	\N	Leads the medical team, overseeing player health and injury management.	South African	2026-06-01 10:51:22.875671+00	\N	\N	\N
6	Thulani Mthembu	Physiotherapist	\N	Expert physio dedicated to player rehabilitation and injury prevention.	South African	2026-06-01 10:51:24.278286+00	\N	\N	\N
7	Nomvula Zulu	Sports Analyst	\N	Provides data-driven insights to guide tactical decisions and opponent analysis.	South African	2026-06-01 10:51:25.656108+00	\N	\N	\N
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id, name, crest_url, active, created_at) FROM stdin;
1	Mamelodi Sundowns	/crests/mamelodi-sundowns.png	t	2026-06-25 17:09:15.479384+00
2	Orlando Pirates	/crests/orlando-pirates.png	t	2026-06-25 17:09:15.479384+00
3	Stellenbosch	/crests/stellenbosch.png	t	2026-06-25 17:09:15.479384+00
4	Sekhukhune United	/crests/sekhukhune-united.png	t	2026-06-25 17:09:15.479384+00
5	TS Galaxy	/crests/ts-galaxy.png	t	2026-06-25 17:09:15.479384+00
6	AmaZulu	/crests/amazulu.png	t	2026-06-25 17:09:15.479384+00
8	Polokwane City	/crests/polokwane-city.png	t	2026-06-25 17:09:15.479384+00
9	Richards Bay	/crests/richards-bay.png	t	2026-06-25 17:09:15.479384+00
10	Kaizer Chiefs	/crests/kaizer-chiefs.png	t	2026-06-25 17:09:15.479384+00
11	Marumo Gallants	/crests/marumo-gallants.png	t	2026-06-25 17:09:15.479384+00
12	Chippa United	/crests/chippa-united.png	t	2026-06-25 17:09:15.479384+00
13	Golden Arrows	/crests/golden-arrows.png	t	2026-06-25 17:09:15.479384+00
16	Magesi	/crests/magesi.png	t	2026-06-25 17:09:15.479384+00
17	Supersport United	\N	t	2026-06-25 17:09:15.479384+00
18	Cape Town City	\N	t	2026-06-25 17:09:15.479384+00
20	Siwelele	/crests/siwelele.png	t	2026-06-25 17:09:15.479384+00
21	Durban City	/crests/durban-city.png	t	2026-06-25 17:09:15.479384+00
22	Orbit College	/crests/orbit-college.png	t	2026-06-25 17:09:15.479384+00
\.


--
-- Name: ads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ads_id_seq', 5549, true);


--
-- Name: enquiries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enquiries_id_seq', 1, true);


--
-- Name: fixtures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fixtures_id_seq', 6, true);


--
-- Name: gallery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gallery_id_seq', 1, false);


--
-- Name: league_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.league_table_id_seq', 368, true);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.news_id_seq', 16, true);


--
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.players_id_seq', 24, true);


--
-- Name: results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.results_id_seq', 25, true);


--
-- Name: slides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.slides_id_seq', 5, true);


--
-- Name: social_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.social_posts_id_seq', 11, true);


--
-- Name: sponsors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sponsors_id_seq', 5, true);


--
-- Name: staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staff_id_seq', 7, true);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_id_seq', 22, true);


--
-- Name: admin_settings admin_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_settings
    ADD CONSTRAINT admin_settings_pkey PRIMARY KEY (key);


--
-- Name: ads ads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ads
    ADD CONSTRAINT ads_pkey PRIMARY KEY (id);


--
-- Name: ads ads_slot_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ads
    ADD CONSTRAINT ads_slot_key UNIQUE (slot);


--
-- Name: enquiries enquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enquiries
    ADD CONSTRAINT enquiries_pkey PRIMARY KEY (id);


--
-- Name: fixtures fixtures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fixtures
    ADD CONSTRAINT fixtures_pkey PRIMARY KEY (id);


--
-- Name: gallery gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery
    ADD CONSTRAINT gallery_pkey PRIMARY KEY (id);


--
-- Name: league_table league_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.league_table
    ADD CONSTRAINT league_table_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: news news_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_slug_unique UNIQUE (slug);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: results results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_pkey PRIMARY KEY (id);


--
-- Name: slides slides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.slides
    ADD CONSTRAINT slides_pkey PRIMARY KEY (id);


--
-- Name: social_posts social_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_posts
    ADD CONSTRAINT social_posts_pkey PRIMARY KEY (id);


--
-- Name: sponsors sponsors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sponsors
    ADD CONSTRAINT sponsors_pkey PRIMARY KEY (id);


--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);


--
-- Name: teams teams_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_name_key UNIQUE (name);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT CREATE ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict R4NpGf2Rwv8MdEgzBvKuypgwRDXgYjokbehkDMANaKjp3A9UHZzyKejL5hHmAfx

