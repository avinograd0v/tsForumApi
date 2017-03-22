

select u.nickname as author, p.created, f.slug as forum, p.id, p.isedited as "isEdited",
 p.message, p.parent_id as parent, p.thread_id as thread from post p
inner join thread t on t.id=p.thread_id
inner join "user" u on u.id=p.author_id
inner join forum f on f.id=p.forum_id
where ${identifier:raw}
order by p.created ${orderCondition:raw}, p.id ${orderCondition:raw}
${conditionalLimit:raw}
offset ${marker};

