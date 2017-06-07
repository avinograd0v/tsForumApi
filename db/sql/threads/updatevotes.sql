/*
   Обновление счетчика голосов треда
*/

update thread
   set votes = votes + CASE when ${action} = 'updated'
                             THEN ${vote} * 2
                             else ${vote}
                             END
   where id = ${thread_id}
returning author_nickname as author,
          created,
          forum_slug as forum,
          id,
          message,
          slug,
          title,
          votes;
