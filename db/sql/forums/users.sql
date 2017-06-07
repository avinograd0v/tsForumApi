/*
   url: /forum/{slug}/users
   Получение всех пользователей с комментарием или веткой на данном форуме
*/

select
    u.about,
    u.email,
    u.fullname,
    u.nickname
from
    forum_user_relation
inner join
    "user" u
on
    u.id = user_id
where
    forum_id = ${fID}
${conditionalSince:raw}
order by
    u.nickname ${orderCondition:raw}
${conditionalLimit:raw};
