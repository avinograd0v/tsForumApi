/*
   url: /user/{nickname}/profile
   Получение профиля пользователя
*/

select
    about,
    email,
    fullname,
    nickname
from
    "user"
where
    lower(nickname)=lower(${nickname});
