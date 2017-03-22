/*
   url: /service/status
   Получение инфомарции о базе данных
*/

select
    (select
        count(id)::integer
    from
        forum) as forum,
    (select
        count(id)::integer
    from
        post) as post,
    (select
        count(id)::integer
    from
        thread) as thread,
    (select
        count(id)::integer
    from
        "user") as "user";
