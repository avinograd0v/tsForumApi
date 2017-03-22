/*
   url: /forum/{slug}/threads
   Получение всех веток на данном форуме
*/

select
    a.nickname as author,
    t.created,
    ${slug} as forum,
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
    "user" a
        on t.author_id=a.id
where
    t.forum_id=${fID}     ${conditionalSince:raw}
order by
    t.created ${orderCondition:raw} ${conditionalLimit:raw};
