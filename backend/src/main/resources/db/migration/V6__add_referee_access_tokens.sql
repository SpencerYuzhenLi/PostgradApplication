ALTER TABLE referees
ADD COLUMN access_token_hash varchar(64);

CREATE UNIQUE INDEX
    idx_referees_access_token_hash
ON referees (access_token_hash);