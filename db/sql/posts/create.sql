insert into post
            (
                        id,
                        author_id,
                        author_nickname,
                        created,
                        forum_id,
                        forum_slug,
                        message,
                        parent_id,
                        parent_path,
                        thread_id,
                        thread_slug
            )
            (
                       select     nextval('post_id_seq'),
                                  u.id,
                                  u.nickname,
                                  Now(),
                                  ${forumid},
                                  ${forumslug}::citext,
                                  t.message,
                                  case
                                             when t.parent_id = 0 then 0
                                             else p.id
                                  end,
                                  array_append(coalesce(p.parent_path, array[]::int[]), currval('post_id_seq')::int),
                                  $(threadid),
                                  ${threadslug}::citext
                       from       unnest ( $(parents), $(authors)::citext[], $(messages)) with ordinality
                        t(parent_id, author_name, message)
                       inner join "user" u
                       on         u.nickname = t.author_name
                       left join  post p
                       on         t.parent_id = p.id
                       and        p.thread_id = $(threadid)
                       order by ordinality)
returning   author_nickname as author,
            created,
            forum_slug as forum,
            id,
            isedited as "isEdited",
            message,
            parent_id as parent,
            thread_id as thread;
