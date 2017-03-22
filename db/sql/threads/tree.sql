WITH RECURSIVE tree
AS
(
    SELECT
        u.nickname as author, p.created, f.slug as forum, p.id, p.isedited,
        p.message, p.parent_id as parent, p.thread_id as thread, array[p.id] AS path
         from post p
        inner join thread t on t.id=p.thread_id
        inner join "user" u on u.id=p.author_id
        inner join forum f on f.id=p.forum_id where p.parent_id = 0 and ${identifier:raw}
    UNION
    SELECT
        u1.nickname as author, p1.created, f1.slug as forum, p1.id, p1.isedited,
        p1.message, p1.parent_id as parent, p1.thread_id as thread, tree.path || p1.id AS path
    FROM
        tree
        JOIN post p1 ON p1.parent_id = tree.id
        inner join "user" u1 on u1.id=p1.author_id
        inner join forum f1 on f1.id=p1.forum_id
)

SELECT author, created, forum, id, isedited as "isEdited", message, parent, thread, path
 FROM tree ORDER BY path ${orderCondition:raw}
${conditionalLimit:raw}
OFFSET ${marker};