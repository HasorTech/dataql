SELECT * FROM people WHERE 1 = 1
@{case, ,
    @{when, name != null, AND name = #{name}}
    @{when, minAge != null, AND age >= #{minAge}}
    @{else, AND enabled = 1}
}
