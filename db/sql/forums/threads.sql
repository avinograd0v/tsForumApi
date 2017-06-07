/*
   url: /forum/{slug}/threads
   Получение всех веток на данном форуме
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
    t.forum_id=${fID}     ${conditionalSince:raw}
order by
    t.created ${orderCondition:raw}
    ${conditionalLimit:raw};
