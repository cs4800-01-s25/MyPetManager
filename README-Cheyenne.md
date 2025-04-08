# MyPetManager by Cache Me If You Can
Website Repo holding frontend and backend for MyPetManager, a CS4800 group project.

This is the main repository for our project and our current team members by last name are:

```
Cheyenne Chavis
Gian David Marquez
My Lien Tan
Brandon Vo
```

<!-- We can add this later. -->
<!--
## Table of Contents
-->

## Prep Your Development Environment

Let's make sure that Node.js is installed before coloning the repository.

### Clone Repo and Check Dependencies

This project requires Node.js (Node) and we assume you already have it installed. We will now walk you through cloning this repository and make sure that all of its dependencies are installed on your local machine.

This guide assumes you have [git](https://git-scm.com/) downloaded

Our code is organized under the `MyPetManager` folder as its top-level container. The following examples keep all repositories under the `cs4800website` folder.

Hence the file structure for this current system guide is`C:\4800website\MyPetManager`

First browse to the parent folder where you want `MyPetManager` to be in your file system. On the command line:

`cs4800website` 

Second invoke the command `git` to clone this repository:

`git clone https://github.com/cs4800-01-s25/MyPetManager.git`

Third verify that your commit name and email are correct:

`git config --list | grep user.`

The relevant information should appear like this if your email address is aliased for privacy:

```
user.name=First Last
user.email=username@users.noreply.github.com
```

There are `npm` commands to install dependencies, whose versions specified in a `package.json` file, and to run the frontend and backend packages.

Fourth invoke the command to install dependencies:

`npm install`

At this point you are still in the top-level folder and should have the most recent files. Please refer to the next section for developer notes.

## Developer Notes

`npm test`

This calls the `test` script that will call the development scrips for both the backend and frontend. We will use the `Ctrl` and `C` key stroke to send a termination signal to server hosted on a port on your local machine.



<!--
We assume that you are in the `MyPetManager` top-level folder in a separate terminal session where you'll be able to monitor standard out as the backend and frontend run. The following `npm` command will run them concurrently:

`npm start`

This calls the `start` script within each workspace. For now we will use the `Ctrl` and `C` key stroke to send a termination signal to the backend and frontend servers.

!-->
