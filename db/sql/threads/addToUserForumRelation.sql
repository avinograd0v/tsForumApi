insert into forum_user_relation (user_id, forum_id)
 values (${user_id}, ${forum_id}) on conflict do nothing;
