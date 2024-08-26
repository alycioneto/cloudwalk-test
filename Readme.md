# Quake Log Parser

## Overview

This project is a log parser for Quake, designed to process and extract detailed information from game logs. The logs include data on matches, player kills, and the causes of deaths during the game. The parser reads the log file, groups data for each match, and generates reports including player rankings and death causes.

## Features

- **Log File Parsing**: Reads and processes the Quake log file to extract relevant game data.
- **Match Grouping**: Groups the data by each match, identifying total kills, players involved, and individual player kill counts.
- **Kill Data Collection**: Tracks and records kill events, including the players involved and the methods used.
- **Match Reports**: Generates a detailed report for each match, including total kills, players, and kill statistics.
- **Player Ranking**: Provides a ranking of players based on their performance in each match.
- **Death Cause Reporting**: Outputs a report of deaths grouped by their causes for each match.

## Project Setup and Execution

### Prerequisites

- Node.js (20.16 or higher)
- NPM (10.8.1 or higher)

If you have `nvm` (Node Version Manager) installed, you can run the following command to automatically switch to the required Node.js version:

```sh
nvm use
```

### Setup:

```bash
# Install project dependencies and build.
$ make setup
```

### Run:

Place the Quake log file (logs.txt) in the project directory data.
Run project

```bash
$ make run
```

### Testing:

```bash
# Run all tests
$ make test

# Run test coverage
$ make coverage
```

### Clean:

```bash
# Clean build, coverage and dependencies
$ make clean
```

## Project Insights

### Development Approach

1. **Single Game Parsing First**: The initial focus is on resolving the parsing logic for a single game. Once this is accomplished, the implementation will be extended to handle multiple games within the log file.

2. **Optimized File Handling**: Initially, there was a consideration to combine reading and parsing into a single process to avoid multiple iterations over the data. However, based on the assumption that minimizing the duration of file reading operations would be more efficient, and considering that the file size is not very large, the approach is to load the entire file into memory, returning an array of strings where each element represents a line in the log.

3. **Selective Line Processing**: During development, it was observed that many lines in the log were not relevant to the key actions (e.g., game initialization or player kills). As an optimization, the parser now selectively adds only those lines that are critical to the analysis, such as game start events or kills, to the processing list.

4. **Handling Negative Scores**: A decision was made to allow for negative scores when players die more than they kill, particularly due to environmental causes (e.g., the “<world>” entity in the game). However, there's an open consideration to enforce a rule that prevents player scores from dropping below zero.

5. **Special Cases - Self-Destruction**: In cases where a player self-destructs, this is currently counted as an additional death. The need for a specific rule to handle this scenario is under consideration, as it may impact the accuracy of the kill-death ratio.

6. **Reporting Order**: There was some ambiguity regarding whether the kill ranking should be per match or based on total kills across all matches. To cover both bases, the reports now include both options, ensuring clarity and flexibility in data presentation.
