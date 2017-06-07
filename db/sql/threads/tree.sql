SELECT p.author_nickname as author, p.created, p.forum_slug as forum, p.id, p.isedited as "isEdited", p.message, p.parent_id
as parent, p.thread_id
as thread FROM post p
where p.thread_id = ${identifier}
ORDER BY p.parent_path ${orderCondition:raw}
${conditionalLimit:raw}
OFFSET ${marker};