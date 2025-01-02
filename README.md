# Sorcerer Soup
The companion app for a computer assisted table top role playing game.

## Motivation

Sorcerer Soup is a game I created to explore what an RPG like Monster of the Week would look like if some aspects were automated by a computer. I hope to create a final product that is easy for GMs to pick up and easy for players new to the genre to learn, while still being entertaining and complex. A lot of the complexity can be artfully coded into a computer so that the GM can create rich worlds with relatively little effort.

## Features

The main three features of the website are:
1. Character Creator
2. Spell Picker
3. Sorcerer Soup Spell Language (SSSLang) for creating new spells from templates and data files.

### 1. Character Creator
The character creator is mostly just a form with the spell picker attached. It asks players questions that prompt them to think creatively about the character the want to bring to life in the GM's world, and generates base stats for each character. It is also useful for Game Masters so that they can create interesting NPCs quickly.

### 2. Spell Picker
The spell picker is a search utility that allows users to filter for different types of spells available in the game. It is also useful for GMs to quickly create spell merchants/lootboxes, which is how the pace of each game is dictated (as opposed to 'leveling' which is the more common paradigm in TTRPGs).

### 3. Sorcerer Soup Spell Language (SSSLang)
SSSLang is a small templating langauge I created so that large amounts of spells can be created quickly to add to the game. Since Sorcerer Soup as a game relies entirely on spells to 'level up' player characters, and since the main point of the RPG is to find many interesting spells, and since often times an interesting spell ends up providing players with in game goals and quests to strive for, I decided that there needed to be thousands of spells in the game. The best way to achieve that was to partially automate the creation of spells. SSSLang still allows for some madlib style creativity (on steroids) from me and GMs who choose to use it, but also provides us with the iterative and recursive power of a computer to aid us in creating a large number of spells from more basic data sets. 

## Tech Stack

 - Sveltekit

Currently the web app does not use anthing technology except for sveltekit, but I expect to be implementing a database (probably MongoDB) and some kind of image bucket (probably S3) in the future.