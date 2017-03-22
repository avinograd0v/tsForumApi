/*
   url: /post/{id}/details
   Обновление текста поста
*/

with updated_result as (update
    post
set
    message = coalesce(${message}, message),
    isedited = case
        when ${message} <> message and ${message} is not null then true
        else isedited
    end
where
    id=${id} returning *) select
        u.nickname as author,
        p.created,
        f.slug as forum,
        p.id,
        p.isedited as "isEdited",
        p.message,
        p.parent_id as parent,
        p.thread_id as thread
    from
        updated_result p
    inner join
        "user" u
            on u.id=p.author_id
    inner join
        forum f
            on f.id=p.forum_id;

