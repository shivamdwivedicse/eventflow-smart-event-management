-- Supabase Schema for EventFlow

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Helper Functions
create or replace function handle_updated_at() returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

-- 1. Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text not null check (role in ('participant', 'judge', 'organizer')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger profiles_updated_at before update on profiles for each row execute procedure handle_updated_at();

-- Auth Role Function (must be created after profiles table)
create or replace function auth_role() returns text as $$
  select role from public.profiles where id = auth.uid();
$$ language sql security definer;

-- 2. Events
create table events (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  date text not null,
  location text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger events_updated_at before update on events for each row execute procedure handle_updated_at();

-- 3. Participants
create table participants (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references profiles(id) on delete cascade not null,
  event_id uuid references events(id) on delete cascade not null,
  skills text[],
  preferred_role text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger participants_updated_at before update on participants for each row execute procedure handle_updated_at();

-- 4. Teams
create table teams (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) on delete cascade not null,
  name text not null,
  project_status text default 'In Progress',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger teams_updated_at before update on teams for each row execute procedure handle_updated_at();

-- 5. Team Members
create table team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references teams(id) on delete cascade not null,
  participant_id uuid references participants(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(team_id, participant_id)
);

-- 5.5 Team Requests
create table team_requests (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references teams(id) on delete cascade not null,
  from_user_id uuid references profiles(id) on delete cascade not null,
  to_user_id uuid references profiles(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger team_requests_updated_at before update on team_requests for each row execute procedure handle_updated_at();

-- 6. Projects
create table projects (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references teams(id) on delete cascade not null,
  name text not null,
  description text,
  technologies text[],
  status text default 'submitted',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger projects_updated_at before update on projects for each row execute procedure handle_updated_at();

-- 7. Announcements
create table announcements (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) on delete cascade not null,
  title text not null,
  message text not null,
  priority text default 'low',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger announcements_updated_at before update on announcements for each row execute procedure handle_updated_at();

-- 8. Judges
create table judges (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references profiles(id) on delete cascade not null,
  event_id uuid references events(id) on delete cascade not null,
  created_at timestamptz default now()
);

-- 9. Judge Assignments
create table judge_assignments (
  id uuid default uuid_generate_v4() primary key,
  judge_id uuid references judges(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(judge_id, project_id)
);

-- 10. Evaluations
create table evaluations (
  id uuid default uuid_generate_v4() primary key,
  judge_id uuid references judges(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade not null,
  feedback text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(judge_id, project_id)
);
create trigger evaluations_updated_at before update on evaluations for each row execute procedure handle_updated_at();

-- 11. Rubrics
create table rubrics (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) on delete cascade not null,
  criteria_name text not null,
  max_score int not null check (max_score > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger rubrics_updated_at before update on rubrics for each row execute procedure handle_updated_at();

-- 12. Evaluation Scores
create table evaluation_scores (
  id uuid default uuid_generate_v4() primary key,
  evaluation_id uuid references evaluations(id) on delete cascade not null,
  rubric_id uuid references rubrics(id) on delete cascade not null,
  score int not null check (score >= 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(evaluation_id, rubric_id)
);
create trigger evaluation_scores_updated_at before update on evaluation_scores for each row execute procedure handle_updated_at();

-- Validation Trigger for Evaluation Scores
create or replace function check_score_max() returns trigger as $$
declare
  max_val int;
begin
  select max_score into max_val from rubrics where id = NEW.rubric_id;
  if NEW.score < 0 or NEW.score > max_val then
    raise exception 'Score % is out of bounds (0 - %)', NEW.score, max_val;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger validate_score_max
before insert or update on evaluation_scores
for each row execute procedure check_score_max();

-- 13. Check-ins
create table check_ins (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) on delete cascade not null,
  profile_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(event_id, profile_id)
);

-- INDEXES
create index idx_profiles_role on profiles(role);
create index idx_participants_profile on participants(profile_id);
create index idx_participants_event on participants(event_id);
create index idx_teams_event on teams(event_id);
create index idx_team_members_team on team_members(team_id);
create index idx_team_members_participant on team_members(participant_id);
create index idx_team_requests_team on team_requests(team_id);
create index idx_team_requests_from on team_requests(from_user_id);
create index idx_team_requests_to on team_requests(to_user_id);
create index idx_projects_team on projects(team_id);
create index idx_announcements_event on announcements(event_id);
create index idx_judges_profile on judges(profile_id);
create index idx_judges_event on judges(event_id);
create index idx_judge_assignments_judge on judge_assignments(judge_id);
create index idx_judge_assignments_project on judge_assignments(project_id);
create index idx_evaluations_judge on evaluations(judge_id);
create index idx_evaluations_project on evaluations(project_id);
create index idx_evaluation_scores_eval on evaluation_scores(evaluation_id);
create index idx_check_ins_profile on check_ins(profile_id);

-- ROW LEVEL SECURITY (RLS)
alter table profiles enable row level security;
alter table events enable row level security;
alter table participants enable row level security;
alter table teams enable row level security;
alter table team_members enable row level security;
alter table team_requests enable row level security;
alter table projects enable row level security;
alter table announcements enable row level security;
alter table judges enable row level security;
alter table judge_assignments enable row level security;
alter table evaluations enable row level security;
alter table rubrics enable row level security;
alter table evaluation_scores enable row level security;
alter table check_ins enable row level security;

-- Profiles
create policy "Profiles viewable by everyone" on profiles for select using (true);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Organizers manage profiles" on profiles for all using (auth_role() = 'organizer');

-- Events
create policy "Events viewable by everyone" on events for select using (true);
create policy "Organizers manage events" on events for all using (auth_role() = 'organizer');

-- Participants
create policy "Participants viewable by everyone" on participants for select using (true);
create policy "Users can insert own participant record" on participants for insert with check (profile_id = auth.uid());
create policy "Users can update own participant record" on participants for update using (profile_id = auth.uid());
create policy "Organizers manage participants" on participants for all using (auth_role() = 'organizer');

-- Teams
create policy "Teams viewable by everyone" on teams for select using (true);
create policy "Participants create teams" on teams for insert with check (auth_role() in ('participant', 'organizer'));
create policy "Team members update teams" on teams for update using (
  exists (
    select 1 from team_members tm
    join participants p on tm.participant_id = p.id
    where tm.team_id = teams.id and p.profile_id = auth.uid()
  )
);
create policy "Organizers manage teams" on teams for all using (auth_role() = 'organizer');

-- Team Members
create policy "Team members viewable by everyone" on team_members for select using (true);
create policy "Participants can join teams" on team_members for insert with check (auth_role() in ('participant', 'organizer'));
create policy "Team members update/delete" on team_members for all using (
  exists (
    select 1 from participants p
    where p.id = team_members.participant_id and p.profile_id = auth.uid()
  )
);
create policy "Organizers manage team members" on team_members for all using (auth_role() = 'organizer');

-- Team Requests
create policy "Team requests viewable by related users" on team_requests for select using (
  from_user_id = auth.uid() or to_user_id = auth.uid() or auth_role() = 'organizer'
);
create policy "Users can create requests" on team_requests for insert with check (from_user_id = auth.uid());
create policy "Users can update received requests" on team_requests for update using (to_user_id = auth.uid());
create policy "Users can delete own requests" on team_requests for delete using (from_user_id = auth.uid() or to_user_id = auth.uid());
create policy "Organizers manage team requests" on team_requests for all using (auth_role() = 'organizer');

-- Projects
create policy "Projects viewable by everyone" on projects for select using (true);
create policy "Team members insert projects" on projects for insert with check (
  exists (
    select 1 from team_members tm
    join participants p on tm.participant_id = p.id
    where tm.team_id = projects.team_id and p.profile_id = auth.uid()
  )
);
create policy "Team members update projects" on projects for update using (
  exists (
    select 1 from team_members tm
    join participants p on tm.participant_id = p.id
    where tm.team_id = projects.team_id and p.profile_id = auth.uid()
  )
);
create policy "Organizers manage projects" on projects for all using (auth_role() = 'organizer');

-- Announcements
create policy "Announcements viewable by everyone" on announcements for select using (true);
create policy "Organizers manage announcements" on announcements for all using (auth_role() = 'organizer');

-- Judges
create policy "Judges viewable by everyone" on judges for select using (true);
create policy "Organizers manage judges" on judges for all using (auth_role() = 'organizer');

-- Judge Assignments
create policy "Judge assignments viewable by everyone" on judge_assignments for select using (true);
create policy "Organizers manage judge assignments" on judge_assignments for all using (auth_role() = 'organizer');

-- Evaluations
create policy "Evaluations viewable by everyone" on evaluations for select using (true);
create policy "Judges insert evaluations" on evaluations for insert with check (
  exists (select 1 from judges j where j.id = evaluations.judge_id and j.profile_id = auth.uid())
);
create policy "Judges update own evaluations" on evaluations for update using (
  exists (select 1 from judges j where j.id = evaluations.judge_id and j.profile_id = auth.uid())
);
create policy "Organizers manage evaluations" on evaluations for all using (auth_role() = 'organizer');

-- Rubrics
create policy "Rubrics viewable by everyone" on rubrics for select using (true);
create policy "Organizers manage rubrics" on rubrics for all using (auth_role() = 'organizer');

-- Evaluation Scores
create policy "Evaluation scores viewable by everyone" on evaluation_scores for select using (true);
create policy "Judges insert scores" on evaluation_scores for insert with check (
  exists (
    select 1 from evaluations e 
    join judges j on e.judge_id = j.id 
    where e.id = evaluation_scores.evaluation_id and j.profile_id = auth.uid()
  )
);
create policy "Judges update scores" on evaluation_scores for update using (
  exists (
    select 1 from evaluations e 
    join judges j on e.judge_id = j.id 
    where e.id = evaluation_scores.evaluation_id and j.profile_id = auth.uid()
  )
);
create policy "Organizers manage evaluation scores" on evaluation_scores for all using (auth_role() = 'organizer');

-- Check-ins
create policy "Check-ins viewable by everyone" on check_ins for select using (true);
create policy "Organizers manage check-ins" on check_ins for all using (auth_role() = 'organizer');
create policy "Participants self check-in" on check_ins for insert with check (profile_id = auth.uid());
