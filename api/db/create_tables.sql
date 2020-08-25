CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY,
    completed BOOLEAN DEFAULT false NOT NULL,
    strava_connected BOOLEAN DEFAULT false NOT NULL,
    created TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc') NOT NULL,
    name VARCHAR(120),
    email VARCHAR(120),
    age_requirement_met BOOLEAN,
    user_consent BOOLEAN,
    token_type VARCHAR(15),
    access_token VARCHAR(50),
    expires_at TIMESTAMPTZ,
    refresh_token VARCHAR(50),
    updated TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
    last_login TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contests(
    group_id INT,
    contest_id SERIAL,
    name VARCHAR(120) NOT NULL,
    group_name VARCHAR(120) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true NOT NULL ,
    start_date DATE,
    end_date DATE,
    type VARCHAR(30),
    privacy_policy VARCHAR(30),
    owner INT NOT NULL,
    created TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc') NOT NULL,
    updated TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
    PRIMARY KEY (group_id, contest_id),
    FOREIGN KEY (owner) REFERENCES users(id)
        ON UPDATE cascade
        ON DELETE set null
);

CREATE TABLE IF NOT EXISTS user_contests(
    id SERIAL PRIMARY KEY,
    "user" INT NOT NULL,
    "group" INT NOT NULL,
    contest INT NOT NULL,
    active BOOLEAN NOT NULL,
    role VARCHAR(15) DEFAULT 'member',
    points INT DEFAULT 0,
    joined TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user") REFERENCES users(id)
        ON UPDATE cascade
        ON DELETE cascade,
    FOREIGN KEY ("group", contest) REFERENCES contests(group_id, contest_id)
        ON UPDATE cascade
        ON DELETE cascade,
    UNIQUE (contest, "group", "user")
);
CREATE INDEX IF NOT EXISTS user_contests_user_index ON user_contests("user");
CREATE INDEX IF NOT EXISTS user_contests_contest_index ON user_contests(contest, "group");

CREATE TABLE IF NOT EXISTS activities(
    id BIGINT PRIMARY KEY,
    complete BOOLEAN DEFAULT false,
    require_update BOOLEAN DEFAULT true,
    "user" INT,
    name TEXT,
    description TEXT,
    distance DOUBLE PRECISION,
    distance_mi DECIMAL(4, 2),
    distance_km DECIMAL(5, 3),
    moving_time INT,
    elapsed_time INT,
    total_elevation_gain DECIMAL(5, 2),
    elev_high DECIMAL(4, 2),
    elev_low DECIMAL(4, 2),
    type VARCHAR(30),
    start_date TIMESTAMP,
    start_date_local TIMESTAMP,
    timezone VARCHAR(200),
    start_latlng JSON,
    end_latlng JSON,
    achievement_count INT,
    photo_count INT,
    total_photo_count INT,
    map JSONB,
    manual BOOLEAN,
    workout_type INT,
    average_speed DOUBLE PRECISION,
    max_speed DOUBLE PRECISION,
    average_pace_standard DECIMAL(4, 4),
    max_pace_standard DECIMAL(4, 4),
    average_pace_metric DECIMAL(4, 4),
    max_pace_metric DECIMAL(4, 4),
    photos JSONB,
    segment_count INT,
    other JSONB,
    created TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
    updated TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
    FOREIGN KEY ("user") REFERENCES users(id)
        ON UPDATE cascade
        ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS activities_start_date_local_index ON activities(start_date_local);
CREATE INDEX IF NOT EXISTS activities_user_index ON activities("user");

CREATE TABLE IF NOT EXISTS contest_activities(
    id BIGSERIAL PRIMARY KEY,
    "user" INT NOT NULL,
    "group" INT NOT NULL,
    contest INT NOT NULL,
    activity BIGINT NOT NULL,
    FOREIGN KEY ("user") REFERENCES users(id)
        ON UPDATE cascade
        ON DELETE cascade,
    FOREIGN KEY ("group", contest) REFERENCES contests("group_id", contest_id)
        ON UPDATE cascade
        ON DELETE cascade,
    FOREIGN KEY (activity) REFERENCES activities(id)
        ON UPDATE cascade
        ON DELETE cascade,
    UNIQUE (activity, contest, "group")
);
CREATE INDEX IF NOT EXISTS contest_activities_contest_user_index ON contest_activities(contest, "group", "user");
CREATE INDEX IF NOT EXISTS contest_activities_activity ON contest_activities(activity);

CREATE TABLE IF NOT EXISTS challenges(
    id SERIAL PRIMARY KEY,
    "group" INT NOT NULL,
    contest INT NOT NULL,
    active BOOLEAN NOT NULL,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    awards JSONB,
    default_award INT
);
CREATE INDEX IF NOT EXISTS challenges_contest_index ON challenges(contest, "group");

CREATE TABLE IF NOT EXISTS user_challenges(
    id BIGSERIAL PRIMARY KEY,
    "user" INT NOT NULL,
    "group" INT NOT NULL,
    contest INT NOT NULL,
    activity BIGINT,
    challenge INT NOT NULL,
    award INT,
    points INT,
    FOREIGN KEY ("user") REFERENCES users(id)
      ON UPDATE cascade
      ON DELETE cascade,
    FOREIGN KEY ("group", contest) REFERENCES contests("group_id", contest_id)
      ON UPDATE cascade
      ON DELETE cascade,
    FOREIGN KEY (activity) REFERENCES activities(id)
      ON UPDATE cascade
      ON DELETE cascade,
    FOREIGN KEY (challenge) REFERENCES challenges(id)
      ON UPDATE cascade
      ON DELETE cascade,
    UNIQUE ("user", challenge)
);
CREATE INDEX IF NOT EXISTS user_challenges_contest_user_index ON user_challenges(contest, "group", "user");
CREATE INDEX IF NOT EXISTS user_challenges_active_contest_index ON user_challenges(activity, contest, "group");
