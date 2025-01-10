const teamName = document.getElementById("team");
const typeOfSport = document.getElementById("sport");
const worldCupYear = document.getElementById("year");
const headCoach = document.getElementById("head-coach");
const playerCards = document.getElementById("player-cards");
const playersDropdownList = document.getElementById("players");
const countryDropdownList = document.getElementById("country");

let selectedPlayerFilter = "all"; 
let currentPlayers = []; 

const fetchTeamData = async () => {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Failed to load data');
    const data = await response.json();

    if (!data.teams || data.teams.length === 0) throw new Error('No teams data found');

    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    alert('Error loading data. Please try again later.');
  }
};

const updateTeamStats = (teamData) => {
  const { sport, team, year, headCoach: { coachName }, players } = teamData;

  typeOfSport.textContent = sport;
  teamName.textContent = team;
  worldCupYear.textContent = year;
  headCoach.textContent = coachName;

  currentPlayers = players; 
  setPlayerCards(currentPlayers);
};

const setPlayerCards = (players) => {
  const filteredPlayers = filterPlayers(players, selectedPlayerFilter);
  playerCards.innerHTML = filteredPlayers
    .map(({ name, position, number, isCaptain, nickname }) => `
      <div class="player-card">
        <h2>${isCaptain ? "(Captain) " : ""}${name}</h2>
        <p>Position: ${position}</p>
        <p>Number: ${number}</p>
        <p>Nickname: ${nickname || "N/A"}</p>
      </div>
    `)
    .join('');
};

const filterPlayers = (players, filterValue) => {
  if (filterValue === "all") return players;
  return players.filter(player => player.position.toLowerCase() === filterValue);
};

const updateCountryTeamData = (data, selectedCountry) => {
  const selectedTeam = data.teams.find(team => team.team === selectedCountry);
  if (!selectedTeam) {
    console.error('Selected country not found');
    alert('Country not found in the data!');
    return;
  }

  updateTeamStats(selectedTeam);
};

const handleCountryChange = (data) => {
  countryDropdownList.addEventListener("change", (e) => {
    const selectedCountry = e.target.value;
    updateCountryTeamData(data, selectedCountry);
  });
};

const handlePlayerFilterChange = () => {
  playersDropdownList.addEventListener("change", (e) => {
    selectedPlayerFilter = e.target.value; 
    setPlayerCards(currentPlayers); 
  });
};

const initialize = async () => {
  const data = await fetchTeamData();
  if (!data) return;

  const defaultCountry = "France";
  const initialTeam = data.teams.find(team => team.team === defaultCountry);
  if (initialTeam) updateTeamStats(initialTeam);

  handleCountryChange(data);

  if (initialTeam) handlePlayerFilterChange();
};

initialize();
