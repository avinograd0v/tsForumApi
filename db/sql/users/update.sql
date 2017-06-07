/*
   url: /user/{nickname}/profile
   Изменение профиля пользователя
*/

update
    "user"
set
    about = case
        when ${about} is not null then ${about}
        else about
    end,
    email = case
        when ${email} is not null then ${email}
        else email
    end,
    fullname = case
        when ${fullname} is not null then ${fullname}
        else fullname
    end
where
    nickname = ${nickname}::citext
        returning about, email, fullname, nickname;
