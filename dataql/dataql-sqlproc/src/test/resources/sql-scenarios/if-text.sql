SELECT * FROM people WHERE 1 = 1
@{if, name != null, AND name = #{name}}
@{iftext, newest, ORDER BY id DESC}
