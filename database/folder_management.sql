PGDMP                      |            folder_management    16.1    16.0     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16397    folder_management    DATABASE     �   CREATE DATABASE folder_management WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
 !   DROP DATABASE folder_management;
                postgres    false            �            1259    16399    tbl_file    TABLE     �   CREATE TABLE public.tbl_file (
    rowid integer NOT NULL,
    path character varying(200),
    nama_file character varying(200),
    ukuran character varying(30),
    ctddate date
);
    DROP TABLE public.tbl_file;
       public         heap    postgres    false            �            1259    16398    tbl_file_rowid_seq    SEQUENCE     �   CREATE SEQUENCE public.tbl_file_rowid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.tbl_file_rowid_seq;
       public          postgres    false    216            �           0    0    tbl_file_rowid_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.tbl_file_rowid_seq OWNED BY public.tbl_file.rowid;
          public          postgres    false    215                       2604    16402    tbl_file rowid    DEFAULT     p   ALTER TABLE ONLY public.tbl_file ALTER COLUMN rowid SET DEFAULT nextval('public.tbl_file_rowid_seq'::regclass);
 =   ALTER TABLE public.tbl_file ALTER COLUMN rowid DROP DEFAULT;
       public          postgres    false    215    216    216            �          0    16399    tbl_file 
   TABLE DATA           K   COPY public.tbl_file (rowid, path, nama_file, ukuran, ctddate) FROM stdin;
    public          postgres    false    216          �           0    0    tbl_file_rowid_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.tbl_file_rowid_seq', 7, true);
          public          postgres    false    215                       2606    16404    tbl_file tbl_file_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.tbl_file
    ADD CONSTRAINT tbl_file_pkey PRIMARY KEY (rowid);
 @   ALTER TABLE ONLY public.tbl_file DROP CONSTRAINT tbl_file_pkey;
       public            postgres    false    216            �   n   x�3���/-��OL)�O��II-R0��,�ϩ�K-�LT0602407R04�0��*H�46��3�T�v�4202�50�50�2�jJbJiN��������I<�#s=S4b���� �4$     