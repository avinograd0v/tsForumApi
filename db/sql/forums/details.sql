/*
   url: /forum/{slug}/details
   Получение информации о форуме
*/

select
    (select
        count(id)::integer
    from
        post
    where
        forum_id=f.id) as posts   ,
    f.slug,
    (select
        count(id)::integer
    from
        thread
    where
        forum_id=f.id) as threads,
    f.title,
    u.nickname as user
from
    forum f
inner join
    "user" u
        on u.id=f.user_id
where
    lower(f.slug)=lower(${slug});
