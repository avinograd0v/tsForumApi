/*
   url: /post/{id}/details
   Получение информации о посте
*/

select
    ${conditionalAuthor:raw}
    ${conditionalForum:raw}
    json_build_object(
        'author', p.author_nickname,
        'forum', p.forum_slug,
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
${conditionalJoinThread:raw}
${conditionalJoinForum:raw}
${conditionalJoinAuthor:raw}
where
    p.id=${id};
