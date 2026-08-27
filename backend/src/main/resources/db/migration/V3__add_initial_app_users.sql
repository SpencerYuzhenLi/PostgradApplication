INSERT INTO app_users (
    email,
    role
)
VALUES (
    'spenceryuzhenli@qq.com',
    'MANAGER'
);

INSERT INTO app_users (
    email,
    role,
    referee_id
)
VALUES
    (
        'robin.thompson@maths.ox.ac.uk',
        'REFEREE',
        1
    ),
    (
        'iryna.schlackow@admin.ox.ac.uk',
        'REFEREE',
        2
    );
