insert into forum_user_relation(user_id, forum_id)
    select
        u.id,
        ${forumID}
    from
        unnest(${authors}::citext[]) t(author_name)
    join "user" u on t.author_name = u.nickname
on conflict do nothing
