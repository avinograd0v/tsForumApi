WITH RECURSIVE tree
AS
(
    SELECT
        u.nickname as author, p.created, f.slug as forum, p.id, p.isedited,
        p.message, p.parent_id as parent, p.thread_id as thread, array[p.id] AS path
         from (SELECT pt.author_id, pt.forum_id, pt.created, pt.id, pt.isedited, pt.message,
          pt.parent_id, pt.thread_id from post pt inner join thread t on t.id=pt.thread_id
           where pt.parent_id = 0 and ${identifier:raw}
               order by pt.id ${orderCondition:raw} ${conditionalLimit:raw} OFFSET ${marker}) p
        inner join "user" u on u.id=p.author_id
        inner join forum f on f.id=p.forum_id
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

SELECT author, created, forum, isedited as "isEdited", id, message, parent, thread, path
 FROM tree ORDER BY path ${orderCondition:raw};
