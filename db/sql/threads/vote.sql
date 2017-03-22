/*
   url: /thread/{identifier}/vote
   Обновление ветки
*/

insert
    into
    vote
    (thread_id, user_id, vote) values(
        (select t.id from thread t where ${identifier:raw}),
        (select id from "user" where lower(nickname) = lower(${nickname})),
        ${voice})
            on conflict(thread_id, user_id) do update
        set
            vote=${voice}
            returning *
