@{pairs, #{names},
    @{iftext, i > 0, UNION ALL}
    SELECT CAST(#{v} AS VARCHAR) AS name
}
