

select
p.author_nickname as author,
 p.created,
  p.forum_slug as forum,
   p.id,
    p.isedited as "isEdited",
    p.message,
     p.parent_id as parent,
      p.thread_id as thread
       from post p
where p.thread_id = ${identifier}
order by p.created ${orderCondition:raw}, p.id ${orderCondition:raw}
${conditionalLimit:raw}
offset ${marker};

