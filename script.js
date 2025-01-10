const teamName = document.getElementById("team");
const typeOfSport = document.getElementById("sport");
const worldCupYear = document.getElementById("year");
const headCoach = document.getElementById("head-coach");
const playerCards = document.getElementById("player-cards");
const playersDropdownList = document.getElementById("players");
const countryDropdownList = document.getElementById("country");

fetch('data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    
    if (!data.teams || data.teams.length === 0) {
      throw new Error('No teams data found');
    }

    const selectedTeam = data.teams.find(team => team.team === "France");

    if (!selectedTeam) {
      throw new Error('Selected team not found in the data');
    }

    const { sport, team, year, players } = selectedTeam;
    const { coachName } = selectedTeam.headCoach;

    typeOfSport.textContent = sport;
    teamName.textContent = team;
    worldCupYear.textContent = year;
    headCoach.textContent = coachName;

    const setPlayerCards = (arr = players) => {
      playerCards.innerHTML = ''; 
      playerCards.innerHTML += arr
        .map(
          ({ name, position, number, isCaptain, nickname }) => {
            return `
            <div class="player-card">
              <h2>${isCaptain ? "(Captain)" : ""} ${name}</h2>
              <p>Position: ${position}</p>
              <p>Number: ${number}</p>
              <p>Nickname: ${nickname !== null ? nickname : "N/A"}</p>
            </div>
          `;
          }
        )
        .join('');
    };

    playersDropdownList.addEventListener("change", (e) => {
      switch (e.target.value) {
        case "forward":
          setPlayerCards(players.filter((player) => player.position === "forward"));
          break;
        case "midfielder":
          setPlayerCards(players.filter((player) => player.position === "midfielder"));
          break;
        case "defender":
          setPlayerCards(players.filter((player) => player.position === "defender"));
          break;
        case "goalkeeper":
          setPlayerCards(players.filter((player) => player.position === "goalkeeper"));
          break;
        default:
          setPlayerCards(players);
          break;
      }
    });

    countryDropdownList.addEventListener("change", (e) => {
      const selectedCountry = e.target.value;
      const countryTeam = data.teams.find(team => team.team === selectedCountry);

      if (countryTeam) {
        setPlayerCards(countryTeam.players);
      } else {
        console.log('Country not found');
        alert('Country not found in the data!');
      }
    });

    setPlayerCards(players);
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });
