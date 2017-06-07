/*
   url: /forum/{slug}/create
   Создание новой ветки форума
*/

with inserted_result as (insert
into
    thread as ci
    (author_id, author_nickname, created, forum_id, forum_slug, message, slug, title) select
        ${authorId},
        ${authorNickname},
        case when ${created} is not null
                    then ${created}
                    else now() end as created,
        ${forumId},
        ${forumSlug},
        ${message},
        ${slug},
        ${title}
    where
        'inserted' = set_config('upsert.action', 'inserted', true)
            on conflict(slug) do update
        set
            id=ci.id
        where
            'updated' = set_config('upsert.action', 'updated', true)
             returning *)
        select
            current_setting('upsert.action') AS "action",
            t.author_id,
            t.slug,
            t.title,
            t.author_nickname,
            t.id,
            t.message,
            t.forum_slug,
            t.created,
            t.forum_id
        from
            inserted_result t;

