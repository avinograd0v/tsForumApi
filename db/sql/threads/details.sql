/*
   url: /thread/{identifier}/details
   Получение информации о ветке
*/

select
    t.author_nickname as author,
    t.created,
    t.forum_slug as forum,
    t.id,
    t.message,
    t.slug,
    t.title,
    t.votes
from
    thread t
where
    ${identifier:raw};

