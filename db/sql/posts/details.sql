/*
   url: /post/{id}/details
   Получение информации о посте
*/

select
    ${conditionalAuthor:raw}
    ${conditionalForum:raw}
    json_build_object(
        'author', u.nickname,
        'forum', f.slug,
        'id', p.id,
        'isEdited', p.isedited,
        'message', p.message,
        'parent', p.parent_id,
        'thread', p.thread_id
    ) as post,
    p.created as postCreated
    ${conditionalThread:raw}
from
    post p
inner join
    "user" u
        on u.id=p.author_id
inner join
    forum f
        on f.id=p.forum_id
${conditionalJoinThread:raw}
where
    p.id=${id};
