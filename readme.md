# Clinic_Appointment_App_API
Built with Django and Django-REST-Framework

## Table of Contents
  - [Features](#features)
    - [Implemented](#implemented)
    - [Todo](#todo)
  - [Installation guide](#installation-guide)
    - [Dependacies Installation](#dependacies-installation)
  - [Testing and Running Guide](#testing-and-running-guide)
  - [API Documentation](#api-documentation)
  - [Key Python Modules Used](#key-python-modules-used)
  - [Reference Resources](#reference-resources)


## Features
### Implemented
0. Generate token (Login), Revoke token by User
1. CRUD Blog
2. CRUD Projects
3. CRUD Profile
4.


### Todo
- Document apis with Postman
- JWT Authentication
- Frontend with Angular
- Create and Send Notifications (Calery)
- Write tests


## Installation Guide

### Dependacies Installation

- Installing the application locally requires
    1. [Python 3.7+](https://www.python.org/downloads/release/python-393/) - download and install it.
    2. [virtualenv](https://docs.python-guide.org/dev/virtualenvs/) - To create a virtual environment and activate it, run the following commands.
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
- The project contains a `.env.sample` file at its root with the environment variables required to run the app. Copy the file and name it `.env`, populating it with the correct values.
  __NOTE:__ The 'SECRET_KEY' environment variables is a long random bytes or str.

- Install the project dependacies from requirements.txt by running the following command in shell:
```bash
pip install -r requirements.txt
```

## Testing and Running Guide
1. To activate the development server run:
```bash
python manage.py runserver
```
At this point, the development server should be accessible at _http://127.0.0.1:8000/api/v1/_

2. Testing - To run all the tests:

```bash
python manage.py test
```


## API Documentation
- **DRF Docs:** [http://127.0.0.1:8000/api/v1/](http://127.0.0.1:8000/api/v1/)
- **OpenAPI Specification Docs:** [http://127.0.0.1:8000/?format=openapi-json](http://127.0.0.1:8000/?format=openapi-json)

## Key Python Modules Used
- **Django(4.2.5):** Django is a back-end server side web framework. Django is free, open source and written in Python. Django makes it easier to build web pages using Python.
- **Django Rest Framework:** Django Rest Framework (DRF) is a package built on the top of Django to create web APIs. DRF allows us to represent their functionality Django application in the form of REST APIs.
- **flake8** - static analysis tool

## Reference Resources
- [virtualenv](https://docs.python-guide.org/dev/virtualenvs/)
- [Django(4.2.3)](https://docs.djangoproject.com/en/4.2/intro/overview/)
- [Django Rest Framework](https://www.django-rest-framework.org/)



```
class HasIDMixin(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
        name='id'
    )
```
