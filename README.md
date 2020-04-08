# salestrack
This is a budgeting and Sales tracking system

# Getting started
1. Clone the repo

2. Go the git project folder

```
cd salestrack
```

3. Activate your virtual environment.
    3.a if This is the first time, you need to create a Virtual environment in the project folder
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

6. Apply all the migrations

```
python manage.py migrate
```

7. Start the server

```
python manage.py runserver
```

