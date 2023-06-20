\connect uvgram_db

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
-- Name: AccountStatusType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."AccountStatusType" AS ENUM (
    'BLOQUEADO',
    'NO_BLOQUEADO'
);


ALTER TYPE public."AccountStatusType" OWNER TO dev;

--
-- Name: CategoryType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."CategoryType" AS ENUM (
    'BLOG_PERSONAL',
    'PRODUCTO_O_SERVICIO',
    'ARTE',
    'MUSICO_O_BANDA',
    'COMPRAS_VENTAS_MINORISTAS',
    'SALUD_BELLEZA',
    'TIENDAS_COMESTIBLES'
);


ALTER TYPE public."CategoryType" OWNER TO dev;

--
-- Name: FollowRequestStatusType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."FollowRequestStatusType" AS ENUM (
    'ACEPTADO',
    'PENDIENTE'
);


ALTER TYPE public."FollowRequestStatusType" OWNER TO dev;

--
-- Name: GenderType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."GenderType" AS ENUM (
    'MASCULINO',
    'FEMENINO',
    'INDIFERENTE'
);


ALTER TYPE public."GenderType" OWNER TO dev;

--
-- Name: LoginStateType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."LoginStateType" AS ENUM (
    'BLOQUEADO',
    'NO_BLOQUEADO'
);


ALTER TYPE public."LoginStateType" OWNER TO dev;

--
-- Name: PrivacyType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."PrivacyType" AS ENUM (
    'PUBLICO',
    'PRIVADO'
);


ALTER TYPE public."PrivacyType" OWNER TO dev;

--
-- Name: UserRoleType; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."UserRoleType" AS ENUM (
    'PERSONAL',
    'EMPRESARIAL',
    'MODERADOR',
    'ADMINISTRADOR'
);


ALTER TYPE public."UserRoleType" OWNER TO dev;

--
-- Name: enum_AccountVerification_account_status; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_AccountVerification_account_status" AS ENUM (
    'BLOQUEADO',
    'NO_BLOQUEADO'
);


ALTER TYPE public."enum_AccountVerification_account_status" OWNER TO dev;

--
-- Name: enum_Business_category; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_Business_category" AS ENUM (
    'BLOG_PERSONAL',
    'PRODUCTO_O_SERVICIO',
    'ARTE',
    'MUSICO_O_BANDA',
    'COMPRAS_O_VENTAS_MINORISTAS',
    'SALUD_O_BELLEZA',
    'TIENDAS_COMESTIBLES'
);


ALTER TYPE public."enum_Business_category" OWNER TO dev;

--
-- Name: enum_Follower_status; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_Follower_status" AS ENUM (
    'ACEPTADO',
    'PENDIENTE'
);


ALTER TYPE public."enum_Follower_status" OWNER TO dev;

--
-- Name: enum_Personal_gender; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_Personal_gender" AS ENUM (
    'MASCULINO',
    'FEMENINO',
    'INDIFERENTE'
);


ALTER TYPE public."enum_Personal_gender" OWNER TO dev;

--
-- Name: enum_Personal_sexo; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_Personal_sexo" AS ENUM (
    'MASCULINO',
    'FEMENINO',
    'INDIFERENTE'
);


ALTER TYPE public."enum_Personal_sexo" OWNER TO dev;

--
-- Name: enum_RolUsuario_rol_usuario; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_RolUsuario_rol_usuario" AS ENUM (
    'PERSONAL',
    'EMPRESARIAL',
    'MODERADOR',
    'ADMINISTRADOR'
);


ALTER TYPE public."enum_RolUsuario_rol_usuario" OWNER TO dev;

--
-- Name: enum_RolUsuario_role; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_RolUsuario_role" AS ENUM (
    'PERSONAL',
    'EMPRESARIAL',
    'MODERADOR',
    'ADMINISTRADOR'
);


ALTER TYPE public."enum_RolUsuario_role" OWNER TO dev;

--
-- Name: enum_UserConfiguration_privacy; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_UserConfiguration_privacy" AS ENUM (
    'PUBLICO',
    'PRIVADO',
    'PRIVATE'
);


ALTER TYPE public."enum_UserConfiguration_privacy" OWNER TO dev;

--
-- Name: enum_UserRole_role; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_UserRole_role" AS ENUM (
    'PERSONAL',
    'EMPRESARIAL',
    'MODERADOR',
    'MODERATOR',
    'ADMINISTRADOR'
);


ALTER TYPE public."enum_UserRole_role" OWNER TO dev;

--
-- Name: enum_VerificacionCuenta_account_status; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_VerificacionCuenta_account_status" AS ENUM (
    'BLOQUEADO',
    'NO_BLOQUEADO'
);


ALTER TYPE public."enum_VerificacionCuenta_account_status" OWNER TO dev;

--
-- Name: enum_VerificacionCuenta_estado_cuenta; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public."enum_VerificacionCuenta_estado_cuenta" AS ENUM (
    'BLOQUEADO',
    'NO_BLOQUEADO'
);


ALTER TYPE public."enum_VerificacionCuenta_estado_cuenta" OWNER TO dev;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Account" (
    password character varying(128) NOT NULL,
    email character varying(254) NOT NULL,
    id_user bigint NOT NULL,
    phone_number character varying(15),
    birthday date NOT NULL
);


ALTER TABLE public."Account" OWNER TO dev;

--
-- Name: AccountVerification; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."AccountVerification" (
    account_status public."AccountStatusType" NOT NULL,
    id_user bigint
);


ALTER TABLE public."AccountVerification" OWNER TO dev;

--
-- Name: Administrator; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Administrator" (
    created_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_user bigint NOT NULL
);


ALTER TABLE public."Administrator" OWNER TO dev;

--
-- Name: Block; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Block" (
    id_user_blocker bigint NOT NULL,
    id_user_blocked bigint NOT NULL
);


ALTER TABLE public."Block" OWNER TO dev;

--
-- Name: Business; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Business" (
    category public."CategoryType",
    city character varying(340),
    postal_code character varying(16),
    postal_address character varying(420),
    contact_email character varying(340),
    phone_contact character varying(15),
    organization_name character varying(340),
    id_user bigint
);


ALTER TABLE public."Business" OWNER TO dev;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Comment" (
    comment character varying(2200) NOT NULL,
    created_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id bigint DEFAULT nextval(('"comment_id_seq"'::text)::regclass) NOT NULL,
    id_post bigint NOT NULL,
    id_user bigint NOT NULL,
    uuid character varying(11) NOT NULL
);


ALTER TABLE public."Comment" OWNER TO dev;

--
-- Name: CommentLike; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."CommentLike" (
    id_comment bigint NOT NULL,
    id_user bigint NOT NULL
);


ALTER TABLE public."CommentLike" OWNER TO dev;

--
-- Name: EducationalProgram; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."EducationalProgram" (
    id bigint DEFAULT nextval(('"educationalprogram_id_seq"'::text)::regclass) NOT NULL,
    educational_program character varying(240) NOT NULL,
    id_faculty bigint NOT NULL
);


ALTER TABLE public."EducationalProgram" OWNER TO dev;

--
-- Name: Faculty; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Faculty" (
    faculty character varying(120),
    id_region bigint,
    id bigint DEFAULT nextval(('"faculty_id_seq"'::text)::regclass) NOT NULL
);


ALTER TABLE public."Faculty" OWNER TO dev;

--
-- Name: Follower; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Follower" (
    id_user_follower bigint NOT NULL,
    id_user_followed bigint NOT NULL,
    status public."FollowRequestStatusType" NOT NULL
);


ALTER TABLE public."Follower" OWNER TO dev;

--
-- Name: LoginAttempts; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."LoginAttempts" (
    attempts integer,
    login_state public."LoginStateType",
    mac_address character varying(17) NOT NULL
);


ALTER TABLE public."LoginAttempts" OWNER TO dev;

--
-- Name: Moderator; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Moderator" (
    update_date date,
    id_user bigint
);


ALTER TABLE public."Moderator" OWNER TO dev;

--
-- Name: NestedComment; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."NestedComment" (
    parent_id_comment bigint NOT NULL,
    child_id_comment bigint NOT NULL
);


ALTER TABLE public."NestedComment" OWNER TO dev;

--
-- Name: Personal; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Personal" (
    gender public."GenderType",
    id_user bigint,
    id_career bigint
);


ALTER TABLE public."Personal" OWNER TO dev;

--
-- Name: Post; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Post" (
    description character varying(2200),
    comments_allowed boolean DEFAULT true NOT NULL,
    likes_allowed boolean DEFAULT true NOT NULL,
    id_user bigint NOT NULL,
    id bigint DEFAULT nextval(('"post_id_seq"'::text)::regclass) NOT NULL,
    uuid character varying(320) NOT NULL
);


ALTER TABLE public."Post" OWNER TO dev;

--
-- Name: PostFile; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."PostFile" (
    filename character varying(128) NOT NULL,
    id_post bigint NOT NULL
);


ALTER TABLE public."PostFile" OWNER TO dev;

--
-- Name: PostLike; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."PostLike" (
    id_user bigint NOT NULL,
    id_post bigint NOT NULL
);


ALTER TABLE public."PostLike" OWNER TO dev;

--
-- Name: Region; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Region" (
    id bigint DEFAULT nextval(('"region_id_seq"'::text)::regclass) NOT NULL,
    region character varying(120) NOT NULL
);


ALTER TABLE public."Region" OWNER TO dev;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Session" (
    id_user bigint NOT NULL,
    token text NOT NULL,
    created_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    device text NOT NULL
);


ALTER TABLE public."Session" OWNER TO dev;

--
-- Name: URLRecover; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."URLRecover" (
    uuid uuid NOT NULL,
    id_user bigint NOT NULL,
    action character varying(50) NOT NULL,
    token text
);


ALTER TABLE public."URLRecover" OWNER TO dev;

--
-- Name: User; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."User" (
    name character varying(64) NOT NULL,
    presentation character varying(150),
    username character varying(30) NOT NULL,
    id bigint DEFAULT nextval(('"user_id_seq"'::text)::regclass) NOT NULL
);


ALTER TABLE public."User" OWNER TO dev;

--
-- Name: UserConfiguration; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."UserConfiguration" (
    privacy public."PrivacyType",
    id_user bigint
);


ALTER TABLE public."UserConfiguration" OWNER TO dev;

--
-- Name: UserRole; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."UserRole" (
    id_user bigint NOT NULL,
    role public."UserRoleType"
);


ALTER TABLE public."UserRole" OWNER TO dev;

--
-- Name: VerificationCode; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."VerificationCode" (
    code character varying(8),
    username character varying(64) NOT NULL,
    created_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."VerificationCode" OWNER TO dev;

--
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comment_id_seq OWNER TO dev;

--
-- Name: educationalprogram_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.educationalprogram_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.educationalprogram_id_seq OWNER TO dev;

--
-- Name: faculty_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.faculty_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.faculty_id_seq OWNER TO dev;

--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.post_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_id_seq OWNER TO dev;

--
-- Name: region_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.region_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.region_id_seq OWNER TO dev;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO dev;

--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Account" (password, email, id_user, phone_number, birthday) FROM stdin;
\.


--
-- Data for Name: AccountVerification; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."AccountVerification" (account_status, id_user) FROM stdin;
\.


--
-- Data for Name: Administrator; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Administrator" (created_time, id_user) FROM stdin;
\.


--
-- Data for Name: Block; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Block" (id_user_blocker, id_user_blocked) FROM stdin;
\.


--
-- Data for Name: Business; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Business" (category, city, postal_code, postal_address, contact_email, phone_contact, organization_name, id_user) FROM stdin;
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Comment" (comment, created_time, id, id_post, id_user, uuid) FROM stdin;
\.


--
-- Data for Name: CommentLike; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."CommentLike" (id_comment, id_user) FROM stdin;
\.


--
-- Data for Name: EducationalProgram; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."EducationalProgram" (id, educational_program, id_faculty) FROM stdin;
\.


--
-- Data for Name: Faculty; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Faculty" (faculty, id_region, id) FROM stdin;
\.


--
-- Data for Name: Follower; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Follower" (id_user_follower, id_user_followed, status) FROM stdin;
\.


--
-- Data for Name: LoginAttempts; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."LoginAttempts" (attempts, login_state, mac_address) FROM stdin;
\.


--
-- Data for Name: Moderator; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Moderator" (update_date, id_user) FROM stdin;
\.


--
-- Data for Name: NestedComment; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."NestedComment" (parent_id_comment, child_id_comment) FROM stdin;
\.


--
-- Data for Name: Personal; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Personal" (gender, id_user, id_career) FROM stdin;
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Post" (description, comments_allowed, likes_allowed, id_user, id, uuid) FROM stdin;
\.


--
-- Data for Name: PostFile; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."PostFile" (filename, id_post) FROM stdin;
\.


--
-- Data for Name: PostLike; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."PostLike" (id_user, id_post) FROM stdin;
\.


--
-- Data for Name: Region; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Region" (id, region) FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Session" (id_user, token, created_time, device) FROM stdin;
\.


--
-- Data for Name: URLRecover; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."URLRecover" (uuid, id_user, action, token) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."User" (name, presentation, username, id) FROM stdin;
\.


--
-- Data for Name: UserConfiguration; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."UserConfiguration" (privacy, id_user) FROM stdin;
\.


--
-- Data for Name: UserRole; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."UserRole" (id_user, role) FROM stdin;
\.


--
-- Data for Name: VerificationCode; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."VerificationCode" (code, username, created_time) FROM stdin;
\.


--
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.comment_id_seq', 1, false);


--
-- Name: educationalprogram_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.educationalprogram_id_seq', 1, false);


--
-- Name: faculty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.faculty_id_seq', 1, false);


--
-- Name: post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.post_id_seq', 1, false);


--
-- Name: region_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.region_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.user_id_seq', 1, false);


--
-- Name: Account PK_Account; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "PK_Account" PRIMARY KEY (id_user);


--
-- Name: Administrator PK_Administrator; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Administrator"
    ADD CONSTRAINT "PK_Administrator" PRIMARY KEY (id_user);


--
-- Name: Comment PK_Comment; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "PK_Comment" PRIMARY KEY (id);


--
-- Name: EducationalProgram PK_EducationalProgram; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."EducationalProgram"
    ADD CONSTRAINT "PK_EducationalProgram" PRIMARY KEY (id);


--
-- Name: Faculty PK_Faculty; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Faculty"
    ADD CONSTRAINT "PK_Faculty" PRIMARY KEY (id);


--
-- Name: LoginAttempts PK_LoginAttempts; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."LoginAttempts"
    ADD CONSTRAINT "PK_LoginAttempts" PRIMARY KEY (mac_address);


--
-- Name: Post PK_Publication; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "PK_Publication" PRIMARY KEY (id);


--
-- Name: Region PK_Region; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Region"
    ADD CONSTRAINT "PK_Region" PRIMARY KEY (id);


--
-- Name: URLRecover PK_URLRecover; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."URLRecover"
    ADD CONSTRAINT "PK_URLRecover" PRIMARY KEY (id_user);


--
-- Name: User PK_User; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "PK_User" PRIMARY KEY (id);


--
-- Name: UserRole PK_UserRole; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "PK_UserRole" PRIMARY KEY (id_user);


--
-- Name: IXFK_AccountVerification_Account; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_AccountVerification_Account" ON public."AccountVerification" USING btree (id_user);


--
-- Name: IXFK_Account_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Account_User" ON public."Account" USING btree (id_user);


--
-- Name: IXFK_Administrator_UserRole; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Administrator_UserRole" ON public."Administrator" USING btree (id_user);


--
-- Name: IXFK_Block_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Block_User" ON public."Block" USING btree (id_user_blocker);


--
-- Name: IXFK_Block_User_02; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Block_User_02" ON public."Block" USING btree (id_user_blocked);


--
-- Name: IXFK_Business_UserRole; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Business_UserRole" ON public."Business" USING btree (id_user);


--
-- Name: IXFK_CommentLike_Comment; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_CommentLike_Comment" ON public."CommentLike" USING btree (id_comment);


--
-- Name: IXFK_CommentLike_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_CommentLike_User" ON public."CommentLike" USING btree (id_user);


--
-- Name: IXFK_Comment_Post; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Comment_Post" ON public."Comment" USING btree (id_post);


--
-- Name: IXFK_Comment_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Comment_User" ON public."Comment" USING btree (id_user);


--
-- Name: IXFK_EducationalProgram_Faculty; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_EducationalProgram_Faculty" ON public."EducationalProgram" USING btree (id_faculty);


--
-- Name: IXFK_Faculty_Region; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Faculty_Region" ON public."Faculty" USING btree (id_region);


--
-- Name: IXFK_Follower_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Follower_User" ON public."Follower" USING btree (id_user_follower);


--
-- Name: IXFK_Follower_User_02; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Follower_User_02" ON public."Follower" USING btree (id_user_followed);


--
-- Name: IXFK_Moderator_UserRole; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Moderator_UserRole" ON public."Moderator" USING btree (id_user);


--
-- Name: IXFK_NestedComment_Comment; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_NestedComment_Comment" ON public."NestedComment" USING btree (parent_id_comment);


--
-- Name: IXFK_NestedComment_Comment_02; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_NestedComment_Comment_02" ON public."NestedComment" USING btree (child_id_comment);


--
-- Name: IXFK_Personal_EducationalProgram; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Personal_EducationalProgram" ON public."Personal" USING btree (id_career);


--
-- Name: IXFK_Personal_UserRole; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Personal_UserRole" ON public."Personal" USING btree (id_user);


--
-- Name: IXFK_PostFile_Post; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_PostFile_Post" ON public."PostFile" USING btree (id_post);


--
-- Name: IXFK_PostLike_Post; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_PostLike_Post" ON public."PostLike" USING btree (id_post);


--
-- Name: IXFK_PostLike_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_PostLike_User" ON public."PostLike" USING btree (id_user);


--
-- Name: IXFK_Publication_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Publication_User" ON public."Post" USING btree (id_user);


--
-- Name: IXFK_Session_Account; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_Session_Account" ON public."Session" USING btree (id_user);


--
-- Name: IXFK_URLRecover_Account; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_URLRecover_Account" ON public."URLRecover" USING btree (id_user);


--
-- Name: IXFK_UserConfiguration_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_UserConfiguration_User" ON public."UserConfiguration" USING btree (id_user);


--
-- Name: IXFK_UserRole_User; Type: INDEX; Schema: public; Owner: dev
--

CREATE INDEX "IXFK_UserRole_User" ON public."UserRole" USING btree (id_user);


--
-- Name: AccountVerification FK_AccountVerification_Account; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."AccountVerification"
    ADD CONSTRAINT "FK_AccountVerification_Account" FOREIGN KEY (id_user) REFERENCES public."Account"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Account FK_Account_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "FK_Account_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Administrator FK_Administrator_UserRole; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Administrator"
    ADD CONSTRAINT "FK_Administrator_UserRole" FOREIGN KEY (id_user) REFERENCES public."UserRole"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Block FK_Block_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Block"
    ADD CONSTRAINT "FK_Block_User" FOREIGN KEY (id_user_blocker) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Block FK_Blocked_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Block"
    ADD CONSTRAINT "FK_Blocked_User" FOREIGN KEY (id_user_blocked) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Business FK_Business_UserRole; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Business"
    ADD CONSTRAINT "FK_Business_UserRole" FOREIGN KEY (id_user) REFERENCES public."UserRole"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CommentLike FK_CommentLike_Comment; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."CommentLike"
    ADD CONSTRAINT "FK_CommentLike_Comment" FOREIGN KEY (id_comment) REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment FK_Comment_Post; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "FK_Comment_Post" FOREIGN KEY (id_post) REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment FK_Comment_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "FK_Comment_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EducationalProgram FK_EducationalProgram_Faculty; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."EducationalProgram"
    ADD CONSTRAINT "FK_EducationalProgram_Faculty" FOREIGN KEY (id_faculty) REFERENCES public."Faculty"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follower FK_Followed_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Follower"
    ADD CONSTRAINT "FK_Followed_User" FOREIGN KEY (id_user_followed) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follower FK_Follower_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Follower"
    ADD CONSTRAINT "FK_Follower_User" FOREIGN KEY (id_user_follower) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Moderator FK_Moderator_UserRole; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Moderator"
    ADD CONSTRAINT "FK_Moderator_UserRole" FOREIGN KEY (id_user) REFERENCES public."UserRole"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NestedComment FK_NestedComment_Comment; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."NestedComment"
    ADD CONSTRAINT "FK_NestedComment_Comment" FOREIGN KEY (parent_id_comment) REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NestedComment FK_NestedComment_Comment_02; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."NestedComment"
    ADD CONSTRAINT "FK_NestedComment_Comment_02" FOREIGN KEY (child_id_comment) REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Personal FK_Personal_EducationalProgram; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Personal"
    ADD CONSTRAINT "FK_Personal_EducationalProgram" FOREIGN KEY (id_career) REFERENCES public."EducationalProgram"(id) ON UPDATE SET NULL ON DELETE SET NULL;


--
-- Name: Personal FK_Personal_UserRole; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Personal"
    ADD CONSTRAINT "FK_Personal_UserRole" FOREIGN KEY (id_user) REFERENCES public."UserRole"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostFile FK_PostFile_Post; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."PostFile"
    ADD CONSTRAINT "FK_PostFile_Post" FOREIGN KEY (id_post) REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostLike FK_PostLike_Post; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."PostLike"
    ADD CONSTRAINT "FK_PostLike_Post" FOREIGN KEY (id_post) REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostLike FK_PostLike_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."PostLike"
    ADD CONSTRAINT "FK_PostLike_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Post FK_Publication_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "FK_Publication_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session FK_Session_Account; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "FK_Session_Account" FOREIGN KEY (id_user) REFERENCES public."Account"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: URLRecover FK_URLRecover_Account; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."URLRecover"
    ADD CONSTRAINT "FK_URLRecover_Account" FOREIGN KEY (id_user) REFERENCES public."Account"(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserConfiguration FK_UserConfiguration_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."UserConfiguration"
    ADD CONSTRAINT "FK_UserConfiguration_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserRole FK_UserRole_User; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "FK_UserRole_User" FOREIGN KEY (id_user) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

