 SELECT author_nickname as author, created, forum_slug as forum, id, isedited as "isEdited", message, parent_id
 as parent, thread_id
 as thread FROM post where parent_path && ${parent_posts}::int[]
 ORDER BY parent_path ${orderCondition:raw}
