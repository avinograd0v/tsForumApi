create extension if not exists "citext";
CREATE extension if not exists "intarray";
SET SYNCHRONOUS_COMMIT = 'off';

DROP TABLE IF EXISTS "forum_user_relation";
DROP TABLE IF EXISTS "vote";
DROP TABLE IF EXISTS "post";
DROP TABLE IF EXISTS "thread";
DROP TABLE IF EXISTS "forum";
DROP TABLE IF EXISTS "user";

CREATE TABLE "user"
(
    ID SERIAL PRIMARY KEY NOT NULL,
    about TEXT,
    email CITEXT COLLATE "ucs_basic",
    fullname TEXT,
    nickname CITEXT COLLATE "ucs_basic" NOT NULL
);
CREATE UNIQUE INDEX user_email_uindex ON public."user" (email);
CREATE UNIQUE INDEX user_nickname_uindex ON public."user" (nickname);

CREATE TABLE forum
(
    ID SERIAL PRIMARY KEY NOT NULL,
    slug CITEXT COLLATE "ucs_basic" NOT NULL,
    title TEXT,
    user_ID INT NOT NULL,
    user_nickname CITEXT COLLATE "ucs_basic" NOT NULL,
    posts_count INT NOT NULL DEFAULT 0,
    threads_count INT NOT NULL DEFAULT 0,
    CONSTRAINT forum_user_id_fk FOREIGN KEY (user_ID) REFERENCES "user" (id)
);
CREATE UNIQUE INDEX "forum_slug" ON public.forum (slug);

CREATE TABLE thread
(
    ID SERIAL PRIMARY KEY NOT NULL,
    author_ID INT NOT NULL,
    author_nickname CITEXT COLLATE "ucs_basic" NOT NULL,
    created TIMESTAMP WITH TIME ZONE DEFAULT now(),
    forum_ID INT NOT NULL,
    forum_slug CITEXT COLLATE "ucs_basic" NOT NULL,
    message TEXT,
    slug CITEXT COLLATE "ucs_basic",
    title TEXT,
    votes INT DEFAULT 0,
    CONSTRAINT thread_user_id_fk FOREIGN KEY (author_ID) REFERENCES "user" (id),
    CONSTRAINT thread_forum_id_fk FOREIGN KEY (forum_ID) REFERENCES forum (id)
);
CREATE UNIQUE INDEX "thread_slug_uindex" ON public.thread (slug);

CREATE TABLE post
(
    ID SERIAL PRIMARY KEY NOT NULL,
    author_ID INT NOT NULL,
    author_nickname CITEXT COLLATE "ucs_basic" NOT NULL,
    created TIMESTAMP WITH TIME ZONE DEFAULT now(),
    forum_ID INT NOT NULL,
    forum_slug CITEXT COLLATE "ucs_basic" NOT NULL,
    isEdited BOOLEAN DEFAULT FALSE ,
    message TEXT,
    parent_ID INT DEFAULT 0,
    parent_path INT[],
    thread_ID INT NOT NULL,
    thread_slug CITEXT COLLATE "ucs_basic",
    CONSTRAINT post_user_id_fk FOREIGN KEY (author_ID) REFERENCES "user" (id),
    CONSTRAINT post_forum_id_fk FOREIGN KEY (forum_ID) REFERENCES forum (id),
    CONSTRAINT post_thread_id_fk FOREIGN KEY (thread_ID) REFERENCES thread (id)
);

--CREATE INDEX "post_thread_parent_index" on public.post(thread_ID, parent_ID);
CREATE INDEX "idx_for_parent_tree" on public.post(thread_ID, parent_ID, id);
create index "idx_for_flat_sort" on public.post(thread_ID, created, id);
CREATE INDEX "post_parent_path_index" ON public.post USING GIN (parent_path public.gin__int_ops);

CREATE TABLE vote
(
    id SERIAL PRIMARY KEY NOT NULL,
    thread_id INT NOT NULL,
    user_id INT NOT NULL,
    vote INT NOT NULL,
    CONSTRAINT vote_thread_id_fk FOREIGN KEY (thread_id) REFERENCES thread (id),
    CONSTRAINT vote_user_id_fk FOREIGN KEY (user_id) REFERENCES "user" (id)
);
CREATE UNIQUE INDEX vote_user_id_thread_id_uindex ON public.vote (user_id, thread_id);


CREATE TABLE forum_user_relation
(
    ID SERIAL PRIMARY KEY NOT NULL,
    user_ID INT NOT NULL,
    forum_ID INT NOT NULL,
    CONSTRAINT forum_user_relation_user_fk FOREIGN KEY (user_ID) REFERENCES "user" (ID),
    CONSTRAINT forum_user_relation_forum_fk FOREIGN KEY (forum_ID) REFERENCES forum (ID)
);
CREATE UNIQUE INDEX "forum_user_relation_index" ON public.forum_user_relation (forum_ID, user_ID);
