export const ACHIEVEMENT_KEYS = {
    FIRST_GAME: "first_game",
    ALL_GAMES_MASTER: "all_games_master",
    SCORE_1K: "score_1k",
    SCORE_5K: "score_5k",
    SCORE_10K: "score_10k",
    SCORE_50K: "score_50k",
    TEN_GAMES: "ten_games",
    ONE_HUNDRED_GAMES: "one_hundred_games",
 } as const;
 
 export const ACHIEVEMENT_LABELS: Record<string, string> = {
    first_game: "Первая игра",
    all_games_master: "Мастер всех игр",
    score_1k: "Счет 1000",
    score_5k: "Счет 5000",
    score_10k: "Счет 10000",
    score_50k: "Счет 50000",
    ten_games: "10 игр",
    one_hundred_games: "100 игр",
 };
 
 export const ACHIEVEMENT_DESCRIPTIONS: Record<string, string> = {
    first_game: "Сыграйте свою первую игру",
    all_games_master: "Сыграйте во все 5 игр",
    score_1k: "Наберите 1000 очков",
    score_5k: "Наберите 5000 очков",
    score_10k: "Наберите 10000 очков",
    score_50k: "Наберите 50000 очков",
    ten_games: "Сыграйте 10 игр",
    one_hundred_games: "Сыграйте 100 игр",
 };