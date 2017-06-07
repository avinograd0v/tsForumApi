/*
   url: /thread/{identifier}/vote
   Обновление ветки
*/
with prev_vote as (select coalesce((select vote from vote
 where thread_id = (select t.id from thread t where ${identifier:raw})
  and user_id = (select id from "user" where nickname = ${nickname}::citext)), 0) as ex_vote),

inserted_result as (insert
    into
    vote
    (thread_id, user_id, vote) select
        (select t.id from thread t where ${identifier:raw}),
        (select id from "user" where nickname = ${nickname}::citext),
        ${voice}
        where
          'inserted' = set_config('upsert.action', 'inserted', true)
            on conflict(thread_id, user_id) do update
        set
            vote=${voice}
        where
          'updated' = set_config('upsert.action', 'updated', true)
            returning thread_id, user_id, vote)

select
    current_setting('upsert.action') AS "action",
    thread_id,
    ex_vote,
    user_id,
    vote
from inserted_result, prev_vote;
