# Exercice backend

Création du backend en suivant des spécifications concernant l'API

## Lancement

L'application est conteneurisée et peut être lancée par un simple `docker compose up`.

Au prélable, choisir des valeurs pour les mots de passe, nom d'utilisateur et nom de la base de données et les placer chacune dans le fichier corespondant (voir tableau) dans un dossier `secrets` à la racine de l'application.

Nom du fichier | Rôle
:-------------:|:----:
db_admin_user  | Nom d'utilisateur admin de la BDD
db_admin_pass  | Mot de passe admin de la BDD
db_pass        | Mot de passe de l'utilisateur de la BDD
db_user        | Nom d'utilisateur de la BDD
db_name        | Nom de la BDD utilisée par l'application
