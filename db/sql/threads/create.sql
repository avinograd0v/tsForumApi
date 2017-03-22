/*
   url: /forum/{slug}/create
   Создание новой ветки форума
*/

with inserted_result as (insert
into
    thread as ci
    (author_id, created, forum_id, message, slug, title) select
        ${authorId},
        case when ${created} is not null
            then ${created}
            else now()
            end as created,
        ${forumId},
        ${message},
        ${slug},
        ${title}
    where
        'inserted' = set_config('upsert.action', 'inserted', true)
            on conflict(lower(slug)) do update
        set
            id=ci.id
        where
            'updated' = set_config('upsert.action', 'updated', true)
             returning *)
        select
            current_setting('upsert.action') AS "action",
            t.slug,
            t.title,
            u.nickname as author,
            t.id,
            t.message,
            f.slug as forum,
            t.created
        from
            inserted_result t
        inner join forum f on f.id=t.forum_id
        inner join "user" u on u.id=t.author_id;

