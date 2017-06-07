/*
   url: /forum/{slug}/details
   Получение информации о форуме
*/

select
    f.posts_count as posts   ,
    f.slug,
    f.threads_count as threads,
    f.title,
    f.user_nickname as user
from
    forum f
where
    f.slug=${slug}::citext;
