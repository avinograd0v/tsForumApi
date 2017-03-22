/*
   url: /thread/{identifier}/details
   Обновление ветки
*/

with updated_result as (update
    thread
set
    message = case
        when ${message} is not null then ${message}
        else message
    end,
    title = case
        when ${title} is not null then ${title}
        else title
    end
where
    ${identifier:raw} returning *) select
        u.nickname as author,
        t.created,
        f.slug as forum,
        t.id,
        t.message,
        t.slug,
        t.title,
        t.votes
    from
        updated_result t
    inner join
        "user" u
            on u.id=t.author_id
    inner join
        forum f
            on f.id=t.forum_id;
