# salestrack
This is a budgeting and Sales tracking system

# Getting started
## Backend Setup
1. Clone the repo

2. Go the git project folder

```
cd salestrack
```

3. Create/activate a Virtual environment in the project folder
    3.a if This is the first time, you need to create a Virtual environment in the project folder
        If you need to install venv in ubuntu system, run command:
        ```
        sudo apt install python3-venv
        ```

        ```
        python3 -m venv django-env
        ```
    3.b if not the first time, then activate only:
        ```
        . django-env/bin/activate
        ```

4. Install all the dependencies

```
pip install -r requirements.txt
```

5. Move to the application folder

```
cd salestrack
```

6. duplicate `settings.base.py` as `settings.py`
Create the settings file and change `SECRET_KEY` 

7. Apply all the migrations

```
python manage.py migrate
```

8. Create superuser
```
python manage.py createsuperuser
```

## UI Setup
The UI for this project is created with React
9. Install npm (if not already installed)

10. Verify your node version. We are currently running on 12.16.2

11. Install all required packages
```
npm install
```
This will take a while...

12. Create the javascript bundle
```
npm start
```

## Start the server (finally)
13. Start the server

```
python manage.py runserver
```

