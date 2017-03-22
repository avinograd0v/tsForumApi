with tuple as (
      select u.id as uid, u.nickname from "user" u
      where lower(u.nickname) = lower($(author))
      )

      insert into post as ci (author_id, created, forum_id, isedited, message,
      parent_id, thread_id) select uid, case when ${created} is not null
            then ${created}
            else now()
            end as created, $(forumid),
      ${isEdited}, $(message), $(parent:raw),
       $(threadid) from tuple
      returning (select nickname from tuple) as author, ci.created,
      $(forumslug) as forum, ci.id, ci.isedited as "isEdited",
     ci.message, ci.parent_id as parent, ci.thread_id as thread;