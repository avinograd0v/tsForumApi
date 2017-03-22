/*
   url: /user/{nickname}/create
   Создание нового пользователя
*/

with tuple as (
    select
        ${about}::text as about,
        ${email}::text as email,
        ${fullname}::text as fullname,
        ${nickname}::text as nickname
    ),
    ins as (
        insert into "user" (about, email, fullname, nickname)
        select about, email, fullname, nickname from tuple
        on conflict do nothing
        returning id, about, email, fullname, nickname
    )
select 'inserted' AS action, about, email, fullname, nickname FROM ins
union all
select 'updated' AS action, u.about, u.email, u.fullname, u.nickname
from   tuple t
inner join "user" u on lower(u.email) = lower(t.email) or lower(u.nickname) = lower(t.nickname);

--with inserted_result as (insert
--into
--    "user" as ci
--    (about, email, fullname, nickname) select
--        ${about},
--        ${email},
--        ${fullname},
--        ${nickname}
--    where
--        'inserted' = set_config('upsert.action', 'inserted', true)
--            on conflict(lower(email)) do update
--        set
--            id=ci.id
--        where
--            'updated' = set_config('upsert.action', 'updated', true)
--             returning *)
--        select
--            current_setting('upsert.action') AS "action",
--            u.about,
--            u.email,
--            u.fullname,
--            u.nickname
--        from
--            inserted_result u;
