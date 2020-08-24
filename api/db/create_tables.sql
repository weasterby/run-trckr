CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY,
    completed BOOLEAN DEFAULT false NOT NULL,
    strava_connected BOOLEAN DEFAULT false NOT NULL,
    created TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc') NOT NULL,
    name VARCHAR(120),
    email VARCHAR(120),
    dob DATE,
    token_type VARCHAR(15),
    access_token VARCHAR(50),
    expires_at TIMESTAMPTZ,
    refresh_token VARCHAR(50),
    updated TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

CREATE TABLE IF NOT EXISTS contests(
    group_id INT,
    contest_id SERIAL,
    name VARCHAR(120) NOT NULL,
    group_name VARCHAR(120) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true NOT NULL ,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
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
        ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS activities(
    id BIGINT PRIMARY KEY,
    "user" INT NOT NULL,
    name TEXT NOT NULL ,
    description TEXT,
    distance DOUBLE PRECISION NOT NULL,
    distance_mi DECIMAL(4, 2) NOT NULL,
    distance_km DECIMAL(5, 3) NOT NULL,
    moving_time INT NOT NULL,
    elapsed_time INT,
    total_elevation_gain DECIMAL(5, 2),
    elev_high DECIMAL(4, 2),
    elev_low DECIMAL(4, 2),
    type VARCHAR(30) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    start_date_local TIMESTAMP NOT NULL,
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
    photos JSONB,
    segment_efforts JSONB,
    split_metric JSONB,
    splits_standard JSONB,
    split_metric_trend DOUBLE PRECISION,
    split_standard_trend DOUBLE PRECISION,
    laps JSONB,
    other JSONB,
    updated TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
    FOREIGN KEY ("user") REFERENCES users(id)
        ON UPDATE cascade
        ON DELETE cascade
);

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
        ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS challenges(
    id SERIAL PRIMARY KEY,
    "group" INT NOT NULL,
    contest INT NOT NULL,
    active BOOLEAN NOT NULL,
    name VARCHAR(120) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    awards JSONB,
    default_award INT
);

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
      ON DELETE cascade
);