INSERT INTO users(id, completed, name, email) VALUES (64124462, true, 'Will Easterby', 'will@example.com') ON CONFLICT (id) DO NOTHING;
INSERT INTO users(id, completed, name, email) VALUES (1, true, 'Foo', 'foo@example.com') ON CONFLICT (id) DO NOTHING;
INSERT INTO users(id, completed, name, email) VALUES (2, true, 'Bar', 'bar@example.com') ON CONFLICT (id) DO NOTHING;
INSERT INTO users(id, completed, name, email) VALUES (3, true, 'Foobar', 'foobar@example.com') ON CONFLICT (id) DO NOTHING;

INSERT INTO contests(contest_id, group_id, name, group_name, description, start_date, end_date, type, privacy_policy, owner) VALUES
(1, 1, 'Test Contest', 'Test Group', 'This is a test contest', '2020-08-01', '2020-08-31', 'Running', 'Restricted', 64124462) ON CONFLICT (group_id, "contest_id") DO NOTHING;

INSERT INTO user_contests("user", "group", contest, active, role) VALUES (64124462, 1, 1, true, 'Owner');
INSERT INTO user_contests("user", "group", contest, active) VALUES (1, 1, 1, true);
INSERT INTO user_contests("user", "group", contest, active) VALUES (2, 1, 1, true);
INSERT INTO user_contests("user", "group", contest, active) VALUES (3, 1, 1, true);

INSERT INTO activities(id, "user", name, description, distance, distance_mi, distance_km, moving_time, elapsed_time,total_elevation_gain, elev_high,
                       elev_low, type, start_date, start_date_local, timezone, workout_type, average_speed, max_speed, max_pace_standard, average_pace_standard)
VALUES (1, 64124462, 'Activity 1', '', 5000, 3.13, 5, 1200, 1500, 100, 100, 0, 'Running', '2020-08-24T08:00:00Z', '2020-08-24T08:00:00Z',
        'CST', 1, 4.1693, 4.1693, 6.4333, 6.4333) ON CONFLICT DO NOTHING;
INSERT INTO contest_activities("user", "group", contest, activity) VALUES (64124462, 1, 1, 1) ON CONFLICT DO NOTHING;

INSERT INTO activities(id, "user", name, description, distance, distance_mi, distance_km, moving_time, elapsed_time,total_elevation_gain, elev_high,
                       elev_low, type, start_date, start_date_local, timezone, workout_type, average_speed, max_speed, max_pace_standard, average_pace_standard)
VALUES (2, 64124462, 'Activity 2', '', 8000, 6, 8, 1950, 2000, 100, 100, 0, 'Running', '2020-08-25T08:00:00Z', '2020-08-25T08:00:00Z',
        'CST', 1, 4.1265, 4.1265, 6.5, 6.5) ON CONFLICT DO NOTHING;
INSERT INTO contest_activities("user", "group", contest, activity) VALUES (64124462, 1, 1, 2) ON CONFLICT DO NOTHING;

INSERT INTO activities(id, "user", name, description, distance, distance_mi, distance_km, moving_time, elapsed_time,total_elevation_gain, elev_high,
                       elev_low, type, start_date, start_date_local, timezone, workout_type, average_speed, max_speed, max_pace_standard, average_pace_standard)
VALUES (3, 64124462, 'Activity 3', '', 10000, 6.25, 10, 1200, 1500, 100, 100, 0, 'Running', '2020-08-26T08:00:00Z', '2020-08-26T08:00:00Z',
        'CST', 1, 4.1693, 4.1693, 6.4333, 6.4333) ON CONFLICT DO NOTHING;
INSERT INTO contest_activities("user", "group", contest, activity) VALUES (64124462, 1, 1, 3) ON CONFLICT DO NOTHING;

INSERT INTO activities(id, "user", name, description, distance, distance_mi, distance_km, moving_time, elapsed_time,total_elevation_gain, elev_high,
                       elev_low, type, start_date, start_date_local, timezone, workout_type, average_speed, max_speed, max_pace_standard, average_pace_standard)
VALUES (4, 1, 'Activity 4', '', 5000, 3.13, 5, 1200, 1500, 100, 100, 0, 'Running', '2020-08-24T08:00:00Z', '2020-08-24T08:00:00Z',
        'CST', 1, 4.1693, 4.1693, 6.4333, 6.4333) ON CONFLICT DO NOTHING;
INSERT INTO contest_activities("user", "group", contest, activity) VALUES (1, 1, 1, 4) ON CONFLICT DO NOTHING;

INSERT INTO activities(id, "user", name, description, distance, distance_mi, distance_km, moving_time, elapsed_time,total_elevation_gain, elev_high,
                       elev_low, type, start_date, start_date_local, timezone, workout_type, average_speed, max_speed, max_pace_standard, average_pace_standard)
VALUES (5, 1, 'Activity 5', '', 8000, 6, 8, 1950, 2000, 100, 100, 0, 'Running', '2020-08-25T08:00:00Z', '2020-08-25T08:00:00Z',
        'CST', 1, 4.1265, 4.1265, 6.5, 6.5) ON CONFLICT DO NOTHING;
INSERT INTO contest_activities("user", "group", contest, activity) VALUES (1, 1, 1, 5) ON CONFLICT DO NOTHING;

INSERT INTO activities(id, "user", name, description, distance, distance_mi, distance_km, moving_time, elapsed_time,total_elevation_gain, elev_high,
                       elev_low, type, start_date, start_date_local, timezone, workout_type, average_speed, max_speed, max_pace_standard, average_pace_standard)
VALUES (6, 1, 'Activity 6', '', 10000, 6.25, 10, 1200, 1500, 100, 100, 0, 'Running', '2020-08-26T08:00:00Z', '2020-08-26T08:00:00Z',
        'CST', 1, 4.1693, 4.1693, 6.4333, 6.4333) ON CONFLICT DO NOTHING;
INSERT INTO contest_activities("user", "group", contest, activity) VALUES (1, 1, 1, 6) ON CONFLICT DO NOTHING;

INSERT INTO activities(id, "user", name, description, distance, distance_mi, distance_km, moving_time, elapsed_time,total_elevation_gain, elev_high,
                       elev_low, type, start_date, start_date_local, timezone, workout_type, average_speed, max_speed, max_pace_standard, average_pace_standard)
VALUES (7, 2, 'Activity 7', '', 5000, 3.13, 5, 1200, 1500, 100, 100, 0, 'Running', '2020-08-24T08:00:00Z', '2020-08-24T08:00:00Z',
        'CST', 1, 4.1693, 4.1693, 6.4333, 6.4333) ON CONFLICT DO NOTHING;
INSERT INTO contest_activities("user", "group", contest, activity) VALUES (2, 1, 1, 7) ON CONFLICT DO NOTHING;

INSERT INTO activities(id, "user", name, description, distance, distance_mi, distance_km, moving_time, elapsed_time,total_elevation_gain, elev_high,
                       elev_low, type, start_date, start_date_local, timezone, workout_type, average_speed, max_speed, max_pace_standard, average_pace_standard)
VALUES (8, 2, 'Activity 8', '', 8000, 6, 8, 1950, 2000, 100, 100, 0, 'Running', '2020-08-25T08:00:00Z', '2020-08-25T08:00:00Z',
        'CST', 1, 4.1265, 4.1265, 6.5, 6.5) ON CONFLICT DO NOTHING;
INSERT INTO contest_activities("user", "group", contest, activity) VALUES (2, 1, 1, 8) ON CONFLICT DO NOTHING;

INSERT INTO activities(id, "user", name, description, distance, distance_mi, distance_km, moving_time, elapsed_time,total_elevation_gain, elev_high,
                       elev_low, type, start_date, start_date_local, timezone, workout_type, average_speed, max_speed, max_pace_standard, average_pace_standard)
VALUES (9, 2, 'Activity 9', '', 10000, 6.25, 10, 1200, 1500, 100, 100, 0, 'Running', '2020-08-26T08:00:00Z', '2020-08-26T08:00:00Z',
        'CST', 1, 4.1693, 4.1693, 6.4333, 6.4333) ON CONFLICT DO NOTHING;
INSERT INTO contest_activities("user", "group", contest, activity) VALUES (2, 1, 1, 9) ON CONFLICT DO NOTHING;

INSERT INTO activities(id, "user", name, description, distance, distance_mi, distance_km, moving_time, elapsed_time,total_elevation_gain, elev_high,
                       elev_low, type, start_date, start_date_local, timezone, workout_type, average_speed, max_speed, max_pace_standard, average_pace_standard)
VALUES (10, 3, 'Activity 10', '', 5000, 3.13, 5, 1200, 1500, 100, 100, 0, 'Running', '2020-08-24T08:00:00Z', '2020-08-24T08:00:00Z',
        'CST', 1, 4.1693, 4.1693, 6.4333, 6.4333) ON CONFLICT DO NOTHING;
INSERT INTO contest_activities("user", "group", contest, activity) VALUES (3, 1, 1, 10) ON CONFLICT DO NOTHING;

INSERT INTO activities(id, "user", name, description, distance, distance_mi, distance_km, moving_time, elapsed_time,total_elevation_gain, elev_high,
                       elev_low, type, start_date, start_date_local, timezone, workout_type, average_speed, max_speed, max_pace_standard, average_pace_standard)
VALUES (11, 3, 'Activity 11', '', 8000, 6, 8, 1950, 2000, 100, 100, 0, 'Running', '2020-08-25T08:00:00Z', '2020-08-25T08:00:00Z',
        'CST', 1, 4.1265, 4.1265, 6.5, 6.5) ON CONFLICT DO NOTHING;
INSERT INTO contest_activities("user", "group", contest, activity) VALUES (3, 1, 1, 11) ON CONFLICT DO NOTHING;

INSERT INTO activities(id, "user", name, description, distance, distance_mi, distance_km, moving_time, elapsed_time,total_elevation_gain, elev_high,
                       elev_low, type, start_date, start_date_local, timezone, workout_type, average_speed, max_speed, max_pace_standard, average_pace_standard)
VALUES (12, 3, 'Activity 12', '', 10000, 6.25, 10, 1200, 1500, 100, 100, 0, 'Running', '2020-08-26T08:00:00Z', '2020-08-26T08:00:00Z',
        'CST', 1, 4.1693, 4.1693, 6.4333, 6.4333) ON CONFLICT DO NOTHING;
INSERT INTO contest_activities("user", "group", contest, activity) VALUES (3, 1, 1, 12) ON CONFLICT DO NOTHING;

INSERT INTO challenges(id, "group", contest, active, name, description, start_date, end_date, awards, default_award)
VALUES (1, 1, 1, true, 'Run 3 Miles', 'Run at least 3 miles this week. A winner will be selected randomly',
        '2020-08-23', '2020-08-29', '[{"name": "1st place", "points": 150}, {"name": "2nd place", "points": 100},
    {"name": "3rd place", "points": 75}, {"name": "Participation", "points": 50}]', 3) ON CONFLICT DO NOTHING;

INSERT INTO user_challenges("user", "group", contest, activity, challenge, award, points) VALUES
(64124462, 1, 1, 1, 1, 0, 150) ON CONFLICT DO NOTHING;
INSERT INTO user_challenges("user", "group", contest, activity, challenge, award, points) VALUES
(1, 1, 1, 4, 1, 1, 100) ON CONFLICT DO NOTHING;
INSERT INTO user_challenges("user", "group", contest, activity, challenge, award, points) VALUES
(2, 1, 1, 7, 1, 2, 75) ON CONFLICT DO NOTHING;
INSERT INTO user_challenges("user", "group", contest, activity, challenge, award, points) VALUES
(3, 1, 1, 10, 1, 3, 50) ON CONFLICT DO NOTHING;
