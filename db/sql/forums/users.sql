/*
   url: /forum/{slug}/users
   Получение всех пользователей с комментарием или веткой на данном форуме
*/

select
    distinct     u.about,
    u.email,
    u.fullname,
    u.nickname,
    convert_to(lower(u.nickname),
    'UTF8') as nick
from
    "user" u
left join
    thread t
        on t.author_id = u.id
left join
    post p
        on p.author_id = u.id
inner join
    forum f
        on f.id = t.forum_id
        or f.id = p.forum_id
where
    f.id = ${fID}
    and (
        p.id is not null
        or t.id is not null
    )     ${conditionalSince:raw}
order by
    nick ${orderCondition:raw} ${conditionalLimit:raw};
