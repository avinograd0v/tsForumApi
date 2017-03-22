/*
   url: /service/clear
   Удаление всей пользовательской информации
*/

truncate "user" cascade;
--select * from "user";