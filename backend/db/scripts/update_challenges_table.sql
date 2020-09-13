ALTER TABLE challenges
    ADD COLUMN initial_challenge INT REFERENCES challenges(id),
    ADD COLUMN hidden BOOLEAN DEFAULT false,
    ADD COLUMN repeat VARCHAR(15) DEFAULT 'never',
    ADD COLUMN auto_apply_after DATE DEFAULT '2020-01-01',
    ADD COLUMN challenge_params JSON;

