SELECT * FROM people WHERE enabled = 1
@{and, name = #{name}}
@{ifand, minAge != null and minAge >= 0, age >= #{minAge}}
