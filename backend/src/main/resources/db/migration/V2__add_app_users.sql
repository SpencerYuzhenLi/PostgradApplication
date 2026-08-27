CREATE TABLE app_users
(
    id integer GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

    auth_user_id uuid
        UNIQUE,

    email text NOT NULL
        UNIQUE,

    role text NOT NULL,

    referee_id integer
        UNIQUE,

    CONSTRAINT app_user_email_not_blank
        CHECK (btrim(email) <> ''),

    CONSTRAINT app_user_role_valid
        CHECK (
            role IN (
                'MANAGER',
                'REFEREE'
            )
        ),

    CONSTRAINT app_user_referee_fk
        FOREIGN KEY (referee_id)
        REFERENCES referees(id)
        ON DELETE RESTRICT,

    CONSTRAINT app_user_role_referee_consistent
        CHECK (
            (
                role = 'MANAGER'
                AND referee_id IS NULL
            )
            OR
            (
                role = 'REFEREE'
                AND referee_id IS NOT NULL
            )
        )
);