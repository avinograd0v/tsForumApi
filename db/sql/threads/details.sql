/*
   url: /thread/{identifier}/details
   Получение информации о ветке
*/

select
    u.nickname as author,
    t.created,
    f.slug as forum,
    t.id,
    t.message,
    t.slug,
    t.title,
    COALESCE((select
        sum(vote)
    from
        vote
    where
        thread_id=t.id),
    0)::integer as votes
from
    thread t
inner join
    "user" u
        on u.id=t.author_id
inner join
    forum f
        on f.id=t.forum_id
where
    ${identifier:raw};

