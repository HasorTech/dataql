UPDATE people
@{set, name = #{name}}
@{ifset, changeAge, age = #{age}}
WHERE id = #{id}
