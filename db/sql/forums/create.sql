/*
   url: /forum/create
   Создание нового форума
*/

--with upsert as (select
--    ${slug} as slug,
--    ${title} as title,
--    u.id as user_id,
--    u.nickname as nickname
--from
--    "user" u
--where
--    lower(u.nickname) = lower(${name})),
--inserted as (insert
--into
--    forum
--    (slug, title, user_id) select
--        slug,
--        title,
--        user_id
--    from
--        upsert
--    where
--        user_id is not null
--            on conflict do nothing returning *) select
--        'inserted' AS action,
--        inserted.slug,
--        inserted.title,
--        up.nickname
--    FROM
--        inserted cross
--    join
--        upsert up
--    union
--    all select
--        'updated' AS action,
--        f.slug,
--        f.title,
--        up1.nickname
--    from
--        upsert up1
--    inner join
--        forum f
--            on f.user_id = up1.user_id;

with inserted_result as (insert
into
    forum
    (slug, title, user_id) select
        ${slug},
        ${title},
        ${userID}
    where
        'inserted' = set_config('upsert.action', 'inserted', true)
            on conflict(user_id) do update
        set
            user_id=EXCLUDED.user_id
        where
            'updated' = set_config('upsert.action', 'updated', true)
             returning *)
        select
            current_setting('upsert.action') AS "action",
            f.slug,
            f.title,
            u.nickname as "user"
        from
            inserted_result f
            inner join "user" u on u.id=f.user_id;
